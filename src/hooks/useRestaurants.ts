import { useState, useEffect } from 'react';
import { apiClient } from '../api/axiosConfig';

export interface Restaurant {
    name: string;
    category: string;
    time: string;
    rating: number;
    image: string;
}

export const useRestaurants = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

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