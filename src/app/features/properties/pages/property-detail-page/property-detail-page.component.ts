import { Component, OnInit, signal, inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { PropertyService } from '../../property.service';
import { BookingService } from '../../../bookings/bookings-list/services/booking.service';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-property-detail-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './property-detail-page.component.html',
  styleUrl: './property-detail-page.component.scss'
})
export class PropertyDetailPageComponent implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _propertyService = inject(PropertyService);
  private readonly _bookingService = inject(BookingService);
  private readonly _platformId = inject(PLATFORM_ID);

  public property = signal<Property | null>(null);
  public isLoading = signal<boolean>(false);
  public hasError = signal<boolean>(false);
  public isBooking = signal<boolean>(false);

  public startDate: string = '';
  public endDate: string = '';
  public guests: number = 1;

  async ngOnInit(): Promise<void> {
    if (!isPlatformBrowser(this._platformId)) return;

    const [params, queryParams] = await Promise.all([
      firstValueFrom(this._route.params),
      firstValueFrom(this._route.queryParams)
    ]);

    const id = Number(params['id']);
    if (!id) return;

    if (queryParams['startDate']) this.startDate = queryParams['startDate'];
    if (queryParams['endDate']) this.endDate = queryParams['endDate'];

    try {
      this.isLoading.set(true);
      const property = await firstValueFrom(this._propertyService.getPropertyById(id));
      this.property.set(property);
    } catch {
      this.hasError.set(true);
    } finally {
      this.isLoading.set(false);
    }
  }

  async onBook(): Promise<void> {
    const property = this.property();
    if (!property || !this.startDate || !this.endDate) return;

    try {
      this.isBooking.set(true);
      const booking = await firstValueFrom(
        this._bookingService.createBooking({
          userId: 1,
          propertyId: property.id,
          startDate: new Date(this.startDate),
          endDate: new Date(this.endDate)
        })
      );
      this._router.navigate(['/properties', property.id, 'payment', booking.id]);
    } catch {
      this.hasError.set(true);
    } finally {
      this.isBooking.set(false);
    }
  }

  goBack(): void {
    this._router.navigate(['/properties'], {
      queryParams: { startDate: this.startDate, endDate: this.endDate }
    });
  }
}

