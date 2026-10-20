import { Service } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { MessageReceivedDto } from '../../features/conversations/models/message-received.model';
import { CHAT_HUB_METHODS } from '../constants/chat-hub-methods.constants';
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
        await this.connection?.invoke(CHAT_HUB_METHODS.joinConversation, bookingId);
    }

    public async leaveConversation(bookingId: number): Promise<void> {
        await this.connection?.invoke(CHAT_HUB_METHODS.leaveConversation, bookingId);
    }

    public async sendTyping(bookingId: number): Promise<void> {
        await this.connection?.invoke(CHAT_HUB_METHODS.typing, bookingId);
    }

    public async sendStopTyping(bookingId: number): Promise<void> {
        await this.connection?.invoke(CHAT_HUB_METHODS.stopTyping, bookingId);
    }

    public onMessageReceived(callback: (message: MessageReceivedDto) => void): void {
        this.connection?.on(CHAT_HUB_METHODS.messageReceived, callback);
    }

    public onTyping(callback: () => void): void {
        this.connection?.on(CHAT_HUB_METHODS.typing, callback);
    }

    public onStopTyping(callback: () => void): void {
        this.connection?.on(CHAT_HUB_METHODS.stopTyping, callback);
    }
}
