import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginationFilters } from '../../../../common/pagination-filters.model';
import { Observable } from 'rxjs';
import { Booking } from '../models/booking.model';
import { CreateBooking } from '../../../properties/models/create-booking.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly apiUrl = `${environment.apiUrl}/api/v1/booking`;

  constructor(private readonly httpClient: HttpClient) { }

  public getBookings(paginationFilters: PaginationFilters): Observable<Booking[]> {
    const { skip, take } = {
      skip: (paginationFilters.page - 1) * paginationFilters.pageSize,
      take: paginationFilters.pageSize
    };

    return this.httpClient.get<Booking[]>(`${this.apiUrl}?skip=${skip}&take=${take}`);
  }

  public createBooking(booking: CreateBooking): Observable<string> {
    return this.httpClient.post(this.apiUrl, booking, { responseType: 'text' });
  }

  public getBookingById(bookingId: number): Observable<HttpResponse<Booking>> {
    return this.httpClient.get<Booking>(`${this.apiUrl}/${bookingId}`, { observe: 'response' });
  }

  public confirmBooking(bookingId: number, paymentReferenceId: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/${bookingId}/confirm`, { paymentReferenceId });
  }
}
