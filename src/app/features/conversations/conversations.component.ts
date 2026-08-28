import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { ConversationsService } from './conversations.service';
import { Conversation } from './models/conversations.model';

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
  private readonly conversationsService = inject(ConversationsService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private conversation!: Conversation;
  
  constructor() {
    effect(() => {
      console.log(this.messages());
    });
  }

  ngOnInit(): void {
    this.conversation = this.route.snapshot.data['conversation'];
  }

  public readonly messages = computed(() => this.conversation()?.messages ?? []);

}
