// ─── Restaurant ───────────────────────────────────────────────────────────────

export interface VendorRestaurant {
    id: string;
    name: string;
    logoUrl: string;
    description: string;
    location: string;
    phone: string;
    openingTime: string;
    closingTime: string;
}

export interface ApiRestaurant {
    id: string;
    ownerId: string;
    name: string;
    logoUrl?: string;
    description?: string;
    location?: string;
    phone?: string;
    openingTime?: string;
    closingTime?: string;
}

// ─── Product ──────────────────────────────────────────────────────────────────

export interface VendorProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    isAvailable: boolean;
    categoryId?: string;
}

export interface ApiProduct {
    id: string;
    name: string;
    description?: string;
    price: number;
    stock?: number;
    imageUrl?: string;
    isAvailable: boolean;
    categoryId?: string;
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export interface OrderItem {
    id: string;
    productName: string;
    quantity: number;
}

export interface VendorOrder {
    id: string;
    status: string;
    totalAmount: number;
    notes?: string;
    createdAt: string;
    pickupCode?: string | null;
    user?: {
        fullName?: string;
        email?: string;
    } | null;
    items: OrderItem[];
}

export const STATUS_BADGE: Record<string, { label: string; color: string }> = {
    PENDING_PAYMENT: { label: "Pago pendiente (efectivo)", color: "orange" },
    PAID: { label: "Pagado (tarjeta)", color: "green" },
    RECEIVED: { label: "Aceptado", color: "blue" },
    PREPARING: { label: "En preparación", color: "yellow" },
    READY: { label: "Listo para retirar", color: "teal" },
    PICKED_UP: { label: "Retirado", color: "gray" },
    COMPLETED: { label: "Completado", color: "gray" },
};
