namespace Api.Features.MediaControl;

public interface IMediaService
{
    Task TogglePlayPauseAsync();
    Task SkipNextAsync();
    Task SkipPreviousAsync();
}