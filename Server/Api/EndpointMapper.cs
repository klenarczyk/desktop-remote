using Api.Data;
using Api.Features.AudioControl;
using Api.Features.MediaControl;
using Api.Features.MouseControl;
using Api.Security;
using Microsoft.EntityFrameworkCore;

namespace Api;

public record PairRequest(string DeviceId, string Pin);

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
        
        // --- System ---
        var system = api.MapGroup("/system");

        system.MapPost("/turn-off", () =>
        {
            Application.Exit();
            Environment.Exit(0);
            return Results.Ok();
        });
        
        // Pairing
        api.MapPost("/pair", async (PairRequest req, AppDbContext db, SessionState state) =>
        {
            if (req.Pin != state.PairingPin) 
                return Results.Unauthorized();

            if (!await db.TrustedDevices.AnyAsync(d => d.DeviceId == req.DeviceId))
            {
                db.TrustedDevices.Add(new TrustedDevice { DeviceId = req.DeviceId });
                await db.SaveChangesAsync();
            }

            return Results.Ok();
        });
    }
}