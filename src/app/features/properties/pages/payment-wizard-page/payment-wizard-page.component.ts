import { Component, signal, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { BookingService } from '../../../bookings/bookings-list/services/booking.service';

const MOCK_GUEST = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@example.com',
  phone: '+1 555 867 5309',
  specialRequests: 'Late check-in around 10 PM if possible.'
};

@Component({
  selector: 'app-payment-wizard-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-wizard-page.component.html',
  styleUrl: './payment-wizard-page.component.scss'
})
export class PaymentWizardPageComponent {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _bookingService = inject(BookingService);

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
}

