import { create } from 'zustand';

export interface CartProduct {
    id: string;
    name: string;
    description: string;
    price: number; // in cents
    imageUrl: string;
}

export interface CartItem {
    product: CartProduct;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    vendorId: string | null;
    vendorName: string;
    // Returns true if the cart is empty or same vendor, false if conflict
    addItem: (product: CartProduct, vendorId: string, vendorName: string) => 'added' | 'conflict';
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: () => number;
    totalAmount: () => number; // in cents
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    vendorId: null,
    vendorName: '',

    addItem: (product, vendorId, vendorName) => {
        const state = get();

        // If cart has items from a different vendor → conflict
        if (state.vendorId && state.vendorId !== vendorId && state.items.length > 0) {
            return 'conflict';
        }

        set((s) => {
            const existing = s.items.find((i) => i.product.id === product.id);
            if (existing) {
                return {
                    items: s.items.map((i) =>
                        i.product.id === product.id
                            ? { ...i, quantity: i.quantity + 1 }
                            : i
                    ),
                    vendorId,
                    vendorName,
                };
            }
            return {
                items: [...s.items, { product, quantity: 1 }],
                vendorId,
                vendorName,
            };
        });

        return 'added';
    },

    removeItem: (productId) => {
        set((s) => {
            const next = s.items.filter((i) => i.product.id !== productId);
            return {
                items: next,
                vendorId: next.length === 0 ? null : s.vendorId,
                vendorName: next.length === 0 ? '' : s.vendorName,
            };
        });
    },

    updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
            get().removeItem(productId);
            return;
        }
        set((s) => ({
            items: s.items.map((i) =>
                i.product.id === productId ? { ...i, quantity } : i
            ),
        }));
    },

    clearCart: () => set({ items: [], vendorId: null, vendorName: '' }),

    totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),

    totalAmount: () =>
        get().items.reduce((acc, i) => acc + i.product.price * i.quantity, 0),
}));
