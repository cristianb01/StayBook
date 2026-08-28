export interface Conversation {
    id: number;
    bookingId: number;
    messages: Message[];
    createdAt: string;
}

export interface Message {
    id: number;
    content: string;
    createdAt: string;
    senderId: number;
    isMine: boolean;
    readAt?: string;
}