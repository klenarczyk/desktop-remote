using Microsoft.AspNetCore.SignalR;

namespace Api.Hubs;

public class DeviceIdProvider : IUserIdProvider
{
    public string? GetUserId(HubConnectionContext connection)
        => connection.GetHttpContext()?.Request.Query["deviceId"];
}