using System.Runtime.InteropServices;
using System.Runtime.Versioning;
using Vanara.PInvoke;

namespace Api.Features.KeyboardControl;

[SupportedOSPlatform("windows")]
public class WindowsKeyboardService : IKeyboardService
{
    public void TypeText(string input)
    {
        switch (input)
        {
            case "{BACKSPACE}": SendVirtualKey((ushort)User32.VK.VK_BACK); return;
            case "{ENTER}": SendVirtualKey((ushort)User32.VK.VK_RETURN); return;
            case "{ESC}": SendVirtualKey((ushort)User32.VK.VK_ESCAPE); return;
            case "{LEFT}": SendVirtualKey((ushort)User32.VK.VK_LEFT); return;
            case "{RIGHT}": SendVirtualKey((ushort)User32.VK.VK_RIGHT); return;
            case "{BROWSER_BACK}": SendVirtualKey((ushort)User32.VK.VK_BROWSER_BACK); return;
        }

        foreach (var c in input)
        {
            SendChar(c);
        }
    }

    private static void SendVirtualKey(ushort key)
    {
        var inputs = new User32.INPUT[2];
        
        // Down
        inputs[0].type = User32.INPUTTYPE.INPUT_KEYBOARD;
        inputs[0].ki = inputs[0].ki with { wVk = key };
        
        // Up
        inputs[1].type = User32.INPUTTYPE.INPUT_KEYBOARD;
        inputs[1].ki = inputs[1].ki with
        {
            wVk = key, 
            dwFlags = User32.KEYEVENTF.KEYEVENTF_KEYUP
        };
        
        User32.SendInput((ushort)inputs.Length, inputs, Marshal.SizeOf(typeof(User32.INPUT)));
    }
    
    private static void SendChar(char c)
    {
        var inputs = new User32.INPUT[2];

        // Down
        inputs[0].type = User32.INPUTTYPE.INPUT_KEYBOARD;
        inputs[0].ki = inputs[0].ki with
        {
            wScan = c, 
            dwFlags = User32.KEYEVENTF.KEYEVENTF_UNICODE
        };

        // Up
        inputs[1].type = User32.INPUTTYPE.INPUT_KEYBOARD;
        inputs[1].ki = inputs[1].ki with
        {
            wScan = c, 
            dwFlags = User32.KEYEVENTF.KEYEVENTF_UNICODE | User32.KEYEVENTF.KEYEVENTF_KEYUP
        };

        User32.SendInput((uint)inputs.Length, inputs, Marshal.SizeOf(typeof(User32.INPUT)));
    }
}