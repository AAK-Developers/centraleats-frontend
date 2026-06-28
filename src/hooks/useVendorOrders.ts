import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../api/axiosConfig";
import type { VendorOrder } from "../components/restaurant/types/vendor.types";

export function useVendorOrders(restaurantId?: string) {
    const [orders, setOrders] = useState<VendorOrder[]>([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);

    const fetchOrders = useCallback(async () => {
        if (!restaurantId || restaurantId === "test-restaurant-id") return;
        setIsLoadingOrders(true);
        try {
            const res = await apiClient.get(`/api/orders/vendor?vendorId=${restaurantId}`);
            setOrders(res.data?.data || res.data || []);
        } catch (err) {
            console.error("Error fetching vendor orders:", err);
        } finally {
            setIsLoadingOrders(false);
        }
    }, [restaurantId]);

    useEffect(() => {
        if (!restaurantId || restaurantId === "test-restaurant-id") return;

        const timer = setTimeout(() => fetchOrders(), 0);
        const interval = setInterval(fetchOrders, 4000);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [restaurantId, fetchOrders]);

    const nuevos = orders.filter((o) => o.status === "PENDING_PAYMENT" || o.status === "PAID" || o.status === "RECEIVED");
    const enCocina = orders.filter((o) => o.status === "PREPARING");
    const listos = orders.filter((o) => o.status === "READY" || o.status === "PICKED_UP");

    return { nuevos, enCocina, listos, refreshOrders: fetchOrders, isLoadingOrders };
}
