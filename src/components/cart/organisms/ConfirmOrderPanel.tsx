import { Box, VStack, Flex, Text, HStack, Icon, Spinner, Button } from "@chakra-ui/react";
import { HiBell, HiCheckCircle, HiArrowLeft } from "react-icons/hi";
import { FaStore, FaReceipt } from "react-icons/fa";
import { MdWarning } from "react-icons/md";

interface CartLineItem {
    product: {
        id: string;
        name: string;
        price: number;
    };
    quantity: number;
}

interface ConfirmOrderPanelProps {
    vendorName: string;
    items: CartLineItem[];
    subtotalDollars: number;
    isSubmitting: boolean;
    onConfirm: () => void;
    onBack: () => void;
}

export const ConfirmOrderPanel = ({
    vendorName,
    items,
    subtotalDollars,
    isSubmitting,
    onConfirm,
    onBack,
}: ConfirmOrderPanelProps) => (
    <Box flex={1} display="flex" flexDirection="column" overflow="hidden">
        <Box flex={1} overflowY="auto" p={5}>
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

            <HStack bg="blue.50" borderRadius="xl" px={3} py={2} mb={4} gap={2}>
                <Icon as={FaStore} color="#042E63" boxSize={3} />
                <Text fontSize="lg" color="#042E63" fontWeight="bold">{vendorName}</Text>
            </HStack>

            <Box mb={4}>
                <Text fontSize="xs" color="gray.400" fontWeight="bold" mb={2} textTransform="uppercase" letterSpacing="wider">
                    Resumen del pedido
                </Text>
                <VStack gap={1} align="stretch">
                    {items.map((item) => (
                        <Flex key={item.product.id} justify="space-between" align="center" py={1}>
                            <Text fontSize="md" color="gray.700">
                                {item.quantity}× {item.product.name}
                            </Text>
                            <Text fontSize="md" fontWeight="bold" color="#042E63">
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

            <Flex align="center" gap={2} bg="gray.50" borderRadius="xl" px={3} py={2} mb={5}>
                <Icon as={FaReceipt} color="gray.400" boxSize={3} />
                <Text fontSize="md" color="gray.600">
                    Método de pago: <strong>Efectivo al retirar</strong>
                </Text>
            </Flex>

            <Flex align="center" gap={2} px={1} mb={5}>
                <Icon as={HiBell} color="orange.400" boxSize={5} flexShrink={0} />
                <Text fontSize="xs" color="gray.500">
                    Recibirás notificaciones sobre el estado de tu pedido.
                </Text>
            </Flex>
        </Box>

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
                        onClick={onConfirm}
                    >
                        <HStack gap={2}>
                            <Icon as={HiCheckCircle} boxSize={5} />
                            <Text>Confirmar y Enviar Pedido</Text>
                        </HStack>
                    </Button>
                    <Button
                        w="full"
                        variant="ghost"
                        color="gray.600"
                        borderRadius="2xl"
                        py={6}
                        fontSize="md"
                        fontWeight="medium"
                        onClick={onBack}
                        _hover={{ bg: "#c5c3c3", color: "#031F44" }}
                        transition="all 0.2s"
                    >
                        <HStack gap={2}>
                            <Icon as={HiArrowLeft} boxSize={5} />
                            <Text>Volver al carrito</Text>
                        </HStack>
                    </Button>
                </VStack>
            )}
        </Box>
    </Box>
);
