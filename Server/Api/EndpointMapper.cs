using Api.Features.AudioControl;
using Api.Features.MediaControl;
using Api.Features.MouseControl;

namespace Api;

public static class EndpointMapper
{
    public record MouseMoveRequest(int Dx, int Dy);
    public record VolumeSetRequest(float Level);
    
    public static void MapRemoteEndpoints(this IEndpointRouteBuilder app)
    {
        var api = app.MapGroup("/api");
        
        // --- Media ---
        var media = api.MapGroup("/media");

        media.MapPost("/toggle", async (IMediaService service) =>
        {
            await service.TogglePlayPauseAsync();
            return Results.Ok();
        });
        
        media.MapPost("/next", async (IMediaService service) =>
        {
            await service.SkipNextAsync();
            return Results.Ok();
        });
        
        media.MapPost("/prev", async (IMediaService service) =>
        {
            await service.SkipPreviousAsync();
            return Results.Ok();
        });
        
        // --- Audio ---
        var audio = api.MapGroup("/audio");
        
        audio.MapPost("/up", (IAudioService service) => {
            service.ChangeVolume(0.05f);
            return Results.Ok();
        });
        
        audio.MapPost("/down", (IAudioService service) => {
            service.ChangeVolume(-0.05f);
            return Results.Ok();
        });
        
        audio.MapPost("/mute", (IAudioService service) => {
            service.ToggleMute();
            return Results.Ok();
        });
        
        // --- Mouse ---
        var mouse = api.MapGroup("/mouse");

        mouse.MapPost("/click", (IMouseService service) => {
            service.LeftClick();
            return Results.Ok();
        });
        
        mouse.MapPost("/move", (MouseMoveRequest req, IMouseService service) => {
            service.MoveMouseBy(req.Dx, req.Dy);
            return Results.Ok();
        });
    }
}