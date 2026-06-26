using Api;
using Api.Data;
using Api.Features.AudioControl;
using Api.Features.KeyboardControl;
using Api.Features.MediaControl;
using Api.Features.MouseControl;
using Api.Hubs;
using Api.Security;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Timer = System.Timers.Timer;

const int serverPort = 7546;

var builder = WebApplication.CreateBuilder(args);

var sessionState = new SessionState();
builder.Services.AddSingleton(sessionState);

builder.Services.AddDbContext<AppDbContext>();
builder.Services.AddSingleton<IUserIdProvider, DeviceIdProvider>();
builder.Services.AddSignalR();

builder.WebHost.UseUrls($"http://0.0.0.0:{serverPort}");

if (OperatingSystem.IsWindows())
{
    builder.Services.AddSingleton<IMediaService, WindowsMediaService>();
    builder.Services.AddSingleton<IAudioService, WindowsAudioService>();
    builder.Services.AddSingleton<IMouseService, WindowsMouseService>();
    builder.Services.AddSingleton<IKeyboardService, WindowsKeyboardService>();
}
else
{
    throw new PlatformNotSupportedException("Currently supported platforms: Windows");
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy => policy
        .SetIsOriginAllowed(_ => true)
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials());
});

// ---

var timeoutDuration = TimeSpan.FromHours(2).TotalMilliseconds;

var idleTimer = new Timer(timeoutDuration);
idleTimer.Elapsed += (_, _) =>
{
    Application.Exit();
    Environment.Exit(0);
};

idleTimer.Start();

// ---

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.UseCors("AllowAll");
app.UseStaticFiles();

app.Use(async (_, next) =>
{
    idleTimer.Stop();
    idleTimer.Start();
    await next();
    return;
});

app.Use(async (context, next) =>
{
    var path = context.Request.Path.Value;

    if (path == "/" || path!.StartsWith("/assets") || path == "/api/system/pair")
    {
        await next();
        return;
    }
    
    var deviceId = context.Request.Headers["X-Device-Id"].FirstOrDefault()
                   ?? context.Request.Query["deviceId"].FirstOrDefault();

    if (string.IsNullOrEmpty(deviceId))
    {
        context.Response.StatusCode = 401;
        return;
    }
    
    var db = context.RequestServices.GetRequiredService<AppDbContext>();
    if (!await db.TrustedDevices.AnyAsync(d => d.DeviceId == deviceId))
    {
        context.Response.StatusCode = 401;
        return;
    }
    
    await next();
    return;
});

app.Use(async (_, next) =>
{
    TrayUi.HidePopup();
    await next();
});

// ---

app.MapHub<RemoteHub>("/remoteHub");
app.MapRemoteEndpoints();
app.MapFallbackToFile("index.html");

var localIp = NetworkHelper.GetLocalIPv4();
var url = $"http://{localIp}:{serverPort}";

_ = app.RunAsync();

Application.EnableVisualStyles();
Application.SetCompatibleTextRenderingDefault(false);

Application.Run(new TrayUi(url, sessionState.PairingPin, app.Services));