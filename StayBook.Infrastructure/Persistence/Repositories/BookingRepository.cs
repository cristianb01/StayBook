using Microsoft.EntityFrameworkCore;
using StayBook.Application.Interfaces;
using StayBook.Domain.Entities;
using StayBook.Domain.Enums;

namespace StayBook.Infrastructure.Persistence.Repositories;

public class BookingRepository : IBookingRepository
{
    private readonly AppDbContext _dbContext;

    public BookingRepository(AppDbContext context)
    {
        _dbContext = context;
    }
    
    public async Task AddAsync(Booking booking, CancellationToken cancellationToken)
    {
        await _dbContext.Bookings.AddAsync(booking, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public Task<bool> HasOverlapAsync(int propertyId, DateTime startDate, DateTime endDate, CancellationToken cancellationToken)
    {
        return _dbContext.Bookings.AnyAsync(
            b => b.PropertyId == propertyId
            && (b.Status == BookingStatus.Pending || b.Status == BookingStatus.Confirmed)
            && b.DateRange.StartDate < endDate
            && b.DateRange.EndDate > startDate,
            cancellationToken);
    }
}