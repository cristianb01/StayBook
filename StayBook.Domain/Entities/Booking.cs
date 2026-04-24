using StayBook.Domain.Enums;
using StayBook.Domain.ValueObjects;

namespace StayBook.Domain.Entities;

public class Booking
{
    public int Id { get; private set; }
    public int UserId { get; private set; }
    public int PropertyId { get; private set; }
    public BookingStatus Status { get; private set; }
    public DateRange DateRange { get; private set; }
    public decimal TotalPrice { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime ExpiresAt { get; private set; }

    // Required by EF Core
    private Booking() { }

    public Booking(int userId, int propertyId, DateRange dateRange, decimal totalPrice)
    {
        UserId = userId;
        PropertyId = propertyId;
        DateRange = dateRange;
        Status = BookingStatus.Pending;
        TotalPrice = totalPrice;
        CreatedAt = DateTime.UtcNow;
    }

    public void Confirm()
    {
        if (Status != BookingStatus.Pending)
        {
            throw new InvalidOperationException("Only pending bookings can be confirmed.");
        }
        
        Status = BookingStatus.Confirmed;
    }

    public void Cancel()
    {
        if (Status == BookingStatus.Cancelled)
        {
            throw new InvalidOperationException("Booking is already cancelled.");
        }
        
        Status = BookingStatus.Cancelled;
    }

    public void Expire()
    {
        if (Status != BookingStatus.Pending)
        {
            throw new InvalidOperationException("Only pending bookings can expire.");
        }
        
        Status = BookingStatus.Expired;
    }
    
    public bool IsActive() => Status == BookingStatus.Pending || Status == BookingStatus.Confirmed;
}