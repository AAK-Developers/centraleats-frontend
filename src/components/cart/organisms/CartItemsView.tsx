import { Box, Flex, Text, HStack, Icon, Badge, VStack } from "@chakra-ui/react";
import { HiBell, HiShoppingCart } from "react-icons/hi";
import { FaStore } from "react-icons/fa";

import { CartItem } from "../molecules/CartItem";
import { CartTotalBanner } from "../molecules/CartTotalBanner";
import { CartActionButton } from "../molecules/CartActionButton";
import { PaymentMethodSelector } from "../molecules/CartPaymentMethodSelector";
import type { PaymentMethod } from "../../../hooks/useCartCheckout";

interface CartLineItem {
    product: {
        id: string;
        name: string;
        description: string;
        price: number;
        imageUrl?: string;
    };
    quantity: number;
}

interface CartItemsViewProps {
    items: CartLineItem[];
    vendorName: string;
    subtotalDollars: number;
    paymentMethod: PaymentMethod;
    onPaymentMethodChange: (method: PaymentMethod) => void;
    onRemove: (id: string) => void;
    onIncrement: (id: string) => void;
    onDecrement: (id: string) => void;
    onAction: () => void;
}

export const CartItemsView = ({
    items,
    vendorName,
    subtotalDollars,
    paymentMethod,
    onPaymentMethodChange,
    onRemove,
    onIncrement,
    onDecrement,
    onAction,
}: CartItemsViewProps) => (
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
                        <Text fontSize="lg" color="#042E63" fontWeight="semibold">{vendorName}</Text>
                        <Badge colorScheme="blue" fontSize="md" borderRadius="full" ml="auto">
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
                                onRemove={onRemove}
                                onIncrement={(id) => onIncrement(id)}
                                onDecrement={(id) => onDecrement(id)}
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
                    <PaymentMethodSelector selected={paymentMethod} onChange={onPaymentMethodChange} />
                </Box>

                <Flex align="center" justify="center" gap={2} mb={4} px={2}>
                    <Icon as={HiBell} color="orange.400" boxSize={6} flexShrink={0} />
                    <Text fontSize="xs" color="gray.500" textAlign="center">
                        ¡Recibirás una notificación cuando la orden esté lista!
                    </Text>
                </Flex>

                <CartActionButton paymentMethod={paymentMethod} onClick={onAction} />
            </Box>
        )}
    </Box>
);
