import { SimpleGrid } from "@chakra-ui/react";
import toast from "react-hot-toast";
import { apiClient } from "../../../api/axiosConfig";
import { VendorOrderCard } from "../molecules/VendorOrderCard";
import { EmptyOrdersVendor } from "../molecules/EmptyOrdersVendor";
import type { VendorOrder } from "../types/vendor.types";
import type { OrderTab } from "../molecules/OrderTabsVendor";

interface VendorOrdersPanelProps {
    orders: VendorOrder[];
    activeTab: OrderTab;
    onRefresh: () => void;
}

export function VendorOrdersPanel({ orders, activeTab, onRefresh }: VendorOrdersPanelProps) {
    const handleAccept = async (orderId: string) => {
        try {
            await apiClient.patch(`/api/orders/${orderId}/status`, { status: "RECEIVED" });
            toast.success("Pedido aceptado. Ahora pasa a cocina.");
            onRefresh();
        } catch {
            toast.error("Error al aceptar pedido");
        }
    };

    const handleStartCooking = async (orderId: string) => {
        try {
            await apiClient.patch(`/api/orders/${orderId}/status`, { status: "PREPARING" });
            toast.success("¡Pedido en preparación!");
            onRefresh();
        } catch {
            toast.error("Error al iniciar preparación");
        }
    };

    const handleReady = async (orderId: string) => {
        try {
            await apiClient.patch(`/api/orders/${orderId}/status`, { status: "READY" });
            toast.success("¡Pedido marcado como listo para retirar!");
            onRefresh();
        } catch {
            toast.error("Error al actualizar estado");
        }
    };

    const handleDeliver = async (orderId: string, pickupCode?: string | null) => {
        if (pickupCode) {
            const inputCode = window.prompt(
                "Ingrese el código de retiro de 4 dígitos proporcionado por el estudiante:"
            );
            if (inputCode === null) return;
            if (inputCode.trim() !== pickupCode.trim()) {
                toast.error("Código de retiro incorrecto. No se puede entregar el pedido.");
                return;
            }
        }
        try {
            await apiClient.patch(`/api/orders/${orderId}/status`, { status: "PICKED_UP" });
            await apiClient.patch(`/api/orders/${orderId}/status`, { status: "COMPLETED" });
            toast.success("¡Pedido entregado con éxito!");
            onRefresh();
        } catch {
            toast.error("Error al entregar pedido");
        }
    };

    if (orders.length === 0) return <EmptyOrdersVendor />;

    return (
        <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            gap={{ base: 4, md: 6 }}
            pb={10}
            w="full"
        >
            {orders.map((order) => (
                <VendorOrderCard
                    key={order.id}
                    order={order}
                    onAccept={
                        activeTab === "nuevos" &&
                            (order.status === "PENDING_PAYMENT" || order.status === "PAID")
                            ? () => handleAccept(order.id)
                            : undefined
                    }
                    onStartCooking={
                        activeTab === "nuevos" && order.status === "RECEIVED"
                            ? () => handleStartCooking(order.id)
                            : undefined
                    }
                    onReady={
                        activeTab === "en_cocina"
                            ? () => handleReady(order.id)
                            : undefined
                    }
                    onDeliver={
                        activeTab === "listos"
                            ? () => handleDeliver(order.id, order.pickupCode)
                            : undefined
                    }
                />
            ))}
        </SimpleGrid>
    );
}
