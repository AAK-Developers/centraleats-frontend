import { useEffect, useRef } from 'react';
import { getSocket } from '../lib/socketManager';

export const useSocket = (eventName: string, callback: (data: any) => void) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const socket = getSocket();
    const handler = (data: any) => callbackRef.current(data);
    socket.on(eventName, handler);
    return () => {
      socket.off(eventName, handler);
    };
  }, [eventName]);
};

export default useSocket;
