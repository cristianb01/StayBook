import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ChatSignalrService } from '../../core/services/chat-signalr.service';
import { UnsentMessagesService } from './services/unsent-messages.service';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { lastValueFrom, map, switchMap } from 'rxjs';
import { ConversationsService } from './conversations.service';
import { BookingConversation, Message } from './models/conversations.model';
import { AuthService } from '../auth/login/auth.service';
import { User } from '../../shared/models/user.model';
import { MatIcon } from '@angular/material/icon';

export interface UnsentMessage {
  id: number;
  content: string;
}

@Component({
  imports: [ReactiveFormsModule, MatIcon],
  selector: 'app-conversations',
  styleUrl: './conversations.component.scss',
  templateUrl: './conversations.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly conversationsService = inject(ConversationsService);
  private readonly unsentMessagesService = inject(UnsentMessagesService);
  private readonly chatSignalrService = inject(ChatSignalrService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  private bookingConversation!: BookingConversation;

  public errorMessage: string | null = null;

  public newMessageFormControl = new FormControl('', {
    nonNullable: true,
    validators: Validators.required,
  });

  public unsentMessages = this.unsentMessagesService.unsentMessages;


  constructor() {}

  async ngOnInit(): Promise<void> {
    this.bookingConversation = this.route.snapshot.data['conversation'];

    this.errorMessage = this.bookingConversation?.conversation?.messages.length
      ? null
      : 'No messages yet';

    this.unsentMessagesService.checkUnsetMessages(this.bookingConversation);

    try {
      await this.chatSignalrService.startConnection();
      console.log('SignalR connection started successfully');
    } catch (error) {
      console.error('Failed to start SignalR connection', error);
    }
    
    await this.chatSignalrService.joinConversation(this.bookingConversation.bookingId);
    
    this.checkForReceivedMessages();

  }

  public checkForReceivedMessages(): void {
    this.chatSignalrService.onMessageReceived((message) => {
      console.log('Message received:', message);
      const mappedMessage: Message = {
        id: message.id,
        senderId: message.senderId,
        content: message.content,
        createdAt: message.createdAtUtc,
        isMine: message.senderId === this.authService.getUserId,
      };

      this.bookingConversation.conversation?.messages.push(mappedMessage);

      this.changeDetectorRef.detectChanges();
    });
  }


  public async sendMessage(): Promise<void> {
    if (this.newMessageFormControl.invalid) {
      return;
    }

    const messageContent = this.newMessageFormControl.value;

    const unsentMessage = this.unsentMessagesService.addUnsentMessage(
      messageContent,
      this.bookingConversation.conversation?.messages ?? []
    );

    await lastValueFrom(
      this.conversationsService.sendMessage(
        this.bookingConversation.bookingId,
        messageContent,
      ),
    );
    // newMessage.isMine = newMessage.senderId === this.authService.getUserId;
    // this.bookingConversation.conversation?.messages.push(newMessage);

    this.newMessageFormControl.reset();
    this.unsentMessagesService.removeUnsentMessage(unsentMessage.id);
  }


  // Getters

  public get messages(): Message[] {
    return this.bookingConversation?.conversation?.messages ?? [];
  }

  public get iAmHost(): boolean {
    return this.authService.getUserId === this.bookingConversation?.host.id;
  }

  public get receiver(): User {
    return this.iAmHost
      ? this.bookingConversation.guest
      : this.bookingConversation.host;
  }
}
