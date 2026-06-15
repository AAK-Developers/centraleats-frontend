import { useState, useEffect } from 'react';

export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const response = await fetch('https://tu-api.com/api/restaurants');
            const data = await response.json();
            setNotifications(data);
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