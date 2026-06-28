import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;
let refCount = 0;
let activeToken: string | null = null;

export function acquireSocket(token: string): Socket {
  if (!socket || activeToken !== token) {
    socket?.disconnect();
    socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
      auth: { token },
      withCredentials: true,
      autoConnect: false,
    });
    activeToken = token;
    refCount = 0;
  }
  refCount++;
  return socket;
}

export function releaseSocket(): void {
  refCount = Math.max(0, refCount - 1);
  if (refCount === 0 && socket) {
    socket.disconnect();
    socket = null;
    activeToken = null;
  }
}
