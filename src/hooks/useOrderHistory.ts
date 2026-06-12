import { useState, useEffect } from 'react';

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

    const fetchOrders = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/student/order-history', { //backend
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // If you need to send an authentication token:
                    // 'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener el historial de pedidos');
            }

            const data = await response.json();
            setOrders(data);
        } catch (err: any) {
            setError(err.message || 'Error desconocido');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return { orders, isLoading, error, refetch: fetchOrders };
};