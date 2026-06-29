import { Box } from "@chakra-ui/react";
import { useUser } from "@clerk/clerk-react";

import { CartPanelHeader } from "../molecules/CartPanelHeader";
import { CartItemsView } from "./CartItemsView";
import { ConfirmOrderPanel } from "./ConfirmOrderPanel";
import { CardForm } from "../molecules/CartCardForm";
import { InvoicePanel } from "../../student/invoice/organisms/InvoicePanel";

import { useCartStore } from "../../../store/cartStore";
import { useCartCheckout } from "../../../hooks/useCartCheckout";
import type { InvoiceItemData } from "../molecules/CartInvoiceItemsTable";

interface CartPanelProps {
    isOpen: boolean;
    onClose: () => void;
    isInline?: boolean;
}

export const CartPanel = ({ isOpen, onClose, isInline = false }: CartPanelProps) => {
    const { user } = useUser();
    const { removeItem, updateQuantity } = useCartStore();

    const {
        items,
        vendorName,
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
    } = useCartCheckout({ onClose });

    if (!isOpen && !isInline) return null;

    const isFacturaView = view === "factura";

    const headerTitle = isFacturaView
        ? "Factura"
        : view === "confirm"
            ? "Confirmar Pedido"
            : "Carrito";

    const invoiceItems: InvoiceItemData[] = completedOrder
        ? completedOrder.items.map((item, i) => ({
            code: String(i + 1),
            name: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
        }))
        : [];

    const content = (
        <>
            <CartPanelHeader
                title={headerTitle}
                showCloseButton={!isInline}
                onClose={handleClose}
            />

            {view === "cart" && (
                <CartItemsView
                    items={items}
                    vendorName={vendorName}
                    subtotalDollars={subtotalDollars}
                    paymentMethod={paymentMethod}
                    onPaymentMethodChange={setPaymentMethod}
                    onRemove={removeItem}
                    onIncrement={(id) => {
                        const current = items.find((i) => i.product.id === id);
                        if (current) updateQuantity(id, current.quantity + 1);
                    }}
                    onDecrement={(id) => {
                        const current = items.find((i) => i.product.id === id);
                        if (current) updateQuantity(id, current.quantity - 1);
                    }}
                    onAction={handleAction}
                />
            )}

            {view === "confirm" && (
                <ConfirmOrderPanel
                    vendorName={vendorName}
                    items={items}
                    subtotalDollars={subtotalDollars}
                    isSubmitting={isSubmitting}
                    onConfirm={() => submitOrder(false)}
                    onBack={() => setView("cart")}
                />
            )}

            {view === "card-form" && (
                <CardForm
                    cardNumber={cardNumber}
                    cardName={cardName}
                    cardExpiry={cardExpiry}
                    cardCvv={cardCvv}
                    subtotal={subtotalDollars}
                    onCardNumberChange={setCardNumber}
                    onCardNameChange={setCardName}
                    onCardExpiryChange={setCardExpiry}
                    onCardCvvChange={setCardCvv}
                    onBack={() => setView("cart")}
                    onSubmit={handleCardSubmit}
                    isSubmitting={isSubmitting}
                    error={cardError}
                />
            )}

            {view === "factura" && completedOrder && (
                <InvoicePanel
                    invoiceNumber={completedOrder.id.slice(-8).toUpperCase()}
                    date={new Date().toLocaleDateString("es-EC")}
                    restaurant={{
                        name: completedOrder.vendorName,
                        address: "Universidad Central del Ecuador",
                        city: "Quito, Ecuador",
                    }}
                    customer={{
                        name: user?.fullName || "Estudiante",
                        address: "UCE",
                    }}
                    items={invoiceItems}
                    paymentMethod={completedOrder.paymentMethod}
                    amountPaid={completedOrder.totalAmount / 100}
                    onSeguirPedido={handleSeguirPedido}
                />
            )}
        </>
    );

    if (isInline) {
        return (
            <Box bg="white" borderRadius="3xl" overflow="hidden" display="flex" flexDirection="column" w="full">
                {content}
            </Box>
        );
    }

    return (
        <>
            <Box
                position="fixed"
                inset={0}
                bg="blackAlpha.500"
                backdropFilter="blur(3px)"
                zIndex={998}
                onClick={handleClose}
            />
            <Box
                position="fixed"
                top={{ base: "60px", md: isFacturaView ? "30px" : "60px" }}
                bottom={{ base: "60px", md: isFacturaView ? "30px" : "60px" }}
                right={{ base: "4px", md: "24px" }}
                w={{ base: "calc(100% - 8px)", md: isFacturaView ? "640px" : "420px" }}
                bg="white"
                borderRadius="3xl"
                boxShadow="2xl"
                overflow="hidden"
                zIndex={999}
                display="flex"
                flexDirection="column"
                transition="width 0.25s ease, top 0.25s ease, bottom 0.25s ease"
            >
                {content}
            </Box>
        </>
    );
};
