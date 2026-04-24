using StayBook.Domain.Entities;

namespace StayBook.Application.Interfaces;

public interface IBookingRepository
{
    Task AddAsync(Booking booking, CancellationToken cancellationToken);
    Task<bool> HasOverlapAsync(int propertyId, DateTime startDate, DateTime endDate, CancellationToken cancellationToken);
}