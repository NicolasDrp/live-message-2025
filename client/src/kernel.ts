import { RoomComponent } from "./components/room-component.ts";
import { userProvider } from "./services/user-provider.ts";

export class Kernel {
    private rooms: RoomComponent[] = [];

    constructor() {
        this.init();
    }

    init(): void {
        if (!userProvider.isConnected()) {
            userProvider.register();
        }

        const roomElement = document.getElementById('main-room');

        if (!roomElement) {
            throw new Error('Unable to open room');
        }

        this.rooms.push(new RoomComponent('main', roomElement));
    }
}
