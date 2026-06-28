import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(token: string): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
      auth: { token },
      withCredentials: true,
      autoConnect: false,
    });
  }
  return socket;
}
