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
                // Backend wraps responses in a { data: [...] } structure
                const responseData = response.data.data || response.data;
                setRestaurants(Array.isArray(responseData) ? responseData : []);
            } catch (error) {
                console.error("Failed to load restaurants:", error);
                setRestaurants([]);
            }
        };

        fetchRestaurants();
    }, []);

    return { restaurants };
};