using System.Runtime.Versioning;
using NAudio.CoreAudioApi;

namespace Api.Features.AudioControl;

[SupportedOSPlatform("windows")]
public class WindowsAudioService : IAudioService
{
    private static MMDevice GetDefaultPlaybackDevice()
    {
        using var enumerator = new MMDeviceEnumerator();
        return enumerator.GetDefaultAudioEndpoint(DataFlow.Render, Role.Multimedia);
    }
    
    public void ChangeVolume(float delta)
    {
        using var device = GetDefaultPlaybackDevice();
        var currentVolume = device.AudioEndpointVolume.MasterVolumeLevelScalar;
        device.AudioEndpointVolume.MasterVolumeLevelScalar = Math.Clamp(currentVolume + delta, 0.0f, 1.0f);
    }

    public void SetVolume(float level)
    {
        using var device = GetDefaultPlaybackDevice();
        device.AudioEndpointVolume.MasterVolumeLevelScalar = Math.Clamp(level, 0.0f, 1.0f);
    }

    public void ToggleMute()
    {
        using var device = GetDefaultPlaybackDevice();
        device.AudioEndpointVolume.Mute = !device.AudioEndpointVolume.Mute;
    }
}