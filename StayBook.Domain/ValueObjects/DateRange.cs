namespace StayBook.Domain.ValueObjects;

public class DateRange
{
    public DateTime StartDate { get; private set; }
    public DateTime EndDate { get; private set; }

    public DateRange(DateTime startDate, DateTime endDate)
    {
        if (startDate >= endDate)
        {
            throw new ArgumentException("Start date must be before end date.");
        }

        StartDate = startDate;
        EndDate = endDate;
    }

    public bool Overlaps(DateRange other)
    {
        return StartDate < other.EndDate && EndDate > other.StartDate;
    }
}