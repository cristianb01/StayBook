import { Component, ChangeDetectionStrategy, OnInit, signal, PLATFORM_ID, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../../property.service';
import { SearchFilters } from '../../models/search-filters.model';
import { Property } from '../../models/property.model';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { CreateBooking } from '../../models/create-booking.model';

@Component({
  selector: 'app-properties-page',
  standalone: true,
  imports: [],
  templateUrl: './properties-page.component.html',
  styleUrl: './properties-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertiesPageComponent implements OnInit {

  public properties = signal<Property[]>([]);
  public isLoading = signal<boolean>(false);
  private platformId = inject(PLATFORM_ID);

  public startDate!: Date;
  public endDate!: Date;

  constructor(
    private activatedRoute: ActivatedRoute,
    private propertyService: PropertyService
  ) {}

  async ngOnInit(): Promise<void> {
    // Only fetch data in the browser, not during SSR
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const params = await firstValueFrom(this.activatedRoute.queryParams);
    this.startDate = params['startDate'];
    this.endDate = params['endDate'];

    if (this.startDate && this.endDate) {
      const searchFilters: SearchFilters = {
        startDate: new Date(this.startDate),
        endDate: new Date(this.endDate)
      };

      await this.loadProperties(searchFilters);
    }
  }

  private async loadProperties(searchFilters: SearchFilters): Promise<void> {
    try {
      this.isLoading.set(true);
      const properties = await firstValueFrom(
        this.propertyService.getAvailablePropertiesInDateRange(searchFilters)
      );
      this.properties.set(properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      this.properties.set([]);
    } finally {
      this.isLoading.set(false);
    }
  }

  public async bookProperty(propertyId: number): Promise<void> {
    try {
      const booking: CreateBooking = {
        userId: 1, // Replace with actual user ID
        propertyId,
        startDate: this.startDate,
        endDate: this.endDate
      };
      await firstValueFrom(this.propertyService.createBooking(booking));
      console.log(`Property with ID: ${propertyId} booked successfully.`);
    } catch (error) {
      console.error(`Error booking property with ID: ${propertyId}`, error);
    }
  }
}
