using Microsoft.EntityFrameworkCore;

namespace Api.Data;

public class TrustedDevice
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string DeviceId { get; set; } = string.Empty;
    public DateTime PairedAt { get; set; } = DateTime.UtcNow;
}

public class SavedSite
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
}

public class AppDbContext : DbContext
{
    public DbSet<TrustedDevice> TrustedDevices { get; set; }
    public DbSet<SavedSite> SavedSites { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        options.UseSqlite("Data Source=remote.db");
    }
}