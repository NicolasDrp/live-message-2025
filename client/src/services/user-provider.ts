import { RegisterComponent } from "../components/register-component.ts";
import { User } from "../models/user.ts";
import { apiProvider } from "./api-provider.ts";
import { serviceWorkerManager } from "./service-worker-manager.ts";

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

            if (this.user.notificationEnabled) {
                this.enableNotification();
            }

            this.store();
        });
    }

    getUser(): User {
        return this.user;
    }

    private async enableNotification(): Promise<void> {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
            return;
        }

        let sub = await serviceWorkerManager.getRegistration().pushManager.getSubscription();
        if (!sub) {
            const keys = await apiProvider.fetch('/push/key');

            sub = await serviceWorkerManager.getRegistration().pushManager.subscribe({
                applicationServerKey: keys.pubkey,
                userVisibleOnly: true,
            });
        }

        await apiProvider.fetch('/push/sub', {
            method: 'POST',
            body: JSON.stringify(sub),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    private store(): void {
        localStorage.setItem(this.storageKey, JSON.stringify(this.user))
    }
}

export const userProvider = new UserProvider();
