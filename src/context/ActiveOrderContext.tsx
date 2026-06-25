import { createContext, useContext, useState, type ReactNode } from "react";

export interface ActiveOrder {
    restaurantName: string;
    productName: string;
    estimatedTime: string;
    orderId: string;
}

interface ActiveOrderContextType {
    activeOrder: ActiveOrder | null;
    setActiveOrder: (order: ActiveOrder | null) => void;
}

const ActiveOrderContext = createContext<ActiveOrderContextType | undefined>(undefined);

export const ActiveOrderProvider = ({ children }: { children: ReactNode }) => {
    const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(null);

    return (
        <ActiveOrderContext.Provider value={{ activeOrder, setActiveOrder }}>
            {children}
        </ActiveOrderContext.Provider>
    );
};

export const useActiveOrder = () => {
    const ctx = useContext(ActiveOrderContext);
    if (!ctx) throw new Error("useActiveOrder must be used within ActiveOrderProvider");
    return ctx;
};