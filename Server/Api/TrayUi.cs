using Api.Data;
using Api.Hubs;
using Microsoft.AspNetCore.SignalR;
using QRCoder;

namespace Api;

public class TrayUi : ApplicationContext
{
    private readonly NotifyIcon _trayIcon;
    private readonly Form _qrPopup;
    private static TrayUi? _instance;

    public TrayUi(string url, string pairingPin, IServiceProvider services)
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
        
        _trayIcon.ContextMenuStrip.Items.Add($"Pairing Pin: {pairingPin}", null).Enabled = false;
        _trayIcon.ContextMenuStrip.Items.Add("QR Code", null, (s, e) => _qrPopup.Show());
        
        _trayIcon.ContextMenuStrip.Items.Add(new ToolStripSeparator());

        var devicesMenu = new ToolStripMenuItem("Paired Devices");

        devicesMenu.DropDownOpening += (s, e) =>
        {
            devicesMenu.DropDownItems.Clear();
            
            using var scope = services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var devices = db.TrustedDevices
                .OrderBy(d => d.DeviceName)
                .ThenBy(d => d.PairedAt)
                .ToList();

            if (devices.Count == 0)
            {
                devicesMenu.DropDownItems.Add("No devices paired").Enabled = false;
                return;
            }

            foreach (var device in devices)
            {
                var itemText = $"Revoke: {device.DeviceName} ({device.PairedAt:MMM dd})";
                var item = new ToolStripMenuItem(itemText);

                item.Click += (sender, args) =>
                {
                    using var deleteScope = services.CreateScope();
                    var deleteDb = deleteScope.ServiceProvider.GetRequiredService<AppDbContext>();
                    var hubContext = deleteScope.ServiceProvider.GetRequiredService<IHubContext<RemoteHub>>();
                    
                    var toDelete = deleteDb.TrustedDevices.Find(device.Id);
                    if (toDelete != null)
                    {
                        var targetDeviceId = toDelete.DeviceId;
                        
                        deleteDb.TrustedDevices.Remove(toDelete);
                        deleteDb.SaveChanges();

                        hubContext.Clients.User(targetDeviceId).SendAsync("RevokeAccess");
                    }
                };

                devicesMenu.DropDownItems.Add(item);
            }
        };
        
        _trayIcon.ContextMenuStrip.Items.Add(devicesMenu);
        _trayIcon.ContextMenuStrip.Items.Add("Exit", null, (s, e) => ExitApp());
        
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