import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '../api/axiosConfig';

export type OrderStatus =
    | 'PENDING_PAYMENT'
    | 'PAID'
    | 'RECEIVED'
    | 'PREPARING'
    | 'READY'
    | 'PICKED_UP'
    | 'COMPLETED'
    | 'CANCELLED';

export interface StudentOrderItem {
    id: string;
    productName: string;
    quantity: number;
}

export interface StudentOrder {
    id: string;
    status: OrderStatus;
    totalAmount: number;
    notes?: string;
    createdAt: string;
    vendorName?: string;
    pickupCode?: string | null;
    items: StudentOrderItem[];
}

const ACTIVE_STATUSES: OrderStatus[] = [
    'PENDING_PAYMENT',
    'PAID',
    'RECEIVED',
    'PREPARING',
    'READY',
    'PICKED_UP',
];

export const STATUS_LABELS: Record<OrderStatus, string> = {
    PENDING_PAYMENT: 'Pendiente de pago',
    PAID: 'Pagado',
    RECEIVED: 'Recibido por el local',
    PREPARING: 'En preparación',
    READY: '¡Listo para retirar!',
    PICKED_UP: 'Retirado',
    COMPLETED: 'Completado',
    CANCELLED: 'Cancelado',
};

export const STATUS_COLORS: Record<OrderStatus, string> = {
    PENDING_PAYMENT: 'orange',
    PAID: 'blue',
    RECEIVED: 'purple',
    PREPARING: 'yellow',
    READY: 'green',
    PICKED_UP: 'teal',
    COMPLETED: 'gray',
    CANCELLED: 'red',
};

export const useStudentOrders = () => {
    const [orders, setOrders] = useState<StudentOrder[]>([]);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const hasFetchedOnce = useRef(false);

    const fetchOrders = useCallback(async () => {
        try {
            const res = await apiClient.get('/api/orders/student');
            const list: StudentOrder[] = res.data?.data || res.data || [];
            setOrders(list);
        } catch (err) {
            console.error('Error fetching student orders:', err);
            setOrders([]);
        } finally {
            if (!hasFetchedOnce.current) {
                hasFetchedOnce.current = true;
                setIsInitialLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchOrders();
        }, 0);
        const interval = setInterval(fetchOrders, 8000);
        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [fetchOrders]);

    const activeOrders = orders.filter((o) =>
        ACTIVE_STATUSES.includes(o.status)
    );

    const hasReadyOrders = activeOrders.some((o) => o.status === 'READY');

    return {
        orders,
        activeOrders,
        hasReadyOrders,
        isLoading: isInitialLoading,
        isInitialLoading,
        refresh: fetchOrders,
    };
};