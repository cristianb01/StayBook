import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginationFilters } from '../../../../common/pagination-filters.model';
import { Observable } from 'rxjs';
import { Booking } from '../models/booking.model';
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
}
