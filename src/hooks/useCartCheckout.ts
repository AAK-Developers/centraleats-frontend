import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useCartStore } from "../store/cartStore";
import { apiClient } from "../api/axiosConfig";

export type PaymentMethod = "efectivo" | "tarjeta" | null;
export type PanelView = "cart" | "confirm" | "card-form" | "factura";

export interface CompletedOrder {
    id: string;
    totalAmount: number;
    vendorName: string;
    items: Array<{ productName: string; quantity: number; unitPrice: number }>;
    paymentMethod: string;
}

interface UseCartCheckoutOptions {
    onClose: () => void;
}
export function useCartCheckout({ onClose }: UseCartCheckoutOptions) {
    const navigate = useNavigate();
    const { items, vendorId, vendorName, clearCart, totalAmount } = useCartStore();

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
    const [view, setView] = useState<PanelView>("cart");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);

    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCvv, setCardCvv] = useState("");
    const [cardError, setCardError] = useState("");

    const subtotalCents = totalAmount();
    const subtotalDollars = subtotalCents / 100;

    const resetCart = () => {
        setView("cart");
        setPaymentMethod(null);
        setCardNumber("");
        setCardName("");
        setCardExpiry("");
        setCardCvv("");
        setCardError("");
        setCompletedOrder(null);
    };

    const handleClose = () => {
        resetCart();
        onClose();
    };

    const handleSeguirPedido = () => {
        handleClose();
        navigate("/student-dashboard");
    };

    const submitOrder = async (isPaid: boolean) => {
        if (!vendorId || items.length === 0) {
            toast.error("El carrito está vacío.");
            return;
        }
        setIsSubmitting(true);
        try {
            const orderRes = await apiClient.post("/api/orders", {
                vendorId,
                items: items.map((i) => ({
                    productId: i.product.id,
                    quantity: i.quantity,
                })),
                notes: "",
            });

            const newOrder = orderRes.data?.data || orderRes.data;
            if (!newOrder?.id) throw new Error("No se recibió un ID de orden.");

            const snapshot: CompletedOrder = {
                id: newOrder.id,
                totalAmount: subtotalCents,
                vendorName,
                items: items.map((i) => ({
                    productName: i.product.name,
                    quantity: i.quantity,
                    unitPrice: i.product.price / 100,
                })),
                paymentMethod: isPaid ? "Tarjeta" : "Efectivo al retirar",
            };

            if (isPaid) {
                await apiClient.patch(`/api/orders/${newOrder.id}/status`, { status: "PAID" });
                toast.success("¡Pedido pagado y enviado al restaurante!");
            } else {
                toast.success("¡Pedido enviado al restaurante! 🍽️", { duration: 4000 });
            }

            clearCart();
            setCompletedOrder(snapshot);
            setView("factura");
        } catch (err) {
            console.error("Error placing order:", err);
            toast.error("Error al procesar el pedido. Intenta de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAction = () => {
        if (!paymentMethod) return;
        if (paymentMethod === "tarjeta") {
            setView("card-form");
            return;
        }
        setView("confirm");
    };

    const handleCardSubmit = () => {
        if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
            setCardError("Completa todos los campos de la tarjeta");
            return;
        }
        if (cardNumber.replace(/\s/g, "").length < 16) {
            setCardError("Número de tarjeta inválido");
            return;
        }
        if (cardCvv.length < 3) {
            setCardError("CVV inválido");
            return;
        }
        setCardError("");
        submitOrder(true);
    };

    return {
        items,
        vendorName,
        subtotalCents,
        subtotalDollars,

        view,
        setView,
        isSubmitting,
        completedOrder,

        paymentMethod,
        setPaymentMethod,

        cardNumber,
        setCardNumber,
        cardName,
        setCardName,
        cardExpiry,
        setCardExpiry,
        cardCvv,
        setCardCvv,
        cardError,

        handleClose,
        handleSeguirPedido,
        handleAction,
        handleCardSubmit,
        submitOrder,
    };
}