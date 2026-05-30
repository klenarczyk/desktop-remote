namespace Api.Features.AudioControl;

public interface IAudioService
{
    void ChangeVolume(float delta);
    void SetVolume(float level);
    void ToggleMute();
}