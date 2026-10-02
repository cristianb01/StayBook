import { Service, signal, inject } from '@angular/core';
import { ConversationsService } from '../conversations.service';
import { UnsentMessage } from '../conversations.component';
import { BookingConversation, Message } from '../models/conversations.model';
import { lastValueFrom } from 'rxjs';
import { AuthService } from '../../auth/login/auth.service';

@Service()
export class UnsentMessagesService {
    public unsentMessages = signal<UnsentMessage[]>([]);
    
    public conversationsService = inject(ConversationsService);
    public authService = inject(AuthService);
    

    public addUnsentMessage(unsentMessageContent: string, alreadySentMessages: Message[]): UnsentMessage {
        const lastUnsentMessage = this.unsentMessages().at(-1);
        const lastMessage = alreadySentMessages.at(-1);
        const position = lastUnsentMessage
        ? lastUnsentMessage.id + 1
        : (lastMessage?.id ?? 0) + 1;

        const message: UnsentMessage = {
        content: unsentMessageContent,
        id: position,
        };

        this.unsentMessages.update((messages) => [...messages, message]);
        localStorage.setItem(
        'unsentMessages',
        JSON.stringify(this.unsentMessages()),
        );
        return message;
    }
    
    public removeUnsentMessage(position: number): void {
        this.unsentMessages.update((messages) =>
        messages.filter((message) => message.id !== position)
        );
        localStorage.setItem('unsentMessages', JSON.stringify(this.unsentMessages()));
    }
    
    
    private loadUnsentMessages(): void {
        const localUnsentMessages = localStorage.getItem('unsentMessages');

        this.unsentMessages.set(
        localUnsentMessages ? JSON.parse(localUnsentMessages) : []
        );
    }

    public checkUnsetMessages(bookingConversation: BookingConversation): void {
        this.loadUnsentMessages();
    
        if (this.unsentMessages().length) {
          // try to resend unsent messages
          this.unsentMessages().forEach(async (unsentMessage) => {
            try {
              const newMessage = await lastValueFrom(
                this.conversationsService.sendMessage(
                  bookingConversation.bookingId,
                  unsentMessage.content,
                ),
              );
              newMessage.isMine = newMessage.senderId === this.authService.getUserId;
              bookingConversation.conversation?.messages.push(newMessage);
              this.removeUnsentMessage(unsentMessage.id);
            } catch (error) {
              console.error('Failed to resend message:', unsentMessage, error);
            }
          });
        }
      }
}
