import { useState, useEffect, useCallback, useRef } from 'react';
import { useSocket } from './useSocket';

export interface AppNotification {
    id: string;
    title: string;
    restaurant: string;
    status: string;
    receivedAt: number;
}

interface OrderUpdatedPayload {
    orderId: string;
    status: string;
}

const STUDENT_NOTIFICATION_STATUSES = ['RECEIVED', 'PREPARING', 'READY'];

const STUDENT_NOTIFICATION_TITLES: Record<string, string> = {
    RECEIVED: '✅ ¡Tu pedido fue aceptado por el local!',
    PREPARING: '🔥 ¡Tu pedido está en preparación!',
    READY: '🔔 ¡Tu pedido está listo para retirar!',
};

const VENDOR_NOTIFICATION_STATUSES = ['PENDING_PAYMENT', 'PAID', 'RECEIVED'];

const VENDOR_NOTIFICATION_TITLES: Record<string, string> = {
    PENDING_PAYMENT: '🛒 ¡Nuevo pedido recibido! Pendiente de pago',
    PAID: '💳 ¡Nuevo pedido pagado! Listo para preparar',
    RECEIVED: '📦 ¡Nuevo pedido en tu restaurante!',
};

export type NotificationRole = 'student' | 'vendor';

interface UseNotificationsOptions {
    role?: NotificationRole;
    vendorId?: string;
}

const getDismissedStorageKey = (role: NotificationRole, vendorId?: string) =>
    role === 'vendor'
        ? `dismissedNotifications:vendor:${vendorId ?? 'unknown'}`
        : `dismissedNotifications:student`;

const loadDismissedIds = (storageKey: string): Set<string> => {
    try {
        const raw = localStorage.getItem(storageKey);
        if (!raw) return new Set();
        const parsed = JSON.parse(raw);
        return new Set(Array.isArray(parsed) ? parsed : []);
    } catch {
        return new Set<string>();
    }
};

const saveDismissedIds = (storageKey: string, ids: Set<string>) => {
    try {
        localStorage.setItem(storageKey, JSON.stringify(Array.from(ids)));
    } catch (e) {
        console.warn('Could not save dismissed notifications', e);
    }
};

export const useNotifications = (options: UseNotificationsOptions = {}) => {
    const { role = 'student', vendorId } = options;

    const storageKey = getDismissedStorageKey(role, vendorId);
    const dismissedIdsRef = useRef<Set<string>>(loadDismissedIds(storageKey));
    const seenIdsRef = useRef<Set<string>>(new Set());

    const [notifications, setNotifications] = useState<AppNotification[]>([]);

    useEffect(() => {
        dismissedIdsRef.current = loadDismissedIds(storageKey);
        seenIdsRef.current = new Set();
        setNotifications([]);
    }, [storageKey]);

    const handleOrderUpdated = useCallback((payload: OrderUpdatedPayload) => {
        if (role === 'vendor' && (!vendorId || vendorId === 'test-restaurant-id')) return;

        const relevantStatuses = role === 'vendor'
            ? VENDOR_NOTIFICATION_STATUSES
            : STUDENT_NOTIFICATION_STATUSES;

        if (!relevantStatuses.includes(payload.status)) return;

        const cardId = `${payload.orderId}-${payload.status}`;
        if (dismissedIdsRef.current.has(cardId) || seenIdsRef.current.has(cardId)) return;

        seenIdsRef.current.add(cardId);

        const titleMap = role === 'vendor' ? VENDOR_NOTIFICATION_TITLES : STUDENT_NOTIFICATION_TITLES;

        const newCard: AppNotification = {
            id: cardId,
            title: titleMap[payload.status] ?? '📦 Actualización de tu pedido',
            restaurant: `Pedido #${payload.orderId.slice(0, 8)}`,
            status: payload.status,
            receivedAt: Date.now(),
        };

        setNotifications((prev) => [newCard, ...prev]);
    }, [role, vendorId]);

    useSocket('orderUpdated', handleOrderUpdated);

    const clearAll = () => {
        notifications.forEach((n) => dismissedIdsRef.current.add(n.id));
        saveDismissedIds(storageKey, dismissedIdsRef.current);
        setNotifications([]);
    };

    return { notifications, clearAll };
};
