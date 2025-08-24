import { io } from "socket.io-client";

//export const address = 'https://server.msg-min.xyz';
export const address = 'http://192.168.0.120:5000';

let socket;

export function getSocket() {
    if (!socket) {
        socket = new io(address, { auth: { token: localStorage.getItem('token') } });
    }
    return socket;
}