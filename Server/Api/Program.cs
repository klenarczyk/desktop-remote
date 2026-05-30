using System.Runtime.InteropServices;
using Api;
using Api.Features.AudioControl;
using Api.Features.MediaControl;
using Api.Features.MouseControl;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.UseUrls("http://0.0.0.0:7546");

if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
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

var app = builder.Build();

app.UseCors("AllowAll");
app.UseStaticFiles();

app.MapRemoteEndpoints();

app.MapFallbackToFile("index.html");

app.Run();
