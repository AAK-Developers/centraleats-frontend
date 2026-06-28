import { useState } from "react";
import { SimpleGrid } from "@chakra-ui/react";
import toast from "react-hot-toast";
import { apiClient } from "../../../api/axiosConfig";
import { VendorOrderCard } from "../molecules/VendorOrderCard";
import { EmptyOrdersVendor } from "../molecules/EmptyOrdersVendor";
import { PickupCodeModal } from "../molecules/PickupCodeModal";
import type { VendorOrder } from "../types/vendor.types";
import type { OrderTab } from "../molecules/OrderTabsVendor";

interface VendorOrdersPanelProps {
    orders: VendorOrder[];
    activeTab: OrderTab;
    onRefresh: () => void;
}

interface PendingDelivery {
    orderId: string;
    orderLabel: string;
    pickupCode: string;
}

export function VendorOrdersPanel({ orders, activeTab, onRefresh }: VendorOrdersPanelProps) {
    const [pendingDelivery, setPendingDelivery] = useState<PendingDelivery | null>(null);
    const [pickupError, setPickupError] = useState("");
    const [isConfirmingDelivery, setIsConfirmingDelivery] = useState(false);

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

    const handleDeliver = (orderId: string, pickupCode?: string | null) => {
        if (pickupCode) {
            const order = orders.find((o) => o.id === orderId);
            setPickupError("");
            setPendingDelivery({
                orderId,
                orderLabel: `Pedido #${orderId.slice(-6).toUpperCase()}${order?.user?.fullName ? ` — ${order.user.fullName}` : ""}`,
                pickupCode,
            });
            return;
        }
        completeDelivery(orderId);
    };


    const completeDelivery = async (orderId: string) => {
        try {
            await apiClient.patch(`/api/orders/${orderId}/status`, { status: "PICKED_UP" });
            await apiClient.patch(`/api/orders/${orderId}/status`, { status: "COMPLETED" });
            toast.success("¡Pedido entregado con éxito!");
            onRefresh();
        } catch {
            toast.error("Error al entregar pedido");
        }
    };

    const handleModalConfirm = async (inputCode: string) => {
        if (!pendingDelivery) return;

        if (inputCode.trim() !== pendingDelivery.pickupCode.trim()) {
            setPickupError("Código incorrecto. Verifica con el estudiante e intenta de nuevo.");
            return;
        }

        setIsConfirmingDelivery(true);
        try {
            await completeDelivery(pendingDelivery.orderId);
            setPendingDelivery(null);
            setPickupError("");
        } finally {
            setIsConfirmingDelivery(false);
        }
    };

    const handleModalCancel = () => {
        setPendingDelivery(null);
        setPickupError("");
    };

    if (orders.length === 0) return <EmptyOrdersVendor />;

    return (
        <>
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

            <PickupCodeModal
                isOpen={!!pendingDelivery}
                vendorOrderLabel={pendingDelivery?.orderLabel ?? ""}
                onConfirm={handleModalConfirm}
                onCancel={handleModalCancel}
                error={pickupError}
                isSubmitting={isConfirmingDelivery}
            />
        </>
    );
}
