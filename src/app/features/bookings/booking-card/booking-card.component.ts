import { Component, Input, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Booking } from '../bookings-list/models/booking.model';
import { BookingStatus } from '../bookings-list/models/booking-status.enum';

@Component({
    selector: 'app-booking-card',
    imports: [CommonModule],
    templateUrl: './booking-card.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./booking-card.component.scss']
})
export class BookingCardComponent {
  @Input() booking!: Booking;

  private readonly _router = inject(Router);
  readonly BookingStatus = BookingStatus;

  get statusLabel(): string {
    return BookingStatus[this.booking.status];
  }

  onBook(): void {
    this._router.navigate(['/properties', this.booking.propertyId, 'payment', this.booking.id]);
  }
}
