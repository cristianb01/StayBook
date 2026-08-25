import { Injectable } from '@angular/core';
import { Conversation } from './models/conversations.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class ConversationsService {
    constructor(private readonly http: HttpClient) {}
    private readonly apiUrl = `${environment.apiUrl}/api/v1/conversation`;

    public getConversationByBookingId(bookingId: number): Observable<Conversation> {
        return this.http.get<Conversation>(`${this.apiUrl}/${bookingId}`);
    }
}
