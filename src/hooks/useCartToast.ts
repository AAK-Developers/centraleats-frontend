import { useCallback, useRef, useState } from "react";

export interface CartToastData {
    id: string;
    productName: string;
    vendorName: string;
    price: number;
    imageUrl?: string;
}

const AUTO_DISMISS_MS = 3200;


export function useCartToast() {
    const [toasts, setToasts] = useState<CartToastData[]>([]);
    const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

    const dismiss = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        if (timers.current[id]) {
            clearTimeout(timers.current[id]);
            delete timers.current[id];
        }
    }, []);

    const notify = useCallback((data: Omit<CartToastData, "id">) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const toastItem: CartToastData = { ...data, id };

        setToasts((prev) => [...prev, toastItem]);

        timers.current[id] = setTimeout(() => {
            dismiss(id);
        }, AUTO_DISMISS_MS);
    }, [dismiss]);

    return { toasts, notify, dismiss };
}