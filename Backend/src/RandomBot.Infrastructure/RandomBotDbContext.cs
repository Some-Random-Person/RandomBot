using Microsoft.EntityFrameworkCore;
using RandomBot.Domain.Entities;

namespace RandomBot.Infrastructure;

public class RandomBotDbContext : DbContext
{
    public RandomBotDbContext(DbContextOptions options) : base(options)
    {
        
    }
    public DbSet<Setting> Settings {get; set;}
    public DbSet<Guild> Guilds {get; set;}
    public DbSet<Reminder> Reminders {get; set;}
    public DbSet<User> Users {get; set;}
    public DbSet<Streamer> Streamers {get; set;}
    public DbSet<Welcome> Welcomes {get; set;}
    public DbSet<GuildSetting> guildSettings {get; set;}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Guild>()
            .HasMany(e => e.Settings)
            .WithMany(e => e.Guilds)
            .UsingEntity<GuildSetting>();
        
        modelBuilder.Entity<Guild>()
            .HasMany(e => e.Welcomes)
            .WithOne(e => e.Guild)
            .HasForeignKey(e => e.GuildId);

        modelBuilder.Entity<Guild>()
            .HasMany(e => e.Streamers)
            .WithOne(e => e.Guild)
            .HasForeignKey(e => e.GuildId);
        
        modelBuilder.Entity<User>()
            .HasMany(e => e.Reminders)
            .WithOne(e => e.User)
            .HasForeignKey(e => e.UserId);
    }
}
