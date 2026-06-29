import { useState, useEffect } from 'react';
import { apiClient } from '../api/axiosConfig';

export interface Restaurant {
    id?: string;
    ownerId?: string;
    name: string;
    category: string;
    time: string;
    rating: number;
    image: string;
}

interface ApiRestaurant {
    id?: string;
    ownerId?: string;
    name: string;
    category?: string;
    description?: string;
    time?: string;
    openingTime?: string;
    closingTime?: string;
    rating?: number;
    image?: string;
    logoUrl?: string;
}

export const useRestaurants = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await apiClient.get('/api/restaurants');
                // Backend wraps responses in a { data: [...] } structure
                const responseData = response.data.data || response.data;
                const mappedData = (Array.isArray(responseData) ? responseData : []).map((r: ApiRestaurant) => ({
                    id: r.id,
                    ownerId: r.ownerId,
                    name: r.name,
                    category: r.category || r.description || "Comida UCE",
                    time: r.time || (r.openingTime && r.closingTime ? `${r.openingTime} - ${r.closingTime}` : "08:00 - 17:00"),
                    rating: r.rating || 4.8,
                    image: r.image || r.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.name)}&background=0D8ABC&color=fff&size=200`,
                }));
                setRestaurants(mappedData);
            } catch (error) {
                console.error("Failed to load restaurants:", error);
                setRestaurants([]);
            }
        };

        fetchRestaurants();
    }, []);

    return { restaurants };
};