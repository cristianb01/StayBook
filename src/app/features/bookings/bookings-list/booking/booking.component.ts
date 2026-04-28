import { ChangeDetectionStrategy, Component, input, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Booking } from '../models/booking.model';
import { BookingStatus } from '../models/booking-status.enum';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookingComponent {
  public booking = input<Booking>();

  readonly BookingStatus = BookingStatus;

  get statusLabel(): string {
    return BookingStatus[this.booking()!.status];
  }
}
