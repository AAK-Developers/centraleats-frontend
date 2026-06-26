import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/axiosConfig';

export interface AppNotification {
    id: string;
    title: string;
    restaurant: string;
    status: string;
}

export const useNotifications = () => {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchNotifications = useCallback(async () => {
        try {
            const response = await apiClient.get('/api/orders/student');
            const rawData = response.data?.data || response.data || [];
            const responseData = Array.isArray(rawData) ? rawData : [];

            const readyOrders = responseData.filter(
                (o: any) => o.status === 'READY'
            );

            setNotifications(
                readyOrders.map((o: any) => ({
                    id: o.id,
                    title: '¡Tu pedido está listo para retirar!',
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
        const timer = setTimeout(() => {
            fetchNotifications();
        }, 0);
        const interval = setInterval(fetchNotifications, 8000);
        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [fetchNotifications]);

    const clearAll = () => {
        setNotifications([]);
    };

    return { notifications, isLoading, clearAll, refresh: fetchNotifications };
};