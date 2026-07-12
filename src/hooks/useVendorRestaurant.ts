import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { apiClient } from "../api/axiosConfig";
import type { VendorRestaurant, VendorProduct, ApiRestaurant, ApiProduct } from "../components/restaurant/types/vendor.types";

import { fixImageUrl } from "../utils/imageUtils";

export function useVendorRestaurant() {
    const profile = useAuthStore((state) => state.profile);

    const [restaurant, setRestaurant] = useState<VendorRestaurant | null>(null);

    const [products, setProducts] = useState<VendorProduct[]>([]);
    const [isLoading, setIsLoading] = useState(() => !!profile?.id);

    useEffect(() => {
        const fetchVendorData = async () => {
            if (!profile?.id) return;
            setIsLoading(true);
            try {
                const res = await apiClient.get("/api/vendors");
                const list: ApiRestaurant[] = res.data?.data || res.data || [];

                const myRest = list.find(
                    (r) =>
                        r.ownerId === profile.id ||
                        (profile.clerkId && r.ownerId === profile.clerkId)
                );

                if (myRest) {
                    setRestaurant({
                        id: myRest.id,
                        name: myRest.name,
                        logoUrl:
                            fixImageUrl(myRest.logoUrl) ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(myRest.name)}&background=0D8ABC&color=fff&size=200`,
                        description: myRest.description || "",
                        location: myRest.location || "",
                        phone: myRest.phone || "",
                        openingTime: myRest.openingTime || "",
                        closingTime: myRest.closingTime || "",
                    });

                    const prodRes = await apiClient.get(`/api/products?vendorId=${myRest.id}`);
                    const prodList: ApiProduct[] = prodRes.data?.data || prodRes.data || [];

                    setProducts(
                        prodList.map((p) => ({
                            id: p.id,
                            name: p.name,
                            description: p.description || "",
                            price: p.price,
                            stock: p.stock || 0,
                            imageUrl:
                                fixImageUrl(p.imageUrl) ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=0D8ABC&color=fff&size=200`,
                            isAvailable: p.isAvailable,
                            categoryId: p.categoryId || (p as any).category?.id || "",
                        }))
                    );
                } else {
                    setRestaurant(null);
                    setProducts([]);
                }
            } catch (err) {
                console.error("Error fetching vendor restaurant:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchVendorData();
    }, [profile]);

    return { restaurant, products, isLoading };
}
