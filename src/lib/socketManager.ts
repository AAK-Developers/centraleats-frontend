import { io, Socket } from 'socket.io-client';
import { VITE_API_BASE_URL } from '../config/env';

let socket: Socket | null = null;
let tokenGetter: (() => Promise<string | null>) | null = null;

export const setTokenGetter = (fn: (() => Promise<string | null>) | null) => {
  tokenGetter = fn;
};

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(VITE_API_BASE_URL, {
      autoConnect: false,
      transports: ['websocket'],
      auth: async (cb) => {
        const token = tokenGetter ? await tokenGetter() : null;
        cb({ token });
      },
    });

    socket.on('connect', () => console.log('🔌 [Socket.io] Conectado exitosamente'));
    socket.on('disconnect', (reason: string) => console.log('🔌 [Socket.io] Desconectado por:', reason));
    socket.on('connect_error', (error: Error) => console.error('❌ [Socket.io] Error de conexión:', error.message));
  }
  return socket;
};

export const connectSocket = () => {
  const s = getSocket();
  if (!s.connected) {
    console.log('🔌 [Socket.io] Conectando al servidor...');
    s.connect();
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket.removeAllListeners();
    socket = null;
  }
};
