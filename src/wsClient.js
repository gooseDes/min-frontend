import { io } from "socket.io-client";

export const address = import.meta.env.VITE_SERVER_ADDRESS || "https://server.msg-min.xyz";

let socket;

export function getSocket() {
    if (!socket) {
        socket = new io(address, { auth: { token: localStorage.getItem("token") } });
    }
    return socket;
}
