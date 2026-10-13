import { Service } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { MessageReceivedDto } from '../../features/conversations/models/message-received.model';
@Service()
export class ChatSignalrService {
    private connection?: HubConnection;

    public async startConnection(): Promise<void> {
        if (this.connection?.state === 'Connected') return;

        if (this.connection?.state === 'Connecting') return;

        this.connection = new HubConnectionBuilder()
            .withUrl(`${environment.chatHubUrl}`, {
                accessTokenFactory: () => localStorage.getItem('accessToken') ?? ''
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();
        
        await this.connection.start();
    }

    public async stopConnection(): Promise<void> {
        await this.connection?.stop();
        this.connection = undefined;
    }

    public async joinConversation(bookingId: number): Promise<void> {
        await this.connection?.invoke('JoinConversation', bookingId);
    }

    public async leaveConversation(bookingId: number): Promise<void> {
        await this.connection?.invoke('LeaveConversation', bookingId);
    }

    public onMessageReceived(callback: (message: MessageReceivedDto) => void): void {
        this.connection?.on('MessageReceived', callback);
    }
}
