using Microsoft.EntityFrameworkCore;
using StayBook.Domain.Entities;

namespace StayBook.Infrastructure.Persistence;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Booking> Bookings { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Booking>().OwnsOne(b => b.DateRange, dr =>
        {
            dr.Property(p => p.StartDate).HasColumnName("StartDate");
            dr.Property(p => p.EndDate).HasColumnName("EndDate");
        });
    }
}