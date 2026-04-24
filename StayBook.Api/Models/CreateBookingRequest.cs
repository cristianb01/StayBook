namespace StayBook.Api.Models;

public record CreateBookingRequest(
    int UserId,
    int PropertyId,
    DateTime StartDate,
    DateTime EndDate);

