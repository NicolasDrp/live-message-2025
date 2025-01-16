import { User } from "../models/user.ts";

export class RegisterComponent {
    private elements: RegisterComponentElements;

    private constructor(container: HTMLDialogElement) {
        this.buildElements(container);
    }

    buildElements(container: HTMLDialogElement): void {
        this.elements = {
            container: container,
            form: container.querySelector('form') as HTMLFormElement,
        };
    }

     register(): Promise<User> {
        return new Promise((resolve) => {
            this.elements.container.showModal();

            this.elements.form.addEventListener('submit', e => {
                e.preventDefault();
                const data = new FormData(this.elements.form);
                const user: User = {
                    username: data.get('username') as string,
                    notificationEnabled: !!data.get('notificationEnabled'),
                };

                this.elements.container.close();
                resolve(user);
            });
        });
     }

    static init(): RegisterComponent {
        const dialog = document.getElementById('register');

        if (!dialog || !(dialog instanceof HTMLDialogElement)) {
            throw new Error('Register failed');
        }

        return new RegisterComponent(dialog);
    }
}

interface RegisterComponentElements {
    container: HTMLDialogElement;
    form: HTMLFormElement;
}
