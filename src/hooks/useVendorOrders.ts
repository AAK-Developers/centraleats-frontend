import { useState, useEffect, useCallback, useRef } from "react";
import { apiClient } from "../api/axiosConfig";
import { useSocket } from "./useSocket";
import type { VendorOrder } from "../components/restaurant/types/vendor.types";

export function useVendorOrders(restaurantId?: string) {
    const [orders, setOrders] = useState<VendorOrder[]>([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);
    const isFetchingRef = useRef(false);

    const fetchOrders = useCallback(async () => {
        if (!restaurantId || restaurantId === "test-restaurant-id") return;
        if (isFetchingRef.current) return; // Prevent parallel overlapping requests
        
        isFetchingRef.current = true;
        setIsLoadingOrders(true);
        try {
            const res = await apiClient.get(`/api/orders/vendor?vendorId=${restaurantId}`);
            setOrders(res.data?.data || res.data || []);
        } catch (err) {
            console.error("Error fetching vendor orders:", err);
        } finally {
            setIsLoadingOrders(false);
            // Pequeño retardo para evitar spam de peticiones si hay ráfagas de websockets
            setTimeout(() => {
                isFetchingRef.current = false;
            }, 300);
        }
    }, [restaurantId]);

    useEffect(() => {
        if (!restaurantId || restaurantId === "test-restaurant-id") return;

        const timer = setTimeout(() => fetchOrders(), 0);

        return () => {
            clearTimeout(timer);
        };
    }, [restaurantId, fetchOrders]);

    useSocket('orderUpdated', fetchOrders);
    useSocket('orderCreated', fetchOrders);

    const nuevos = orders.filter((o) => o.status === "PENDING_PAYMENT" || o.status === "PAID" || o.status === "RECEIVED");
    const enCocina = orders.filter((o) => o.status === "PREPARING");
    const listos = orders.filter((o) => o.status === "READY" || o.status === "PICKED_UP");
    const completedOrders = orders.filter((o) => o.status === "COMPLETED");

    return { nuevos, enCocina, listos, completedOrders, refreshOrders: fetchOrders, isLoadingOrders };
}