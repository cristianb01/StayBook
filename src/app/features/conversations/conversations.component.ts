import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { ConversationsService } from './conversations.service';
import { BookingConversation } from './models/conversations.model';
import { AuthService } from '../auth/login/auth.service';
import { User } from '../../shared/models/user.model';

@Component({
  imports: [],
  selector: 'app-conversations',
  styleUrl: './conversations.component.scss',
  templateUrl: './conversations.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationsComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private bookingConversation!: BookingConversation;

  public errorMessage: string | null = null;
  
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

}
