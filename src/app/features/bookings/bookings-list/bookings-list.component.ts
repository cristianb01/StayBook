import { Component, inject, OnInit, signal } from '@angular/core';
import { BookingService } from './services/booking.service';
import { Booking } from './models/booking.model';
import { BookingComponent } from './booking/booking.component';

@Component({
  selector: 'app-bookings-list',
  standalone: true,
  imports: [BookingComponent],
  templateUrl: './bookings-list.component.html',
  styleUrl: './bookings-list.component.scss'
})
export class BookingsListComponent implements OnInit {
  private readonly _bookingsService = inject(BookingService);

  public bookings = signal<Booking[]>([]);
  
  async ngOnInit() {
    this._bookingsService.getBookings({ page: 1, pageSize: 10 }).subscribe(bookings => {
      this.bookings.set(bookings);
    });
  }

}
