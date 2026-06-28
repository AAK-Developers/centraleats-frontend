import { Box, Flex, Text, Badge, Stack, HStack, Icon } from "@chakra-ui/react";
import {
    FaClock,
    FaCheckCircle,
    FaHourglassHalf,
    FaUtensils,
    FaBell,
    FaReceipt,
    FaStore,
} from "react-icons/fa";
import { useStudentOrders, STATUS_LABELS, STATUS_COLORS } from "../../../hooks/useStudentOrders";


const STATUS_ICONS: Record<string, React.ElementType> = {
    PAID: FaCheckCircle,
    PENDING: FaHourglassHalf,
    PENDING_PAYMENT: FaHourglassHalf,
    PREPARING: FaUtensils,
    READY: FaBell,
};

const STATUS_ACCENTS: Record<string, string> = {
    PAID: "#2DC6B8",
    PENDING: "#F97316",
    PENDING_PAYMENT: "#F97316",
    PREPARING: "#3182CE",
    READY: "#F97316",
};

const getStatusIcon = (status: string) => STATUS_ICONS[status] ?? FaReceipt;
const getStatusAccent = (status: string) => STATUS_ACCENTS[status] ?? "#A0AEC0";

export function ActiveOrdersStrip() {
    const { activeOrders, isLoading } = useStudentOrders();

    if (isLoading || activeOrders.length === 0) return null;

    return (
        <Box
            bg="white"
            border="1px solid"
            borderColor="blue.100"
            borderRadius="2xl"
            p={{ base: 4, md: 5 }}
            mb={6}
            boxShadow="sm"
        >
            <Flex align="center" gap={2.5} mb={4}>
                <Flex
                    w={{ base: "32px", md: "36px" }}
                    h={{ base: "32px", md: "36px" }}
                    bg="#042E63"
                    borderRadius="full"
                    align="center"
                    justify="center"
                    flexShrink={0}
                >
                    <Icon as={FaClock} color="white" boxSize={{ base: 3.5, md: 4 }} />
                </Flex>
                <Box>
                    <Text fontWeight="extrabold" color="#042E63" fontSize={{ base: "md", md: "lg" }} lineHeight="1.1">
                        Mis pedidos activos
                    </Text>
                    <Text fontSize={{ base: "xs", md: "sm" }} color="gray.400">
                        {activeOrders.length} {activeOrders.length === 1 ? "pedido en curso" : "pedidos en curso"}
                    </Text>
                </Box>
            </Flex>

            <Stack gap={3}>
                {activeOrders.map((order) => {
                    const accent = getStatusAccent(order.status);
                    const StatusIcon = getStatusIcon(order.status);
                    const isReady = order.status === "READY";

                    return (
                        <Flex
                            key={order.id}
                            position="relative"
                            align={{ base: "flex-start", sm: "center" }}
                            justify="space-between"
                            bg="gray.50"
                            borderRadius="xl"
                            pl={{ base: 4, md: 5 }}
                            pr={{ base: 3, md: 4 }}
                            py={{ base: 3, md: 3.5 }}
                            gap={3}
                            direction={{ base: "column", sm: "row" }}
                            borderLeft="4px solid"
                            borderLeftColor={accent}
                            transition="all 0.2s ease"
                            _hover={{ bg: "gray.100", transform: "translateY(-1px)", boxShadow: "sm" }}
                        >
                            <Box flex={1} minW="0" w="full">
                                <HStack gap={2} flexWrap="wrap" mb={1}>
                                    <Text
                                        fontSize={{ base: "sm", md: "md" }}
                                        fontWeight="extrabold"
                                        color="#042E63"
                                        lineClamp={1}
                                    >
                                        Pedido #{order.id.slice(-6).toUpperCase()}
                                    </Text>

                                    {order.vendorName && (
                                        <HStack gap={1} color="gray.500">
                                            <Icon as={FaStore} boxSize={2.5} />
                                            <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium" lineClamp={1}>
                                                {order.vendorName}
                                            </Text>
                                        </HStack>
                                    )}
                                </HStack>

                                {order.pickupCode && (
                                    <Flex
                                        align="center"
                                        gap={1.5}
                                        display="inline-flex"
                                        bg="white"
                                        border="1.5px dashed"
                                        borderColor="blue.200"
                                        borderRadius="lg"
                                        px={2.5}
                                        py={1}
                                    >
                                        <Icon as={FaReceipt} color="#042E63" boxSize={3} />
                                        <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500" fontWeight="medium">
                                            Código de retiro
                                        </Text>
                                        <Text fontSize={{ base: "sm", md: "md" }} color="#042E63" fontWeight="extrabold" letterSpacing="wide">
                                            {order.pickupCode}
                                        </Text>
                                    </Flex>
                                )}
                            </Box>

                            <Badge
                                colorScheme={STATUS_COLORS[order.status]}
                                borderRadius="full"
                                px={{ base: 3, md: 3.5 }}
                                py={{ base: 1.5, md: 2 }}
                                fontSize={{ base: "xs", md: "sm" }}
                                fontWeight="bold"
                                flexShrink={0}
                                display="flex"
                                alignItems="center"
                                gap={1.5}
                                animation={isReady ? "pulse 1.5s infinite" : undefined}
                                alignSelf={{ base: "flex-end", sm: "center" }}
                            >
                                <Icon as={StatusIcon} boxSize={{ base: 3, md: 3.5 }} />
                                {STATUS_LABELS[order.status]}
                            </Badge>
                        </Flex>
                    );
                })}
            </Stack>
        </Box>
    );
}
