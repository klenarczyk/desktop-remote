namespace Api.Security;

public class SessionState
{
    public string PairingPin { get; } = Random.Shared.Next(1000, 10000).ToString();
}