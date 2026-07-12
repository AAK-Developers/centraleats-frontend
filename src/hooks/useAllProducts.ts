import { useQuery } from '@tanstack/react-query';
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
    categoryName: string;
    vendorWaitTime: number;
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
    categoryId?: string;
    categoryName?: string;
    category?: string | { id: string; name: string };
    vendorWaitTime?: number;
}

const CATEGORY_MAP: Record<string, string> = {
    "06542c60-ad6b-4844-b1b1-3ad6d5baf35a": "Almuerzos",
    "b5003928-6d64-417b-8798-2726d16c8cfb": "Bebidas",
    "153a9f76-160d-4895-814d-9831c33088cd": "Snacks"
};

const getCategoryName = (p: ApiProduct): string => {
    if (p.categoryName) return p.categoryName;
    if (typeof p.category === 'string') return p.category;
    if (p.category && typeof p.category === 'object' && p.category.name) return p.category.name;
    if (p.categoryId && CATEGORY_MAP[p.categoryId]) return CATEGORY_MAP[p.categoryId];
    return "Almuerzos"; // default fallback
};

import { fixImageUrl } from '../utils/imageUtils';

export const useAllProducts = () => {
    const { restaurants } = useRestaurants();

    const { data: products = [], isLoading, error } = useQuery({
        queryKey: ['all-products', restaurants.length],
        queryFn: async () => {
            if (restaurants.length === 0) return [];

            const vendorMap: Record<string, string> = {};
            const waitTimeMap: Record<string, number> = {};
            restaurants.forEach((r: Restaurant) => {
                if (r.id) {
                    vendorMap[r.id] = r.name;
                    waitTimeMap[r.id] = r.deliveryTime || 20;
                }
            });

            try {
                // Fetch all products at once
                const res = await apiClient.get<any>('/api/products');
                const list = res.data?.data || res.data || [];
                
                return (Array.isArray(list) ? list : []).map((p) => ({
                    id: p.id,
                    name: p.name,
                    description: p.description || '',
                    price: p.price,
                    stock: p.stock ?? 0,
                    imageUrl:
                        fixImageUrl(p.imageUrl) ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=0D8ABC&color=fff&size=200`,
                    isAvailable: p.isAvailable,
                    vendorId: p.vendorId || '',
                    vendorName: p.vendorId ? vendorMap[p.vendorId] || 'Vendor' : 'Vendor',
                    categoryName: getCategoryName(p),
                    vendorWaitTime: p.vendorWaitTime || (p.vendorId ? waitTimeMap[p.vendorId] : 20),
                }));
            } catch (err) {
                console.warn('Error fetching products:', err);
                return [];
            }
        },
        enabled: restaurants.length > 0,
        staleTime: 10 * 1000, // 10 seconds cache
    });

    return { products, isLoading, error };
};
