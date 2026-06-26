import {
    Box,
    Flex,
    Text,
    Badge,
    Stack,
    Button,
    Separator,
    VStack,
} from "@chakra-ui/react";
import type { VendorOrder } from "../types/vendor.types";
import { STATUS_BADGE } from "../types/vendor.types";

interface VendorOrderCardProps {
    order: VendorOrder;
    onAccept?: () => void;
    onStartCooking?: () => void;
    onReady?: () => void;
    onDeliver?: () => void;
}

export function VendorOrderCard({
    order,
    onAccept,
    onStartCooking,
    onReady,
    onDeliver,
}: VendorOrderCardProps) {
    const formattedDate = new Date(order.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
    const statusInfo = STATUS_BADGE[order.status] || { label: order.status, color: "gray" };

    return (
        <Box
            bg="white"
            borderRadius="2xl"
            p={{ base: 4, md: 5 }}
            border="1px solid"
            borderColor={order.status === "PENDING_PAYMENT" ? "orange.200" : "gray.100"}
            shadow="sm"
            display="flex"
            flexDirection="column"
            gap={4}
            transition="all 0.2s"
            _hover={{ shadow: "md" }}
        >
            {/* Header */}
            <Flex justify="space-between" align="center">
                <Text fontWeight="extrabold" color="#042E63" fontSize={{ base: "sm", md: "md" }}>
                    Pedido #{order.id.slice(-6).toUpperCase()}
                </Text>
                <Text fontSize="xs" color="gray.400">
                    {formattedDate}
                </Text>
            </Flex>

            {/* Status badge */}
            <Badge
                colorScheme={statusInfo.color}
                borderRadius="full"
                px={3}
                py={1}
                fontSize={{ base: "10px", md: "xs" }}
                alignSelf="flex-start"
            >
                {statusInfo.label}
            </Badge>

            <Separator />

            {/* Order details */}
            <VStack align="stretch" gap={2}>
                <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold" color="gray.700">
                    Cliente: {order.user?.fullName || "Estudiante"}
                </Text>

                <Box>
                    <Text fontSize="xs" color="gray.400" mb={1}>
                        Items:
                    </Text>
                    {order.items.map((item) => (
                        <Flex key={item.id} justify="space-between" align="center" pl={2}>
                            <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">
                                {item.quantity}x {item.productName}
                            </Text>
                        </Flex>
                    ))}
                </Box>

                {order.notes && (
                    <Box
                        bg="orange.50"
                        p={2}
                        borderRadius="lg"
                        borderLeft="3px solid"
                        borderColor="orange.300"
                    >
                        <Text fontSize="xs" color="orange.700" fontStyle="italic">
                            Nota: {order.notes}
                        </Text>
                    </Box>
                )}
            </VStack>

            <Separator />

            {/* Total */}
            <Flex justify="space-between" align="center">
                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500">
                    Total:
                </Text>
                <Text fontSize={{ base: "md", md: "lg" }} fontWeight="extrabold" color="#2DC6B8">
                    ${(order.totalAmount / 100).toFixed(2)}
                </Text>
            </Flex>

            {/* Actions */}
            <Stack gap={2} mt={2}>
                {onAccept && (
                    <Button
                        onClick={onAccept}
                        w="full"
                        size={{ base: "sm", md: "md" }}
                        bg="#2DC6B8"
                        color="white"
                        borderRadius="xl"
                        _hover={{ bg: "#25a89c" }}
                    >
                        ✅ Aceptar Pedido
                    </Button>
                )}
                {onStartCooking && (
                    <Button
                        onClick={onStartCooking}
                        w="full"
                        size={{ base: "sm", md: "md" }}
                        bg="#D69E2E"
                        color="white"
                        borderRadius="xl"
                        _hover={{ bg: "#B7791F" }}
                    >
                        🔥 Iniciar Preparación
                    </Button>
                )}
                {onReady && (
                    <Button
                        onClick={onReady}
                        w="full"
                        size={{ base: "sm", md: "md" }}
                        bg="orange.400"
                        color="white"
                        borderRadius="xl"
                        _hover={{ bg: "orange.500" }}
                    >
                        🔔 Marcar como Listo
                    </Button>
                )}
                {onDeliver && (
                    <Button
                        onClick={onDeliver}
                        w="full"
                        size={{ base: "sm", md: "md" }}
                        bg="blue.500"
                        color="white"
                        borderRadius="xl"
                        _hover={{ bg: "blue.600" }}
                    >
                        📦 Entregar Pedido
                    </Button>
                )}
            </Stack>
        </Box>
    );
}
