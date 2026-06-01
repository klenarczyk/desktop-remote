using Api.Features.KeyboardControl;
using Api.Features.MouseControl;
using Microsoft.AspNetCore.SignalR;

namespace Api.Hubs;

public class RemoteHub(IMouseService mouseService, IKeyboardService keyboardService) : Hub
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

    public void TypeText(string input)
    {
        keyboardService.TypeText(input);
    }
}