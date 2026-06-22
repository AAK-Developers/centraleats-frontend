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
            const response = await apiClient.get('/api/restaurants');
            // Unwrap the data property from the backend DTO
            const responseData = response.data.data || response.data;
            setNotifications(Array.isArray(responseData) ? responseData : []);
        } catch (error) {
            console.error("Failed to load notifications:", error);
            setNotifications([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchNotifications();
    }, [fetchNotifications]);

    const clearAll = async () => {
        setNotifications([]);
    };

    return { notifications, isLoading, clearAll };
};