using System.Runtime.Versioning;
using Vanara.PInvoke;

namespace Api.Features.MouseControl;

[SupportedOSPlatform("windows")]
public class WindowsMouseService : IMouseService
{
    public void MoveMouseBy(int dx, int dy)
    {
        User32.GetCursorPos(out var currPos);
        User32.SetCursorPos(currPos.X + dx, currPos.Y + dy);
    }

    public void LeftClick()
    {
        User32.mouse_event(User32.MOUSEEVENTF.MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0);
        User32.mouse_event(User32.MOUSEEVENTF.MOUSEEVENTF_LEFTUP, 0, 0, 0, 0);
    }

    public void RightClick()
    {
        User32.mouse_event(User32.MOUSEEVENTF.MOUSEEVENTF_RIGHTDOWN, 0, 0, 0, 0);
        User32.mouse_event(User32.MOUSEEVENTF.MOUSEEVENTF_RIGHTUP, 0, 0, 0, 0);
    }

    public void ScrollBy(int dy)
    {
        User32.mouse_event(User32.MOUSEEVENTF.MOUSEEVENTF_WHEEL, 0, 0, dy, 0);
    }
}