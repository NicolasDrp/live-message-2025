import { RegisterComponent } from "../components/register-component.ts";
import { User } from "../models/user.ts";

class UserProvider {
    private storageKey = 'user_account';
    private user: User;

    constructor() {
        this.init();
    }

    init() {
        const rawUser = localStorage.getItem(this.storageKey);

        if (rawUser) {
            this.user = JSON.parse(rawUser);
        }
    }

    isConnected(): boolean {
        return !!this.user;
    }

    register(): void {
        const registerComponent = RegisterComponent.init();
        registerComponent.register().then(user => {
            this.user = user;
            this.store();
        });
    }

    getUser(): User {
        return this.user;
    }

    private store(): void {
        localStorage.setItem(this.storageKey, JSON.stringify(this.user))
    }
}

export const userProvider = new UserProvider();
