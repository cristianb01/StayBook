import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { ConversationsService } from './conversations.service';
import { Conversation } from './models/conversations.model';
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
  private conversation!: Conversation;

  public errorMessage: string | null = null;
  
  constructor() {
  }

  ngOnInit(): void {
    this.conversation = this.route.snapshot.data['conversation'];

    this.errorMessage = this.conversation ? null : 'Failed to load conversation.';
  }

  public get messages() {
    return this.conversation?.messages ?? [];
  }

  public get iAmHost(): boolean {
    return this.authService.getUserId === this.conversation.host.id;
  }

  public get receiver(): User {
    return this.iAmHost ?
      this.conversation.guest
      : this.conversation.host;
  }

}
