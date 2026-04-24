using MediatR;
using Microsoft.AspNetCore.Mvc;
using StayBook.Api.Models;
using StayBook.Application.Features.Bookings.Commands;

namespace StayBook.Controllers;

[Route("api/v1/[controller]")]
[ApiController]
public class BookingController : ControllerBase
{
    private readonly IMediator _mediator;

    public BookingController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> CreateBooking(
        [FromBody] CreateBookingRequest request,
        CancellationToken cancellationToken)
    {
        var command = new CreateBookingCommand(
            request.UserId,
            request.PropertyId,
            request.StartDate,
            request.EndDate);

        var bookingId = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(CreateBooking), new { id = bookingId }, bookingId);
    }
}