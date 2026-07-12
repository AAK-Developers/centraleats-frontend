import {
    Box,
    Flex,
    Text,
    Badge,
    VStack,
    Icon,
    HStack,
    Stack,
} from "@chakra-ui/react";
import {
    FaCheckCircle,
    FaFire,
    FaBell,
    FaBoxOpen,
    FaUser,
    FaClock,
    FaReceipt,
} from "react-icons/fa";
import type { VendorOrder } from "../types/vendor.types";
import { STATUS_BADGE } from "../types/vendor.types";

interface VendorOrderCardProps {
    order: VendorOrder;
    onAccept?: () => void;
    onStartCooking?: () => void;
    onReady?: () => void;
    onDeliver?: () => void;
}


interface ActionButtonProps {
    onClick: () => void;
    label: string;
    icon: React.ElementType;
    gradient: string;
    iconColor: string;
    shadow: string;
    shadowHover: string;
}

function ActionButton({ onClick, label, icon, gradient, iconColor, shadow, shadowHover }: ActionButtonProps) {
    return (
        <Flex
            as="button"
            onClick={onClick}
            align="center"
            justify="space-between"
            bg={gradient}
            borderRadius="full"
            pl={5}
            pr={2}
            py={2.5}
            w="full"
            boxShadow={shadow}
            transition="all 0.2s"
            _hover={{ boxShadow: shadowHover, transform: "translateY(-1px)" }}
            _active={{ transform: "scale(0.98)" }}
            cursor="pointer"
        >
            <Text fontSize="sm" fontWeight="bold" color="white">
                {label}
            </Text>
            <Flex
                w="28px" h="28px"
                bg="white"
                borderRadius="full"
                align="center"
                justify="center"
                boxShadow="sm"
                flexShrink={0}
            >
                <Icon as={icon} boxSize={3.5} color={iconColor} />
            </Flex>
        </Flex>
    );
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
    const isPending = order.status === "PENDING_PAYMENT";

    return (
        <Box
            bg="white"
            borderRadius="2xl"
            overflow="hidden"
            border="1px solid"
            borderColor={isPending ? "orange.200" : "gray.100"}
            boxShadow="0 4px 16px rgba(4,46,99,0.06)"
            transition="all 0.25s ease"
            _hover={{ boxShadow: "0 10px 28px rgba(4,46,99,0.12)", transform: "translateY(-2px)" }}
            position="relative"
        >
            <Box
                h="5px"
                w="full"
                bg={
                    isPending
                        ? "linear-gradient(90deg, #F97316 0%, #FB923C 100%)"
                        : "linear-gradient(90deg, #2DC6B8 0%, #042E63 100%)"
                }
            />

            <Box p={{ base: 4, md: 5 }} display="flex" flexDirection="column" gap={4}>
                <Flex justify="space-between" align="flex-start">
                    <HStack gap={2}>
                        <Flex
                            w="34px" h="34px"
                            borderRadius="lg"
                            bg="#F0FBFC"
                            align="center"
                            justify="center"
                            flexShrink={0}
                        >
                            <Icon as={FaReceipt} color="#2DC6B8" boxSize={4} />
                        </Flex>
                        <Box>
                            <Text fontWeight="extrabold" color="#042E63" fontSize={{ base: "sm", md: "md" }} lineHeight="1.2">
                                Pedido #{order.id.slice(-6).toUpperCase()}
                            </Text>
                            <HStack gap={1} color="gray.400" mt={0.5}>
                                <Icon as={FaClock} boxSize={2.5} />
                                <Text fontSize="xs">{formattedDate}</Text>
                            </HStack>
                        </Box>
                    </HStack>

                    <Badge
                        colorScheme={statusInfo.color}
                        borderRadius="full"
                        px={3} py={1}
                        fontSize={{ base: "10px", md: "xs" }}
                        fontWeight="bold"
                    >
                        {statusInfo.label}
                    </Badge>
                </Flex>

                <Box bg="gray.50" borderRadius="xl" p={3.5}>
                    <HStack gap={1.5} mb={2.5}>
                        <Icon as={FaUser} color="#042E63" boxSize={3} />
                        <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold" color="#042E63">
                            {order.user?.fullName || "Estudiante"}
                        </Text>
                    </HStack>

                    <VStack align="stretch" gap={1.5}>
                        {order.items.map((item) => (
                            <Flex key={item.id} justify="space-between" align="center">
                                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">
                                    <Text as="span" fontWeight="bold" color="gray.700">{item.quantity}×</Text>{" "}
                                    {item.productName}
                                </Text>
                            </Flex>
                        ))}
                    </VStack>

                    {order.notes && (
                        <Box
                            bg="orange.50" p={2} borderRadius="lg"
                            borderLeft="3px solid" borderColor="orange.300" mt={2.5}
                        >
                            <Text fontSize="xs" color="orange.700" fontStyle="italic">
                                Nota: {order.notes}
                            </Text>
                        </Box>
                    )}
                </Box>

                <Flex
                    justify="space-between"
                    align="center"
                    bg="linear-gradient(135deg, #042E63 0%, #0a3d7a 100%)"
                    borderRadius="xl"
                    px={4} py={3}
                >
                    <Text fontSize={{ base: "xs", md: "sm" }} color="white" fontWeight="medium">
                        Total del pedido
                    </Text>
                    <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="extrabold" color="white">
                        ${(order.totalAmount / 100).toFixed(2)}
                    </Text>
                </Flex>

                <Stack gap={2}>
                    {onAccept && (
                        <ActionButton
                            onClick={onAccept}
                            label="Aceptar Pedido"
                            icon={FaCheckCircle}
                            gradient="linear-gradient(135deg, #2DC6B8 0%, #1fa89c 100%)"
                            iconColor="#2DC6B8"
                            shadow="0 4px 14px rgba(45,198,184,0.35)"
                            shadowHover="0 6px 20px rgba(45,198,184,0.5)"
                        />
                    )}
                    {onStartCooking && (
                        <ActionButton
                            onClick={onStartCooking}
                            label="Iniciar Preparación"
                            icon={FaFire}
                            gradient="linear-gradient(135deg, #D69E2E 0%, #B7791F 100%)"
                            iconColor="#D69E2E"
                            shadow="0 4px 14px rgba(214,158,46,0.35)"
                            shadowHover="0 6px 20px rgba(214,158,46,0.5)"
                        />
                    )}
                    {onReady && (
                        <ActionButton
                            onClick={onReady}
                            label="Marcar como Listo"
                            icon={FaBell}
                            gradient="linear-gradient(135deg, #ED8936 0%, #DD6B20 100%)"
                            iconColor="#ED8936"
                            shadow="0 4px 14px rgba(237,137,54,0.35)"
                            shadowHover="0 6px 20px rgba(237,137,54,0.5)"
                        />
                    )}
                    {onDeliver && (
                        <ActionButton
                            onClick={onDeliver}
                            label="Entregar Pedido"
                            icon={FaBoxOpen}
                            gradient="linear-gradient(135deg, #4299E1 0%, #2B6CB0 100%)"
                            iconColor="#4299E1"
                            shadow="0 4px 14px rgba(66,153,225,0.35)"
                            shadowHover="0 6px 20px rgba(66,153,225,0.5)"
                        />
                    )}
                </Stack>
            </Box>
        </Box>
    );
}
