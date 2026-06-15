import { useState, useEffect } from 'react';

export const useRestaurants = () => {
    const [restaurants, setRestaurants] = useState<any[]>([]);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await fetch('https://tu-api.com/api/restaurants');
                const data = await response.json();
                setRestaurants(data);
            } catch (error) {
                console.error("Error al cargar restaurantes:", error);
            }
        };

        fetchRestaurants();
    }, []);

    return { restaurants };
};