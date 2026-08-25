import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { ConversationsService } from './conversations.service';

@Component({
  imports: [],
  selector: 'app-conversations',
  styleUrl: './conversations.component.scss',
  templateUrl: './conversations.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationsComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly conversationsService = inject(ConversationsService);

  public readonly conversation = toSignal(
    this.route.paramMap.pipe(
      map(params => Number(params.get('bookingId'))),
      switchMap(id => this.conversationsService.getConversationByBookingId(id))
    )
  );

  public readonly messages = computed(() => this.conversation()?.messages ?? []);

}
