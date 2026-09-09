import { User } from "../../../shared/models/user.model";

export interface Conversation {
    id: number;
    bookingId: number;
    messages: Message[];
    guest: User;
    host: User;
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