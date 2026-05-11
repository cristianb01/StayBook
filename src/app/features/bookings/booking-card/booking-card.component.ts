import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Booking } from '../bookings-list/models/booking.model';
import { BookingStatus } from '../bookings-list/models/booking-status.enum';

@Component({
  selector: 'app-booking-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-card.component.html',
  styleUrls: ['./booking-card.component.scss']
})
export class BookingCardComponent {
  @Input() booking!: Booking;

  readonly BookingStatus = BookingStatus;

  get statusLabel(): string {
    return BookingStatus[this.booking.status];
  }
}
