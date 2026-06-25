import { useState, useEffect } from 'react';
import { apiClient } from '../api/axiosConfig';
import { useRestaurants, type Restaurant } from './useRestaurants';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number; // in cents
    stock: number;
    imageUrl: string;
    isAvailable: boolean;
    vendorId: string;
    vendorName: string;
}

interface ApiProduct {
    id: string;
    name: string;
    description?: string;
    price: number;
    stock?: number;
    imageUrl?: string;
    isAvailable: boolean;
    vendorId?: string;
    vendorName?: string;
}

export const useAllProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { restaurants } = useRestaurants();

    useEffect(() => {
        const fetchAll = async () => {
            setIsLoading(true);
            try {
                // Try to fetch all products at once
                const res = await apiClient.get('/api/products');
                const list: ApiProduct[] = res.data?.data || res.data || [];

                // Build a vendorName lookup map from restaurants already fetched
                const vendorMap: Record<string, string> = {};
                restaurants.forEach((r: Restaurant) => {
                    if (r.id) vendorMap[r.id] = r.name;
                });

                setProducts(
                    list.map((p) => ({
                        id: p.id,
                        name: p.name,
                        description: p.description || '',
                        price: p.price,
                        stock: p.stock ?? 0,
                        imageUrl:
                            p.imageUrl ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=0D8ABC&color=fff&size=200`,
                        isAvailable: p.isAvailable,
                        vendorId: p.vendorId || '',
                        vendorName:
                            p.vendorName ||
                            (p.vendorId ? vendorMap[p.vendorId] : '') ||
                            'Restaurante',
                    }))
                );
            } catch (err) {
                console.error('Error fetching all products:', err);
                // Fallback: fetch products per restaurant
                if (restaurants.length > 0) {
                    try {
                        const perVendor = await Promise.all(
                            restaurants
                                .filter((r) => r.id)
                                .map((r) =>
                                    apiClient
                                        .get(`/api/products?vendorId=${r.id}`)
                                        .then((res) => {
                                            const list: ApiProduct[] =
                                                res.data?.data || res.data || [];
                                            return list.map((p) => ({
                                                id: p.id,
                                                name: p.name,
                                                description: p.description || '',
                                                price: p.price,
                                                stock: p.stock ?? 0,
                                                imageUrl:
                                                    p.imageUrl ||
                                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=0D8ABC&color=fff&size=200`,
                                                isAvailable: p.isAvailable,
                                                vendorId: r.id || '',
                                                vendorName: r.name,
                                            }));
                                        })
                                        .catch(() => [] as Product[])
                                )
                        );
                        setProducts(perVendor.flat());
                    } catch (fallbackErr) {
                        console.error('Fallback fetch failed:', fallbackErr);
                    }
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (restaurants.length > 0 || !isLoading) {
            fetchAll();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [restaurants]);

    return { products, isLoading };
};
