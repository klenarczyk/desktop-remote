using System.Net;
using System.Net.Sockets;
using QRCoder;

namespace Api;

public static class NetworkHelper
{
    public static string GetLocalIPv4()
    {
        using var socket = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, 0);

        try
        {
            socket.Connect("8.8.8.8", 65530);

            if (socket.LocalEndPoint is IPEndPoint endPoint)
            {
                return endPoint.Address.ToString();
            }
        }
        catch
        {
            return "127.0.0.1";
        }
        
        return "127.0.0.1";
    }
}