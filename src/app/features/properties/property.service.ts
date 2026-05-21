import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchFilters } from './models/search-filters.model';
import { Observable } from 'rxjs';
import { Property } from './models/property.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

    private readonly apiUrl = `${environment.apiUrl}`;

  constructor(private httpClient: HttpClient) { }

    public getAvailablePropertiesInDateRange(searchFilters: SearchFilters): Observable<Property[]> {
        const params = {
            startDate: searchFilters.startDate.toISOString().split('T')[0],
            endDate: searchFilters.endDate.toISOString().split('T')[0]
        };
        
        return this.httpClient.get<Property[]>(`${this.apiUrl}/api/v1/property`, { params });
    }
}
