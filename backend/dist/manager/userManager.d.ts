import { Socket } from "socket.io";
export interface User {
    socket: Socket;
    name: String;
}
export declare class UserManager {
    private users;
    private queue;
    private roomManager;
    constructor();
    addUser(name: String, socket: Socket): void;
    removeUser(socketId: any): void;
    clearQueue(): void;
    initHandlers(socket: Socket): void;
}
//# sourceMappingURL=userManager.d.ts.map