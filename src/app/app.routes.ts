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
            },
            {
                path: 'properties',
                loadComponent: () => import('./features/properties/pages/properties-page/properties-page.component').then(m => m.PropertiesPageComponent)
            },
            {
                path: 'properties/:id',
                loadComponent: () => import('./features/properties/pages/property-detail-page/property-detail-page.component').then(m => m.PropertyDetailPageComponent)
            },
            {
                path: 'properties/:id/payment/:bookingId',
                loadComponent: () => import('./features/properties/pages/payment-wizard-page/payment-wizard-page.component').then(m => m.PaymentWizardPageComponent)
            }
        ]
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    },
    {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'bookings'
    }
];
