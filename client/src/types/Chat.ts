import type { User } from "./User";
import type { Message } from "./Message";

export interface Chat {
    id: string;
    name?: string;
    isGroup: boolean;
    users: User[];
    messages?: Message[];
    adminId?: string;
    createdAt: string;
    updatedAt: string;
}