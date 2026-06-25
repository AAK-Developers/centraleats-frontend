import { Box, VStack, Flex, Text, HStack, Icon } from "@chakra-ui/react";
import { useState } from "react";
import { HiBell, HiShoppingCart } from "react-icons/hi";

import { CloseButton } from "../atoms/CloseButton";
import { CartItem } from "../molecules/CartItem";
import { CartTotalBanner } from "../molecules/CartTotalBanner";
import { CartActionButton } from "../molecules/CartActionButton";
import { CardForm } from "../molecules/CardForm";
import { PaymentMethodSelector } from "../molecules/PaymentMethodSelector";
import { InvoicePanel, MOCK_INVOICE } from "./InvoicePanel";

interface CartItemData {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
}

interface CartPanelProps {
    isOpen: boolean;
    onClose: () => void;
    isInline?: boolean;
}

const MOCK_ITEMS: CartItemData[] = [
    { id: "1", name: "Almuerzo Ejecutivo", description: "Sopa, segundo, jugo del día", price: 2.9, quantity: 1 },
    { id: "2", name: "Almuerzo Ejecutivo", description: "Sopa, segundo, jugo del día", price: 2.9, quantity: 1 },
];

type PaymentMethod = "efectivo" | "tarjeta" | null;
type PanelView = "cart" | "card-form" | "factura";

export const CartPanel = ({ isOpen, onClose, isInline = false }: CartPanelProps) => {
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
    const [view, setView] = useState<PanelView>("cart");

    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCvv, setCardCvv] = useState("");
    const [error, setError] = useState("");

    if (!isOpen && !isInline) return null;

    const items = MOCK_ITEMS;
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // El panel nunca se desmonta (el padre solo alterna isOpen), así que hay
    // que resetear el estado interno manualmente al cerrar. Si no, la próxima
    // vez que se abra el carrito seguirá mostrando la última vista (factura).
    const handleClose = () => {
        setView("cart");
        setPaymentMethod(null);
        setCardNumber("");
        setCardName("");
        setCardExpiry("");
        setCardCvv("");
        setError("");
        onClose();
    };

    const handleAction = () => {
        if (paymentMethod === "tarjeta") {
            setView("card-form");
            return;
        }
        if (paymentMethod === "efectivo") {
            setView("factura");
        }
    };

    // Tamaño del panel flotante: la vista de factura necesita más espacio
    const isFacturaView = view === "factura";

    const content = (
        <>
            <Box position="relative" p={5} bg="#042E63" borderBottom="1px solid" borderColor="blue.900">
                <Flex justify="center" align="center">
                    <HStack gap={2}>
                        <Icon as={HiShoppingCart} boxSize={8} color="white" />
                        <Text fontWeight="bold" fontSize={{ base: "xl", md: "2xl" }} color="white">
                            {isFacturaView ? "Factura" : "Carrito"}
                        </Text>
                    </HStack>
                </Flex>

                {!isInline && (
                    <Box position="absolute" right={4} top="50%" transform="translateY(-50%)">
                        <CloseButton onClick={handleClose} />
                    </Box>
                )}
            </Box>

            {view === "cart" && (
                <Box flex={1} display="flex" flexDirection="column" overflow="hidden">
                    <Box flex={1} overflowY="auto" p={{ base: 3, md: 4 }}>
                        <VStack gap={3} align="stretch">
                            {items.map((item) => (
                                <CartItem
                                    key={item.id}
                                    {...item}
                                    onRemove={(id) => console.log("remove", id)}
                                />
                            ))}
                        </VStack>
                    </Box>

                    <Box p={{ base: 4, md: 5 }} borderTop="1px solid" borderColor="gray.100" bg="white">
                        <Flex justify="space-between" mb={3}>
                            <Text fontWeight="bold" fontSize="lg">Sub Total:</Text>
                            <Text fontWeight="bold" fontSize="lg">${subtotal.toFixed(2)}</Text>
                        </Flex>

                        <Box mb={4}>
                            <CartTotalBanner total={subtotal} />
                        </Box>

                        <Box mb={4}>
                            <PaymentMethodSelector
                                selected={paymentMethod}
                                onChange={setPaymentMethod}
                            />
                        </Box>

                        <Flex align="center" justify="center" gap={2} mb={5} px={2}>
                            <Icon as={HiBell} color="orange.400" boxSize={8} flexShrink={0} />
                            <Text fontSize="sm" color="gray.500" textAlign="center">
                                ¡Recibirás una notificación cuando la orden esté lista!
                            </Text>
                        </Flex>

                        <CartActionButton paymentMethod={paymentMethod} onClick={handleAction} />
                    </Box>
                </Box>
            )}

            {view === "card-form" && (
                <CardForm
                    cardNumber={cardNumber}
                    cardName={cardName}
                    cardExpiry={cardExpiry}
                    cardCvv={cardCvv}
                    subtotal={subtotal}
                    onCardNumberChange={setCardNumber}
                    onCardNameChange={setCardName}
                    onCardExpiryChange={setCardExpiry}
                    onCardCvvChange={setCardCvv}
                    onBack={() => setView("cart")}
                    onSubmit={() => {
                        if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
                            setError("Completa todos los campos de la tarjeta");
                            return;
                        }
                        if (cardNumber.length < 16) {
                            setError("Número de tarjeta inválido");
                            return;
                        }
                        if (cardCvv.length < 3) {
                            setError("CVV inválido");
                            return;
                        }
                        setError("");
                        setView("factura");
                    }}
                    error={error}
                />
            )}

            {view === "factura" && (
                <InvoicePanel
                    {...MOCK_INVOICE}
                    paymentMethod={paymentMethod === "tarjeta" ? "Tarjeta" : "Efectivo"}
                    onSeguirPedido={handleClose}
                />
            )}
        </>
    );

    if (isInline) {
        return (
            <Box
                bg="white"
                borderRadius="3xl"
                overflow="hidden"
                display="flex"
                flexDirection="column"
                w="full"
            >
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
                right={{ base: "4px", md: isFacturaView ? "24px" : "24px" }}
                w={{ base: "calc(100% - 8px)", md: isFacturaView ? "640px" : "400px" }}
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
