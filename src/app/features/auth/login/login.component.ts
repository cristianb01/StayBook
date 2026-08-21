
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule],
    templateUrl: './login.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  public async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials = this.loginForm.getRawValue();
    try {
      var response = await lastValueFrom(this.authService.login(credentials.email, credentials.password));
      this.authService.setSession(response.accessToken, response.expiresAtUtc);
      this.router.navigate(['/']);
    }
    catch (error: any) {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        this.notificationService.showError('Invalid email or password. Please try again.');
      }
    }
  }

  get emailFormField() {
    return this.loginForm.controls.email;
  }

  get passwordFormField() {
    return this.loginForm.controls.password;
  }

}
