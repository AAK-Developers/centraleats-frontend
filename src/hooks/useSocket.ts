import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { VITE_API_BASE_URL } from '../config/env';

// Instancia singleton para evitar múltiples conexiones simultáneas
let socket: Socket | null = null;

const getSocket = (token?: string | null): Socket => {
  const url = VITE_API_BASE_URL || 'http://localhost:3000';
  if (!socket) {
    console.log('🔌 [Socket.io] Inicializando socket client para:', url);
    socket = io(url, {
      autoConnect: false, // Controlado por el hook
      transports: ['websocket'], // Forzar websockets
    });
  }

  // Actualizar token dinámicamente si se provee
  if (token) {
    socket.auth = { token };
  }

  return socket;
};

export interface UseSocketOptions {
  token?: string | null;
  autoConnect?: boolean;
}

/**
 * Hook personalizado para suscribirse a eventos de Socket.io de forma segura.
 * 
 * @param eventName Nombre del evento al que suscribirse (ej: 'orderStatusUpdated')
 * @param callback Callback que se ejecutará al recibir el evento
 * @param options Opciones adicionales como el token de autenticación
 */
export const useSocket = (
  eventName: string,
  callback: (data: any) => void,
  options: UseSocketOptions = {}
) => {
  useEffect(() => {
    const s = getSocket(options.token);

    // Conectar si no está conectado
    if (!s.connected && (options.autoConnect ?? true)) {
      console.log('🔌 [Socket.io] Conectando al servidor...');
      s.connect();
    }

    // Handlers de estado internos para depuración
    const handleConnect = () => {
      console.log('🔌 [Socket.io] Conectado exitosamente');
    };

    const handleDisconnect = (reason: string) => {
      console.log('🔌 [Socket.io] Desconectado por:', reason);
    };

    const handleConnectError = (error: Error) => {
      console.error('❌ [Socket.io] Error de conexión:', error.message);
    };

    s.on('connect', handleConnect);
    s.on('disconnect', handleDisconnect);
    s.on('connect_error', handleConnectError);
    
    // Suscribir al evento específico
    s.on(eventName, callback);

    // Limpieza al desmontar
    return () => {
      console.log(`🔌 [Socket.io] Removiendo listener del evento: "${eventName}"`);
      s.off(eventName, callback);
      s.off('connect', handleConnect);
      s.off('disconnect', handleDisconnect);
      s.off('connect_error', handleConnectError);
    };
  }, [eventName, callback, options.token, options.autoConnect]);

  return socket;
};
export default useSocket;
