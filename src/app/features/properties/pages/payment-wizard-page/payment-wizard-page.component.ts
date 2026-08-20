import { Component, signal, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { firstValueFrom } from 'rxjs';
import { BookingService } from '../../../bookings/bookings-list/services/booking.service';
import { Booking } from '../../../bookings/bookings-list/models/booking.model';
import { BookingStatus } from '../../../bookings/bookings-list/models/booking-status.enum';
import { NotificationService } from '../../../../core/services/notification.service';

const MOCK_GUEST = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@example.com',
  phone: '+1 555 867 5309',
  specialRequests: 'Late check-in around 10 PM if possible.'
};

@Component({
    selector: 'app-payment-wizard-page',
    imports: [],
    templateUrl: './payment-wizard-page.component.html',
    styleUrl: './payment-wizard-page.component.scss'
})
export class PaymentWizardPageComponent {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _bookingService = inject(BookingService);
  private readonly _notificationService = inject(NotificationService);

  public currentStep = signal<number>(1);
  public isProcessing = signal<boolean>(false);
  public paymentDone = signal<boolean>(false);
  public paymentError = signal<boolean>(false);

  readonly steps = ['Guest Info', 'Payment'];
  readonly guest = MOCK_GUEST;

  get bookingId(): number {
    return Number(this._route.snapshot.params['bookingId']);
  }

  get propertyId(): number {
    return Number(this._route.snapshot.params['id']);
  }

  goBack(): void {
    this._router.navigate(['/properties', this.propertyId]);
  }

  setStep(step: number): void {
    this.currentStep.set(step);
  }

  async confirmPayment(): Promise<void> {
    this.isProcessing.set(true);
    this.paymentError.set(false);

    const canProceed = await this.validateBookingBeforePayment();
    if (!canProceed) {
      this.paymentError.set(true);
      this.isProcessing.set(false);
      return;
    }

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const paymentReferenceId = `PAY-${Date.now()}`;
      await firstValueFrom(this._bookingService.confirmBooking(this.bookingId, paymentReferenceId));
      this.paymentDone.set(true);
    } catch {
      this.paymentError.set(true);
    } finally {
      this.isProcessing.set(false);
    }
  }

  goToBookings(): void {
    this._router.navigate(['/bookings']);
  }

  private async validateBookingBeforePayment(): Promise<boolean> {
    try {
      const bookingResponse = await firstValueFrom(this._bookingService.getBookingById(this.bookingId));
      const booking = bookingResponse.body;

      if (!booking) {
        this._notificationService.showError('Booking was not found.');
        return false;
      }

      if (booking.status !== BookingStatus.Pending) {
        this._notificationService.showError('Only pending bookings can be paid.');
        return false;
      }

      const expiresAtMs = new Date(booking.expiresAt).getTime();
      if (Number.isNaN(expiresAtMs)) {
        this._notificationService.showError('Booking expiration is invalid. Please refresh and try again.');
        return false;
      }

      const serverNowMs = this.getServerNowInMs(bookingResponse);
      if (expiresAtMs <= serverNowMs) {
        this._notificationService.showError('This booking has expired and cannot be paid.');
        return false;
      }

      return true;
    } catch {
      this._notificationService.showError('Could not validate booking before payment. Please try again.');
      return false;
    }
  }

  private getServerNowInMs(response: HttpResponse<Booking>): number {
    const serverDateHeader = response.headers.get('date');
    if (!serverDateHeader) {
      return Date.now();
    }

    const serverNowMs = new Date(serverDateHeader).getTime();
    return Number.isNaN(serverNowMs) ? Date.now() : serverNowMs;
  }
}

