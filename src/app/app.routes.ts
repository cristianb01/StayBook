import { Routes } from '@angular/router';

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
            }
        ]
    }
];
