import { Component, ChangeDetectionStrategy, OnInit, signal, PLATFORM_ID, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../../property.service';
import { SearchFilters } from '../../models/search-filters.model';
import { Property } from '../../models/property.model';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-properties-page',
  standalone: true,
  imports: [],
  templateUrl: './properties-page.component.html',
  styleUrl: './properties-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertiesPageComponent implements OnInit {
  properties = signal<Property[]>([]);
  isLoading = signal<boolean>(false);
  private platformId = inject(PLATFORM_ID);

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
    const startDate = params['startDate'];
    const endDate = params['endDate'];

    if (startDate && endDate) {
      const searchFilters: SearchFilters = {
        startDate: new Date(startDate),
        endDate: new Date(endDate)
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
}
