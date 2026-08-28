import { Injectable } from '@angular/core';
import { Conversation, Message } from './models/conversations.model';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { AuthService } from '../auth/login/auth.service';

@Injectable({
    providedIn: 'root'
})
export class ConversationsService {

    private readonly apiUrl = `${environment.apiUrl}`;
    private readonly userId;

    constructor(private readonly http: HttpClient, private readonly authService: AuthService) {
        this.userId = this.authService.getUserId;
        console.log('userId', this.userId);
    }

    public getConversationByBookingId(bookingId: number): Observable<Conversation> {
        return this.http.get<Conversation>(`${this.apiUrl}/bookings/${bookingId}/conversation`)
            .pipe(
                map((c: Conversation) => ({ ...c, messages: c.messages.map((m: Message)=> ({ ...m, isMine: this.userId === m.senderId })) }))
            );
    }
}
