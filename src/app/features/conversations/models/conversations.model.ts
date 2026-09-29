import { User } from "../../../shared/models/user.model";

export interface BookingConversation {
    bookingId: number;
    conversation: Conversation | null;
    guest: User;
    host: User;
    createdAt: string;
}

export interface Conversation {
    id: number;
    messages: Message[];
    createdAt: string;
}

export interface Message {
    id: number;
    senderId: number;
    content: string;
    createdAt: string;
    readAt?: string;
    isMine: boolean;
}