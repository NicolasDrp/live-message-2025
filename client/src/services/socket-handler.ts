import { Observable, Subject } from "rxjs";
import { io, Socket } from "socket.io-client";
import { Message } from "../models/message.ts";

export class SocketHandler {
    private socketUrl = 'http://localhost:3000';
    private socket: Socket;

    constructor() {
        this.init();
    }

    dispatch(message: Message): void {
        this.socket.emit('originMessage', message);
    }

    listen(): Observable<Message> {
        const subject = new Subject<Message>();

        this.socket.on('forwardMessage', (message: Message) => {
            subject.next(message);
        });

        return subject.asObservable();
    }

    private init(): void {
        this.socket = io(this.socketUrl);
    }
}
