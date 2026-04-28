import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Booking } from '../bookings-list/models/booking.model';
import { BookingStatus } from '../bookings-list/models/booking-status.enum';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent {
  @Input() booking!: Booking;

  readonly BookingStatus = BookingStatus;

  get statusLabel(): string {
    return BookingStatus[this.booking.status];
  }
}
