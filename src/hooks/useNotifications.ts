import { useState, useEffect } from 'react';
import { apiClient } from '../api/axiosConfig';

export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const response = await apiClient.get('/api/restaurants');
            setNotifications(response.data);
        } catch (error) {
            console.error("Error cargando notificaciones:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const clearAll = async () => {
        setNotifications([]);
    };

    return { notifications, isLoading, clearAll };
};