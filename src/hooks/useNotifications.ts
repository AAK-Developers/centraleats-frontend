import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '../api/axiosConfig';

export interface AppNotification {
    id: string;
    title: string;
    restaurant: string;
    status: string;
    receivedAt: number;
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
    const prevStorageKeyRef = useRef<string>(storageKey);

    const dismissedIdsRef = useRef<Set<string>>(loadDismissedIds(storageKey));
    const seenIdsRef = useRef<Set<string>>(new Set());
    const pendingResetRef = useRef(false);

    if (prevStorageKeyRef.current !== storageKey) {
        prevStorageKeyRef.current = storageKey;
        dismissedIdsRef.current = loadDismissedIds(storageKey);
        seenIdsRef.current = new Set();
        pendingResetRef.current = true;
    }

    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        if (pendingResetRef.current) {
            pendingResetRef.current = false;
            setNotifications([]);
        }
    });

    const fetchNotifications = useCallback(async () => {
        if (role === 'vendor' && (!vendorId || vendorId === 'test-restaurant-id')) {
            setIsLoading(false);
            return;
        }

        try {
            const url = role === 'vendor'
                ? `/api/orders/vendor?vendorId=${vendorId}`
                : '/api/orders/student';

            const response = await apiClient.get(url);
            const rawData = response.data?.data || response.data || [];
            const responseData = Array.isArray(rawData) ? rawData : [];

            const relevantStatuses = role === 'vendor'
                ? VENDOR_NOTIFICATION_STATUSES
                : STUDENT_NOTIFICATION_STATUSES;

            const titleMap = role === 'vendor'
                ? VENDOR_NOTIFICATION_TITLES
                : STUDENT_NOTIFICATION_TITLES;

            const relevantOrders = responseData.filter((o: any) =>
                relevantStatuses.includes(o.status)
            );

            const newCards: AppNotification[] = [];
            for (const o of relevantOrders) {
                const cardId = `${o.id}-${o.status}`;
                if (seenIdsRef.current.has(cardId)) continue;
                if (dismissedIdsRef.current.has(cardId)) continue;

                seenIdsRef.current.add(cardId);
                newCards.push({
                    id: cardId,
                    title: titleMap[o.status] ?? '📦 Actualización de tu pedido',
                    restaurant: o.vendorName || 'Restaurante',
                    status: o.status,
                    receivedAt: Date.now(),
                });
            }

            if (newCards.length > 0) {
                setNotifications((prev) => [...newCards, ...prev]);
            }
        } catch (error) {
            console.error('Failed to load notifications:', error);
        } finally {
            setIsLoading(false);
        }
    }, [role, vendorId]);

    useEffect(() => {
        const timer = setTimeout(() => fetchNotifications(), 0);
        const interval = setInterval(fetchNotifications, 8000);
        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [fetchNotifications]);

    const clearAll = () => {
        notifications.forEach((n) => dismissedIdsRef.current.add(n.id));
        saveDismissedIds(storageKey, dismissedIdsRef.current);
        setNotifications([]);
    };

    return { notifications, isLoading, clearAll, refresh: fetchNotifications };
};