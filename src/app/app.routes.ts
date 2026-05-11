import { Routes } from '@angular/router';
import { PropertiesPageComponent } from './features/properties/pages/properties-page/properties-page.component';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./core/layout/layout.component').then(m => m.LayoutComponent),
        children: [
            {
                path: '',
                redirectTo: 'bookings',
                pathMatch: 'full'
            },
            {
                path: 'bookings',
                loadComponent: () => import('./features/bookings/bookings-list/bookings-list.component').then(m => m.BookingsListComponent)
            },
            {
                path: 'properties',
                loadComponent: () => import('./features/properties/pages/properties-page/properties-page.component').then(m => m.PropertiesPageComponent)
            }
        ]
    }
];
