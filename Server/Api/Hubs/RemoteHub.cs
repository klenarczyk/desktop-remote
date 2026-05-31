using Api.Features.MouseControl;
using Microsoft.AspNetCore.SignalR;

namespace Api.Hubs;

public class RemoteHub(IMouseService mouseService) : Hub
{
    public void MoveMouse(int dx, int dy)
    {
        mouseService.MoveMouseBy(dx, dy);
    }
}