import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const notificationService = inject(NotificationService);
    const platformId = inject(PLATFORM_ID);
    const isBrowser = isPlatformBrowser(platformId);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let message: string;

            switch (error.status) {
                case 0:
                    message = 'Network error. Please check your connection.';
                    notificationService.showError(message);
                    break;
                case 400:
                    message = error.error?.message ?? 'Bad request. Please check your input.';
                    notificationService.showError(message);
                    break;
                case 401:
                    if (isBrowser) {
                        router.navigate(['/login']);
                    }
                    break;
                case 403:
                    notificationService.showError('You do not have permission to perform this action.');
                    break;
                case 404:
                    notificationService.showError('The requested resource was not found.');
                    break;
                case 500:
                    notificationService.showError('A server error occurred. Please try again later.');
                    break;
                default:
                    notificationService.showError(`Unexpected error (${error.status}). Please try again.`);
            }

            return throwError(() => error);
        })
    );
};
