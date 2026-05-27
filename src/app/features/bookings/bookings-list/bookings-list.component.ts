import { Component, inject, OnInit, signal } from '@angular/core';
import { BookingService } from './services/booking.service';
import { Booking } from './models/booking.model';
import { BookingCardComponent } from '../booking-card/booking-card.component';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-bookings-list',
  standalone: true,
  imports: [BookingCardComponent],
  templateUrl: './bookings-list.component.html',
  styleUrl: './bookings-list.component.scss'
})
export class BookingsListComponent implements OnInit {
  private readonly _bookingsService = inject(BookingService);
  private readonly _notificationService = inject(NotificationService);

  public bookings = signal<Booking[]>([]);
  
  async ngOnInit() {
    this._bookingsService.getBookings({ page: 1, pageSize: 10 }).subscribe(bookings => {
      this.bookings.set(bookings);
    });
  }

  onPayAndConfirm(bookingId: number): void {
    // TODO: Integrate with actual payment gateway to get paymentReferenceId
    const paymentReferenceId = `PAY-${Date.now()}`; // Placeholder
    
    this._bookingsService.confirmBooking(bookingId, paymentReferenceId).subscribe({
      next: () => {
        this._notificationService.showSuccess('Booking confirmed successfully!');
        // Refresh bookings list
        this._bookingsService.getBookings({ page: 1, pageSize: 10 }).subscribe(bookings => {
          this.bookings.set(bookings);
        });
      },
      error: (error) => {
        this._notificationService.showError('Failed to confirm booking. Please try again.');
        console.error('Booking confirmation error:', error);
      }
    });
  }

}
