import { Box, Flex, Text, Badge, Stack, HStack } from "@chakra-ui/react";
import { FaClock } from "react-icons/fa";
import { useStudentOrders, STATUS_LABELS, STATUS_COLORS } from "../../../hooks/useStudentOrders";

export function ActiveOrdersStrip() {
    const { activeOrders, isLoading } = useStudentOrders();

    if (isLoading || activeOrders.length === 0) return null;

    return (
        <Box
            bg="white"
            border="1px solid"
            borderColor="blue.100"
            borderRadius="2xl"
            p={{ base: 3, md: 4 }}
            mb={6}
            boxShadow="sm"
        >
            <Flex align="center" gap={2} mb={3}>
                <FaClock color="#042E63" />
                <Text fontWeight="bold" color="#042E63" fontSize={{ base: "sm", md: "md" }}>
                    Mis pedidos activos
                </Text>
            </Flex>

            <Stack gap={2}>
                {activeOrders.map((order) => (
                    <Flex
                        key={order.id}
                        align={{ base: "flex-start", sm: "center" }}
                        justify="space-between"
                        bg="gray.50"
                        borderRadius="xl"
                        px={{ base: 3, md: 4 }}
                        py={2}
                        gap={2}
                        direction={{ base: "column", sm: "row" }}
                    >
                        {/* Left: ID + vendor + pickup code */}
                        <HStack gap={2} flex={1} minW="0" flexWrap="wrap">
                            <Text
                                fontSize={{ base: "xs", md: "sm" }}
                                fontWeight="bold"
                                color="gray.700"
                                lineClamp={1}
                            >
                                Pedido #{order.id.slice(-6).toUpperCase()}
                            </Text>

                            {order.vendorName && (
                                <Text
                                    fontSize={{ base: "10px", md: "xs" }}
                                    color="gray.400"
                                    lineClamp={1}
                                    display={{ base: "none", sm: "block" }}
                                >
                                    — {order.vendorName}
                                </Text>
                            )}

                            {order.pickupCode && (
                                <Badge
                                    colorScheme="blue"
                                    variant="subtle"
                                    borderRadius="md"
                                    px={2}
                                    py={0.5}
                                    fontSize={{ base: "10px", md: "xs" }}
                                    fontWeight="extrabold"
                                >
                                    Código: {order.pickupCode}
                                </Badge>
                            )}
                        </HStack>

                        {/* Right: status badge */}
                        <Badge
                            colorScheme={STATUS_COLORS[order.status]}
                            borderRadius="full"
                            px={3}
                            py={1}
                            fontSize={{ base: "10px", md: "xs" }}
                            fontWeight="bold"
                            flexShrink={0}
                            animation={order.status === "READY" ? "pulse 1.5s infinite" : undefined}
                        >
                            {order.status === "READY" ? "🔔 " : ""}
                            {STATUS_LABELS[order.status]}
                        </Badge>
                    </Flex>
                ))}
            </Stack>
        </Box>
    );
}
