using Microsoft.EntityFrameworkCore;

namespace Api.Data;

public class TrustedDevice
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string DeviceId { get; set; } = string.Empty;
    public DateTime PairedAt { get; set; } = DateTime.UtcNow;
}

public class AppDbContext : DbContext
{
    public DbSet<TrustedDevice> TrustedDevices { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        options.UseSqlite("Data Source=remote.db");
    }
}