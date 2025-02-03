import { Message } from "../models/message.ts";
import { apiProvider } from "../services/api-provider.ts";
import { SocketHandler } from "../services/socket-handler.ts";
import { userProvider } from "../services/user-provider.ts";

export class RoomComponent {
    private elements: RoomComponentElements;
    private socketHandler = new SocketHandler();

    constructor(private id: string, container: HTMLElement) {
        this.buildElements(container);
        this.bindEvents();
        this.load();
    }

    buildElements(container: HTMLElement): void {
        this.elements = {
            container: container,
            feed: container.querySelector('section') as HTMLElement,
            form: container.querySelector('form') as HTMLFormElement,
            template: document.getElementById('template-message') as HTMLTemplateElement,
        };
    }

    bindEvents(): void {
        this.socketHandler.listen().subscribe(message => {
            this.render(message, false);
        });

        this.elements.form.addEventListener('submit', e => {
            e.preventDefault();
            const data = new FormData(this.elements.form);

            const content = data.get('message-content');
            if (!content) {
                return;
            }

            const message: Message = {
                roomId: this.id,
                content: content as string,
                author: userProvider.getUser(),
                sentAt: new Date(),
            };

            this.socketHandler.dispatch(message);
            this.render(message, true);
            this.elements.form.reset();
        });
    }

    render(message: Message, local: boolean): void {
        const fragment = document.importNode(this.elements.template.content, true);
        const messageElement = fragment.querySelector('article');

        if (!messageElement) {
            throw new Error('Unable to render message');
        }

        if (typeof message.sentAt === 'string') {
            message.sentAt = new Date(message.sentAt);
        }

        messageElement.querySelector('.from').textContent = message.author.username;
        messageElement.querySelector('.content').textContent = message.content;
        messageElement.querySelector('.date').textContent = message.sentAt.toString();

        if (local) {
            messageElement.classList.add('sent');
        }

        this.elements.feed.appendChild(messageElement);
    }

    private load(): void {
        apiProvider.fetch('/messages')
            .then(data => {
                for (const message of data) {
                    this.render(message, message.author.username == userProvider.getUser().username);
                }
            })
        ;
    }
}

interface RoomComponentElements {
    container: HTMLElement;
    feed: HTMLElement;
    form: HTMLFormElement;
    template: HTMLTemplateElement;
}
