import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/axiosConfig';

export interface AppNotification {
    id: string;
    title: string;
    restaurant: string;
    status: string;
}

const NOTIFICATION_STATUSES = ['RECEIVED', 'PREPARING', 'READY'];

const NOTIFICATION_TITLES: Record<string, string> = {
    RECEIVED: '✅ ¡Tu pedido fue aceptado por el local!',
    PREPARING: '🔥 ¡Tu pedido está en preparación!',
    READY: '🔔 ¡Tu pedido está listo para retirar!',
};

export const useNotifications = () => {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchNotifications = useCallback(async () => {
        try {
            const response = await apiClient.get('/api/orders/student');
            const rawData = response.data?.data || response.data || [];
            const responseData = Array.isArray(rawData) ? rawData : [];

            const relevantOrders = responseData.filter((o: any) =>
                NOTIFICATION_STATUSES.includes(o.status)
            );

            setNotifications(
                relevantOrders.map((o: any) => ({
                    id: o.id,
                    title: NOTIFICATION_TITLES[o.status] ?? '📦 Actualización de tu pedido',
                    restaurant: o.vendorName || 'Restaurante',
                    status: o.status,
                }))
            );
        } catch (error) {
            console.error('Failed to load notifications:', error);
            setNotifications([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => fetchNotifications(), 0);
        const interval = setInterval(fetchNotifications, 8000);
        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [fetchNotifications]);

    const clearAll = () => setNotifications([]);

    return { notifications, isLoading, clearAll, refresh: fetchNotifications };
};