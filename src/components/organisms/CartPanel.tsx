import { Box, VStack, Flex, Text, HStack, Icon, Spinner, Badge, Button } from "@chakra-ui/react";
import { useState } from "react";
import { HiBell, HiShoppingCart, HiCheckCircle } from "react-icons/hi";
import { FaStore, FaReceipt } from "react-icons/fa";
import { MdWarning } from "react-icons/md";
import toast from "react-hot-toast";

import { CloseButton } from "../atoms/CloseButton";
import { CartItem } from "../molecules/CartItem";
import { CartTotalBanner } from "../molecules/CartTotalBanner";
import { CartActionButton } from "../molecules/CartActionButton";
import { CardForm } from "../molecules/CardForm";
import { PaymentMethodSelector } from "../molecules/PaymentMethodSelector";
import { InvoicePanel } from "./InvoicePanel";
import { useCartStore } from "../../store/cartStore";
import { apiClient } from "../../api/axiosConfig";
import { useUser } from "@clerk/clerk-react";
import type { InvoiceItemData } from "./InvoiceItemsTable";

interface CartPanelProps {
    isOpen: boolean;
    onClose: () => void;
    isInline?: boolean;
}

type PaymentMethod = "efectivo" | "tarjeta" | null;
type PanelView = "cart" | "confirm" | "card-form" | "factura";

interface CompletedOrder {
    id: string;
    totalAmount: number;
    vendorName: string;
    items: Array<{ productName: string; quantity: number; unitPrice: number }>;
    paymentMethod: string;
}

export const CartPanel = ({ isOpen, onClose, isInline = false }: CartPanelProps) => {
    const { user } = useUser();
    const { items, vendorId, vendorName, removeItem, updateQuantity, clearCart, totalAmount } = useCartStore();

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
    const [view, setView] = useState<PanelView>("cart");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);

    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCvv, setCardCvv] = useState("");
    const [cardError, setCardError] = useState("");

    if (!isOpen && !isInline) return null;

    const subtotalCents = totalAmount();
    const subtotalDollars = subtotalCents / 100;
    const isFacturaView = view === "factura";

    const resetCart = () => {
        setView("cart");
        setPaymentMethod(null);
        setCardNumber("");
        setCardName("");
        setCardExpiry("");
        setCardCvv("");
        setCardError("");
    };

    const handleClose = () => {
        resetCart();
        onClose();
    };

    // Submit order to backend
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

            if (isPaid) {
                await apiClient.patch(`/api/orders/${newOrder.id}/status`, {
                    status: "PAID",
                });
                // Show invoice for card payment
                setCompletedOrder({
                    id: newOrder.id,
                    totalAmount: subtotalCents,
                    vendorName,
                    items: items.map((i) => ({
                        productName: i.product.name,
                        quantity: i.quantity,
                        unitPrice: i.product.price / 100,
                    })),
                    paymentMethod: "Tarjeta",
                });
                clearCart();
                setView("factura");
                toast.success("¡Pedido pagado y enviado al restaurante!");
            } else {
                // Efectivo: close cart and prompt to check notifications
                clearCart();
                handleClose();
                toast.success(
                    () => (
                        <span>
                            <strong>¡Pedido enviado! 🍽️</strong><br />
                            Revisa el estado en <strong>🔔 Notificaciones</strong>.
                        </span>
                    ),
                    { duration: 6000 }
                );
            }
        } catch (err) {
            console.error("Error placing order:", err);
            toast.error("Error al procesar el pedido. Intenta de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // "Enviar pedido" button → go to confirm view
    const handleAction = () => {
        if (!paymentMethod) return;
        if (paymentMethod === "tarjeta") {
            setView("card-form");
            return;
        }
        // efectivo → show confirmation screen
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

    // Invoice items
    const invoiceItems: InvoiceItemData[] = completedOrder
        ? completedOrder.items.map((item, i) => ({
              code: String(i + 1),
              name: item.productName,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
          }))
        : [];

    // ─── Confirmation Screen ────────────────────────────────────────────────────
    const ConfirmView = () => (
        <Box flex={1} display="flex" flexDirection="column" overflow="hidden">
            <Box flex={1} overflowY="auto" p={5}>
                {/* Warning banner */}
                <Flex
                    align="center"
                    gap={3}
                    bg="orange.50"
                    border="1px solid"
                    borderColor="orange.200"
                    borderRadius="xl"
                    p={4}
                    mb={5}
                >
                    <Icon as={MdWarning} color="orange.400" boxSize={6} flexShrink={0} />
                    <Text fontSize="sm" color="orange.700" fontWeight="semibold">
                        ¿Confirmas enviar este pedido al restaurante?
                    </Text>
                </Flex>

                {/* Vendor */}
                <HStack bg="blue.50" borderRadius="xl" px={3} py={2} mb={4} gap={2}>
                    <Icon as={FaStore} color="#042E63" boxSize={3} />
                    <Text fontSize="sm" color="#042E63" fontWeight="bold">{vendorName}</Text>
                </HStack>

                {/* Items summary */}
                <Box mb={4}>
                    <Text fontSize="xs" color="gray.400" fontWeight="bold" mb={2} textTransform="uppercase" letterSpacing="wider">
                        Resumen del pedido
                    </Text>
                    <VStack gap={1} align="stretch">
                        {items.map((item) => (
                            <Flex key={item.product.id} justify="space-between" align="center" py={1}>
                                <Text fontSize="sm" color="gray.700">
                                    {item.quantity}× {item.product.name}
                                </Text>
                                <Text fontSize="sm" fontWeight="bold" color="#042E63">
                                    ${((item.product.price * item.quantity) / 100).toFixed(2)}
                                </Text>
                            </Flex>
                        ))}
                    </VStack>
                    <Box h="1px" bg="gray.100" my={3} />
                    <Flex justify="space-between" align="center">
                        <Text fontWeight="bold" color="gray.700">Total</Text>
                        <Text fontWeight="extrabold" fontSize="xl" color="#2DC6B8">
                            ${subtotalDollars.toFixed(2)}
                        </Text>
                    </Flex>
                </Box>

                {/* Payment method */}
                <Flex
                    align="center"
                    gap={2}
                    bg="gray.50"
                    borderRadius="xl"
                    px={3}
                    py={2}
                    mb={5}
                >
                    <Icon as={FaReceipt} color="gray.400" boxSize={3} />
                    <Text fontSize="sm" color="gray.600">
                        Método de pago: <strong>Efectivo al retirar</strong>
                    </Text>
                </Flex>

                {/* Notification note */}
                <Flex align="center" gap={2} px={1} mb={5}>
                    <Icon as={HiBell} color="orange.400" boxSize={5} flexShrink={0} />
                    <Text fontSize="xs" color="gray.500">
                        Recibirás una notificación cuando tu pedido esté listo.
                    </Text>
                </Flex>
            </Box>

            {/* Action buttons */}
            <Box p={5} borderTop="1px solid" borderColor="gray.100">
                {isSubmitting ? (
                    <Flex justify="center" py={3}>
                        <Spinner color="#2DC6B8" />
                    </Flex>
                ) : (
                    <VStack gap={3}>
                        <Button
                            w="full"
                            bg="#042E63"
                            color="white"
                            borderRadius="2xl"
                            py={6}
                            fontSize="md"
                            fontWeight="bold"
                            _hover={{ bg: "#031F44", transform: "translateY(-1px)", boxShadow: "lg" }}
                            transition="all 0.2s"
                            onClick={() => submitOrder(false)}
                        >
                            <HStack gap={2}>
                                <Icon as={HiCheckCircle} boxSize={5} />
                                <Text>Confirmar y Enviar Pedido</Text>
                            </HStack>
                        </Button>
                        <Button
                            w="full"
                            variant="ghost"
                            color="gray.500"
                            borderRadius="2xl"
                            onClick={() => setView("cart")}
                            _hover={{ bg: "gray.50" }}
                        >
                            ← Volver al carrito
                        </Button>
                    </VStack>
                )}
            </Box>
        </Box>
    );

    const content = (
        <>
            {/* Header */}
            <Box position="relative" p={5} bg="#042E63" borderBottom="1px solid" borderColor="blue.900">
                <Flex justify="center" align="center">
                    <HStack gap={2}>
                        <Icon as={HiShoppingCart} boxSize={8} color="white" />
                        <Text fontWeight="bold" fontSize={{ base: "xl", md: "2xl" }} color="white">
                            {isFacturaView ? "Factura" : view === "confirm" ? "Confirmar Pedido" : "Carrito"}
                        </Text>
                    </HStack>
                </Flex>
                {!isInline && (
                    <Box position="absolute" right={4} top="50%" transform="translateY(-50%)">
                        <CloseButton onClick={handleClose} />
                    </Box>
                )}
            </Box>

            {/* Cart View */}
            {view === "cart" && (
                <Box flex={1} display="flex" flexDirection="column" overflow="hidden">
                    <Box flex={1} overflowY="auto" p={{ base: 3, md: 4 }}>
                        {items.length === 0 ? (
                            <Flex direction="column" align="center" justify="center" py={12} gap={3}>
                                <Icon as={HiShoppingCart} boxSize={12} color="gray.200" />
                                <Text color="gray.400" fontSize="md" fontWeight="semibold">
                                    Tu carrito está vacío
                                </Text>
                                <Text color="gray.400" fontSize="sm" textAlign="center">
                                    Agrega platos desde el catálogo
                                </Text>
                            </Flex>
                        ) : (
                            <>
                                <HStack bg="blue.50" borderRadius="xl" px={3} py={2} mb={3} gap={2}>
                                    <Icon as={FaStore} color="#042E63" boxSize={3} />
                                    <Text fontSize="xs" color="#042E63" fontWeight="semibold">{vendorName}</Text>
                                    <Badge colorScheme="blue" fontSize="9px" borderRadius="full" ml="auto">
                                        {items.length} {items.length === 1 ? "plato" : "platos"}
                                    </Badge>
                                </HStack>

                                <VStack gap={0} align="stretch">
                                    {items.map((item) => (
                                        <CartItem
                                            key={item.product.id}
                                            id={item.product.id}
                                            name={item.product.name}
                                            description={item.product.description}
                                            price={item.product.price}
                                            quantity={item.quantity}
                                            imageUrl={item.product.imageUrl}
                                            onRemove={removeItem}
                                            onIncrement={(id) => updateQuantity(id, item.quantity + 1)}
                                            onDecrement={(id) => updateQuantity(id, item.quantity - 1)}
                                        />
                                    ))}
                                </VStack>
                            </>
                        )}
                    </Box>

                    {items.length > 0 && (
                        <Box p={{ base: 4, md: 5 }} borderTop="1px solid" borderColor="gray.100" bg="white">
                            <Flex justify="space-between" mb={3}>
                                <Text fontWeight="bold" fontSize="lg">Sub Total:</Text>
                                <Text fontWeight="bold" fontSize="lg">${subtotalDollars.toFixed(2)}</Text>
                            </Flex>

                            <Box mb={4}>
                                <CartTotalBanner total={subtotalDollars} />
                            </Box>

                            <Box mb={4}>
                                <PaymentMethodSelector selected={paymentMethod} onChange={setPaymentMethod} />
                            </Box>

                            <Flex align="center" justify="center" gap={2} mb={4} px={2}>
                                <Icon as={HiBell} color="orange.400" boxSize={6} flexShrink={0} />
                                <Text fontSize="xs" color="gray.500" textAlign="center">
                                    ¡Recibirás una notificación cuando la orden esté lista!
                                </Text>
                            </Flex>

                            <CartActionButton paymentMethod={paymentMethod} onClick={handleAction} />
                        </Box>
                    )}
                </Box>
            )}

            {/* Confirmation View */}
            {view === "confirm" && <ConfirmView />}

            {/* Card Form View */}
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
                    error={cardError}
                />
            )}

            {/* Invoice View */}
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
                    onSeguirPedido={handleClose}
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
