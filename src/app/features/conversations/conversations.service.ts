import { Injectable } from '@angular/core';
import { BookingConversation, Message } from './models/conversations.model';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { AuthService } from '../auth/login/auth.service';
import { Booking } from '../bookings/bookings-list/models/booking.model';

@Injectable({
    providedIn: 'root'
})
export class ConversationsService {

    private readonly apiUrl = `${environment.apiUrl}`;
    private readonly userId;

    constructor(private readonly http: HttpClient, private readonly authService: AuthService) {
        this.userId = this.authService.getUserId;
    }

    public getConversationByBookingId(bookingId: number): Observable<BookingConversation> {
        return this.http.get<BookingConversation>(`${this.apiUrl}/bookings/${bookingId}/conversation`)
            .pipe(
                map((c: BookingConversation) => ({...c, conversation: c.conversation ? {...c.conversation, messages: c.conversation?.messages.map(m => ({ ...m, isMine: m.senderId === this.userId }))} : null }))
            );
    }

    public createConversation(bookingId: number): Observable<number> {
        return this.http.post<number>(`${this.apiUrl}/bookings/${bookingId}/conversation`, {});
    }
}
