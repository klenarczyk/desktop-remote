using Api;
using Api.Features.AudioControl;
using Api.Features.KeyboardControl;
using Api.Features.MediaControl;
using Api.Features.MouseControl;
using Api.Hubs;
using Timer = System.Timers.Timer;

const int serverPort = 7546;

var builder = WebApplication.CreateBuilder(args);

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

app.UseCors("AllowAll");

app.Use(async (_, next) =>
{
    idleTimer.Stop();
    idleTimer.Start();

    await next();
});

app.Use(async (_, next) =>
{
    TrayUi.HidePopup();
    await next();
});

app.UseStaticFiles();

app.MapHub<RemoteHub>("/remoteHub");
app.MapRemoteEndpoints();
app.MapFallbackToFile("index.html");

var localIp = NetworkHelper.GetLocalIPv4();
var url = $"http://{localIp}:{serverPort}";

_ = app.RunAsync();

Application.EnableVisualStyles();
Application.SetCompatibleTextRenderingDefault(false);

Application.Run(new TrayUi(url));