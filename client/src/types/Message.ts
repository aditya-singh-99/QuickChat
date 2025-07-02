import type { User } from "./User";
import type { Chat } from "./Chat";

export interface Message {
    id: string;
    content: string;
    senderId: string;
    sender: User;
    chatId: string;
    chat: Chat;
    createdAt: string;
}