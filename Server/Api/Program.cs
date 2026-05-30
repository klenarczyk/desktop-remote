using Api;
using Api.Features.AudioControl;
using Api.Features.MediaControl;
using Api.Features.MouseControl;
using Timer = System.Timers.Timer;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.UseUrls("http://0.0.0.0:7546");

if (OperatingSystem.IsWindows())
{
    builder.Services.AddSingleton<IMediaService, WindowsMediaService>();
    builder.Services.AddSingleton<IAudioService, WindowsAudioService>();
    builder.Services.AddSingleton<IMouseService, WindowsMouseService>();
}
else
{
    throw new PlatformNotSupportedException("Currently supported platforms: Windows");
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy => policy
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader());
});

// ---

var timeoutDuration = TimeSpan.FromHours(2).TotalMilliseconds;

var idleTimer = new Timer(timeoutDuration);
idleTimer.Elapsed += (sender, e) =>
{
    Application.Exit();
    Environment.Exit(0);
};

idleTimer.Start();

// ---

var app = builder.Build();

app.UseCors("AllowAll");

app.Use(async (context, next) =>
{
    idleTimer.Stop();
    idleTimer.Start();

    await next();
});

app.Use(async (context, next) =>
{
    TrayUi.HidePopup();
    await next();
});

app.UseStaticFiles();

app.MapRemoteEndpoints();
app.MapFallbackToFile("index.html");

var localIp = NetworkHelper.GetLocalIPv4();
var url = $"http://{localIp}:7546";

_ = app.RunAsync();

Application.EnableVisualStyles();
Application.SetCompatibleTextRenderingDefault(false);

Application.Run(new TrayUi(url));