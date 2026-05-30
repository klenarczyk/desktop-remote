using System.Runtime.InteropServices;
using Api.Features.AudioControl;
using Api.Features.MediaControl;
using Api.Features.MouseControl;

var builder = WebApplication.CreateBuilder(args);

if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
{
    builder.Services.AddSingleton<IMediaService, WindowsMediaService>();
    builder.Services.AddSingleton<IAudioService, WindowsAudioService>();
    builder.Services.AddSingleton<IMouseService, WindowsMouseService>();
}
else
{
    throw new PlatformNotSupportedException("Currently only supports Windows");
}

// ---

var app = builder.Build();

app.UseStaticFiles();

app.MapGet("/", () => "Hello World!");

app.MapFallbackToFile("index.html");

app.Run();
