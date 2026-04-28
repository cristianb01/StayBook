import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'bookings',
        loadComponent: () => import('./features/bookings/bookings-list/bookings-list.component').then(m => m.BookingsListComponent)
    }
];
