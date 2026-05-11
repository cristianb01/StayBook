import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchFilters } from './models/search-filters.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  constructor(private httpClient: HttpClient) { }

    public getAvailablePropertiesInDateRange(searchFilters: SearchFilters) {
        return this.httpClient.get('/api/property', {
            params: {
                startDate: searchFilters.startDate.toISOString(),
                endDate: searchFilters.endDate.toISOString()
            }
        });
    }
}
