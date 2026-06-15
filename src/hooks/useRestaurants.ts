import { useState, useEffect } from 'react';
import { apiClient } from '../api/axiosConfig';

export const useRestaurants = () => {
    const [restaurants, setRestaurants] = useState<any[]>([]);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await apiClient.get('/api/restaurants');
                setRestaurants(response.data);
            } catch (error) {
                console.error("Error al cargar restaurantes:", error);
            }
        };

        fetchRestaurants();
    }, []);

    return { restaurants };
};