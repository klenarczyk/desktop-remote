using QRCoder;

namespace Api;

public class TrayUi : ApplicationContext
{
    private readonly NotifyIcon _trayIcon;
    private readonly Form _qrPopup;
    private static TrayUi? _instance;

    public TrayUi(string url, string pairingPin)
    {
        _instance = this;
        
        using var qrGenerator = new QRCodeGenerator();
        using var qrData = qrGenerator.CreateQrCode(url, QRCodeGenerator.ECCLevel.M);
        using var qrCode = new QRCode(qrData);
        var qrImage = qrCode.GetGraphic(5);

        _qrPopup = new Form
        {
            Text = $"Remote URL | Pin: {pairingPin}",
            Size = new Size(250, 250),
            StartPosition = FormStartPosition.CenterScreen,
            FormBorderStyle = FormBorderStyle.FixedToolWindow,
            TopMost = true,
            ShowInTaskbar = false
        };
        
        var pictureBox = new PictureBox
        {
            Image = qrImage,
            SizeMode = PictureBoxSizeMode.Zoom,
            Dock = DockStyle.Fill
        };
        _qrPopup.Controls.Add(pictureBox);

        var iconStream = typeof(TrayUi).Assembly.GetManifestResourceStream("Api.app.ico");
        _trayIcon = new NotifyIcon
        {
            Icon = new Icon(iconStream!),
            Text = "Remote Control",
            Visible = true,
            ContextMenuStrip = new ContextMenuStrip()
        };
        
        var trayPairingPin = _trayIcon.ContextMenuStrip.Items.Add($"Pairing Pin: {pairingPin}", null);
        _trayIcon.ContextMenuStrip.Items.Add("Show QR Code", null, (s, e) => _qrPopup.Show());
        _trayIcon.ContextMenuStrip.Items.Add("Exit", null, (s, e) => ExitApp());
        
        trayPairingPin.Enabled = false;
        
        _qrPopup.Show();
        
        _qrPopup.FormClosing += (s, e) =>
        {
            if (e.CloseReason != CloseReason.UserClosing) return;
            e.Cancel = true;
            _qrPopup.Hide();
        };
    }

    public static void HidePopup()
    {
        if (_instance == null || !_instance._qrPopup.Visible) return;
        _instance._qrPopup.Invoke(new MethodInvoker(() => _instance._qrPopup.Hide()));
    }

    private void ExitApp()
    {
        _trayIcon.Visible = false;
        Application.Exit();
        Environment.Exit(0);
    }
}