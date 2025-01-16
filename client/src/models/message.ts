import { User } from "./user.ts";

export interface Message {
    roomId: string;
    content: string;
    author: User;
    sentAt: Date;
}
