import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../features/auth/login/auth.service';
import { isPlatformBrowser } from '@angular/common';

export const authGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);
    
    if (!isPlatformBrowser(platformId)) {
        return false;
    }

    if (!authService.isAuthenticated()) {
        router.navigate(['/login']);
        return false;
    }

    return true;
};