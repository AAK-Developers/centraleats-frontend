import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/axiosConfig';

export interface Notification {
    id: string;
    title: string;
    restaurant: string;
    status: string;
}

export const useNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchNotifications = useCallback(async () => {
        try {
            const response = await apiClient.get('/api/orders/student');
            const responseData: Array<{
                id: string;
                status: string;
                vendorName?: string;
            }> = response.data?.data || response.data || [];

            // Only surface READY orders as notifications
            const readyOrders = responseData.filter(
                (o) => o.status === 'READY'
            );

            setNotifications(
                readyOrders.map((o) => ({
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
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 8000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const clearAll = () => {
        setNotifications([]);
    };

    return { notifications, isLoading, clearAll, refresh: fetchNotifications };
};