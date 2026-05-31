using Api.Features.MouseControl;
using Microsoft.AspNetCore.SignalR;

namespace Api.Hubs;

public class RemoteHub(IMouseService mouseService) : Hub
{
    public void MoveMouse(int dx, int dy)
    {
        mouseService.MoveMouseBy(dx, dy);
    }

    public void LeftClick()
    {
        mouseService.LeftClick();
    }

    public void RightClick()
    {
        mouseService.RightClick();
    }

    public void Scroll(int dy)
    {
        mouseService.ScrollBy(dy);
    }
}