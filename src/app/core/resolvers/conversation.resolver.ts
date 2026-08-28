import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ConversationsService } from '../../features/conversations/conversations.service';
import { catchError, EMPTY } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Conversation } from '../../features/conversations/models/conversations.model';

export const conversationResolver: ResolveFn<Conversation> = (route, state) => {
  const conversationService = inject(ConversationsService);
  const router = inject(Router);
  const bookingId = Number(route.params['bookingId']);

  return conversationService.getConversationByBookingId(bookingId)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          router.navigate(['/']);
        }

        return EMPTY;
      })
    );
};
