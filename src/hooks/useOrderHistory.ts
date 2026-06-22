import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/axiosConfig';

interface Order {
    id: string;
    restaurant: string;
    price: string;
    date: string;
    status: "Entregado";
    imageUrl?: string;
}

export const useOrderHistory = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get('/api/student/order-history');
            // Handle wrapped backend response
            const responseData = response.data.data || response.data;
            setOrders(Array.isArray(responseData) ? responseData : []);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchOrders();
    }, [fetchOrders]);

    return { orders, isLoading, error, refetch: fetchOrders };
};