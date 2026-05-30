using System.Runtime.Versioning;
using Windows.Media.Control;

namespace Api.Features.MediaControl;

[SupportedOSPlatform("windows")]
public class WindowsMediaService : IMediaService
{
    private static async Task<GlobalSystemMediaTransportControlsSession?> GetCurrentSessionAsync()
    {
        var manager = await GlobalSystemMediaTransportControlsSessionManager.RequestAsync();
        return manager.GetCurrentSession();
    }
    
    public async Task TogglePlayPauseAsync()
    {
        var session = await GetCurrentSessionAsync();
        if (session != null) await session.TryTogglePlayPauseAsync();
    }

    public async Task SkipNextAsync()
    {
        var session = await GetCurrentSessionAsync();
        if (session != null) await session.TrySkipNextAsync();
    }

    public async Task SkipPreviousAsync()
    {
        var session = await GetCurrentSessionAsync();
        if (session != null) await session.TrySkipPreviousAsync();
    }
}