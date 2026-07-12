import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@clerk/clerk-react";
import { useInvalidateVendorMetrics } from "./useVendorMetrics";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export function useVendorMetricsSocket() {
  const { getToken } = useAuth();
  const invalidateMetrics = useInvalidateVendorMetrics();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    let socket: Socket;
    let mounted = true;

    const connect = async () => {
      try {
        const token = await getToken();
        if (!token || !mounted) return;

        socket = io(API_URL, {
          auth: { token },
          transports: ["websocket"],
          reconnection: true,
          reconnectionAttempts: 10,
          reconnectionDelay: 2000,
        });

        socket.on("connect", () => {
          console.log("[MetricsSocket] Connected:", socket.id);
        });

        socket.on("metrics.updated", () => {
          invalidateMetrics();
        });

        socket.on("disconnect", (reason) => {
          console.log("[MetricsSocket] Disconnected:", reason);
        });

        socketRef.current = socket;
      } catch (err) {
        console.error("[MetricsSocket] Connection error:", err);
      }
    };

    connect();

    return () => {
      mounted = false;
      socket?.disconnect();
      socketRef.current = null;
    };
  }, [getToken, invalidateMetrics]);
}
