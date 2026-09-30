import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { lastValueFrom, map, switchMap } from 'rxjs';
import { ConversationsService } from './conversations.service';
import { BookingConversation } from './models/conversations.model';
import { AuthService } from '../auth/login/auth.service';
import { User } from '../../shared/models/user.model';

@Component({
  imports: [ReactiveFormsModule],
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
  private bookingConversation!: BookingConversation;

  public errorMessage: string | null = null;

  public newMessageFormControl = new FormControl('', {
    nonNullable: true,
    validators: Validators.required
  }); 
  
  constructor() {
  }

  ngOnInit(): void {
    this.bookingConversation = this.route.snapshot.data['conversation'];
    debugger;

    this.errorMessage = this.bookingConversation?.conversation?.messages.length ? null : 'No messages yet';
  }

  public get messages() {
    return this.bookingConversation?.conversation?.messages ?? [];
  }

  public get iAmHost(): boolean {
    return this.authService.getUserId === this.bookingConversation?.host.id;
  }

  public get receiver(): User {
    return this.iAmHost ?
      this.bookingConversation.guest
      : this.bookingConversation.host;
  }

  public async sendMessage(): Promise<void> {
    if (this.newMessageFormControl.invalid) {
      return;
    }

    const messageContent = this.newMessageFormControl.value;
    
    const newMessage = await lastValueFrom(this.conversationsService.sendMessage(this.bookingConversation.bookingId, messageContent));
    newMessage.isMine = newMessage.senderId === this.authService.getUserId;
    this.bookingConversation.conversation?.messages.push(newMessage);

    this.newMessageFormControl.reset();
  }

}
