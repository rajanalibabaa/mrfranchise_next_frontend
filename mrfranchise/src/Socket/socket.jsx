import {io} from 'socket.io-client'
const SOCKET_URL= "https://mrfranchisebackend.mrfranchise.in"

export const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  autoConnect: false,
});