import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { VITE_API_BASE_URL } from '../config/env';

export interface UseSocketOptions {
  getToken?: () => Promise<string | null>;
  autoConnect?: boolean;
}

export const useSocket = (
  eventName: string,
  callback: (data: any) => void,
  options: UseSocketOptions = {}
) => {
  const { getToken, autoConnect = true } = options;
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    let isMounted = true;

    const connect = async () => {
      let token: string | null = null;
      if (getToken) {
        try {
          token = await getToken();
        } catch {
          console.warn('🔌 [Socket.io] No se pudo obtener el token de Clerk');
        }
      }

      if (!isMounted) return;

      if (!token) {
        console.warn('🔌 [Socket.io] Sin token disponible, no se conecta');
        return;
      }

      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.removeAllListeners();
        socketRef.current = null;
      }

      console.log('🔌 [Socket.io] Inicializando socket con token...');
      const s = io(VITE_API_BASE_URL, {
        autoConnect: false,
        transports: ['websocket'],
        auth: { token },
      });

      socketRef.current = s;

      s.on('connect', () => console.log('🔌 [Socket.io] Conectado exitosamente'));
      s.on('disconnect', (reason: string) => console.log('🔌 [Socket.io] Desconectado por:', reason));
      s.on('connect_error', (error: Error) => console.error('❌ [Socket.io] Error de conexión:', error.message));
      s.on(eventName, callback);

      if (autoConnect) {
        console.log('🔌 [Socket.io] Conectando al servidor...');
        s.connect();
      }
    };

    connect();

    return () => {
      isMounted = false;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.removeAllListeners();
        socketRef.current = null;
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventName, getToken, autoConnect]);

  useEffect(() => {
    const s = socketRef.current;
    if (!s) return;
    s.off(eventName, callback);
    s.on(eventName, callback);
    return () => {
      s.off(eventName, callback);
    };
  }, [callback, eventName]);
};

export default useSocket;