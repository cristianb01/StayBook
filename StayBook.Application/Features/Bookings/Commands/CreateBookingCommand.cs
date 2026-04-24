using MediatR;

namespace StayBook.Application.Features.Bookings.Commands;

public record CreateBookingCommand(
    int UserId,
    int PropertyId,
    DateTime StartDate,
    DateTime EndDate) : IRequest<int>;