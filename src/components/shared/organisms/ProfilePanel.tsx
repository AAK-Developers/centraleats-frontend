import { Box, VStack, Heading, Flex, Text, Badge, Spinner, HStack } from "@chakra-ui/react";
import { useUser } from "@clerk/clerk-react";

import { useStudentOrders, STATUS_LABELS, STATUS_COLORS } from "../../../hooks/useStudentOrders";
import { FaClock, FaCheckCircle } from "react-icons/fa";
import { UserProfileHeader } from "../molecules/UserProfileHeader";
import { CloseButton } from "../../cart/atoms/CloseButton";
import { LogoutButton } from "../atoms/LogoutButton";

interface ProfilePanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ProfilePanel = ({ isOpen, onClose }: ProfilePanelProps) => {
    const { user, isLoaded } = useUser();
    const { activeOrders, orders, isLoading } = useStudentOrders();

    if (!isOpen) return null;

    const completedOrders = orders.filter(
        (o) => o.status === "COMPLETED" || o.status === "PICKED_UP"
    ).slice(0, 5);

    return (
        <>
            <Box
                position="fixed"
                inset={0}
                bg="blackAlpha.400"
                backdropFilter="blur(2px)"
                zIndex={998}
                onClick={onClose}
            />

            <Box
                position="fixed"
                top={{ base: "60px", md: "60px" }}
                bottom={{ base: "60px", md: "60px" }}
                right={{ base: "4px", md: "24px" }}
                w={{ base: "calc(100% - 8px)", md: "420px" }}
                bg="white"
                borderRadius="3xl"
                boxShadow="2xl"
                overflow="hidden"
                zIndex={999}
                display="flex"
                flexDirection="column"
            >
                <Flex align="center" justify="space-between" p={6} borderBottom="1px solid" borderColor="gray.100" flexShrink={0}>
                    <Heading size="md" color="#042E63">Mi Perfil</Heading>
                    <CloseButton onClick={onClose} />
                </Flex>

                <Box p={6} overflowY="auto" flex={1}>
                    {isLoaded && (
                        <VStack gap={6} align="stretch">
                            <UserProfileHeader
                                imageUrl={user?.imageUrl}
                                fullName={user?.fullName || "Usuario"}
                                email={user?.primaryEmailAddress?.emailAddress || ""}
                            />

                            {/* Active Orders Section */}
                            <Box>
                                <HStack gap={2} mb={3}>
                                    <FaClock color="#042E63" />
                                    <Heading size="sm" color="#042E63">Pedidos Activos</Heading>
                                    {activeOrders.length > 0 && (
                                        <Badge colorScheme="orange" borderRadius="full" fontSize="10px">
                                            {activeOrders.length}
                                        </Badge>
                                    )}
                                </HStack>

                                {isLoading ? (
                                    <Flex justify="center" py={4}>
                                        <Spinner size="sm" color="#2DC6B8" />
                                    </Flex>
                                ) : activeOrders.length === 0 ? (
                                    <Box
                                        bg="gray.50"
                                        borderRadius="xl"
                                        p={4}
                                        textAlign="center"
                                    >
                                        <Text fontSize="sm" color="gray.400">
                                            Sin pedidos activos en este momento
                                        </Text>
                                    </Box>
                                ) : (
                                    <VStack gap={2} align="stretch">
                                        {activeOrders.map((order) => (
                                            <Box
                                                key={order.id}
                                                bg={order.status === "READY" ? "green.50" : "gray.50"}
                                                border="1px solid"
                                                borderColor={order.status === "READY" ? "green.200" : "gray.100"}
                                                borderRadius="xl"
                                                p={3}
                                                transition="all 0.3s"
                                            >
                                                <Flex justify="space-between" align="center" mb={1}>
                                                    <Text fontSize="sm" fontWeight="bold" color="#042E63">
                                                        Pedido #{order.id.slice(-6).toUpperCase()}
                                                    </Text>
                                                    <Text fontSize="xs" color="gray.400">
                                                        ${(order.totalAmount / 100).toFixed(2)}
                                                    </Text>
                                                </Flex>
                                                {order.vendorName && (
                                                    <Text fontSize="xs" color="gray.500" mb={1}>
                                                        {order.vendorName}
                                                    </Text>
                                                )}
                                                <Text fontSize="xs" color="gray.400" mb={2} lineClamp={1}>
                                                    {order.items.map(i => `${i.quantity}× ${i.productName}`).join(", ")}
                                                </Text>
                                                <Badge
                                                    colorScheme={STATUS_COLORS[order.status]}
                                                    borderRadius="full"
                                                    fontSize="xs"
                                                    px={2}
                                                    py={0.5}
                                                >
                                                    {order.status === "READY" ? "🔔 " : ""}
                                                    {STATUS_LABELS[order.status]}
                                                </Badge>
                                                {order.pickupCode && (
                                                    <Badge
                                                        colorScheme="blue"
                                                        variant="subtle"
                                                        borderRadius="full"
                                                        fontSize="xs"
                                                        px={2}
                                                        py={0.5}
                                                        ml={2}
                                                    >
                                                        Código: {order.pickupCode}
                                                    </Badge>
                                                )}
                                            </Box>
                                        ))}
                                    </VStack>
                                )}
                            </Box>

                            {/* Completed Orders History */}
                            {completedOrders.length > 0 && (
                                <Box>
                                    <HStack gap={2} mb={3}>
                                        <FaCheckCircle color="#2DC6B8" />
                                        <Heading size="sm" color="#042E63">Últimos pedidos</Heading>
                                    </HStack>
                                    <VStack gap={2} align="stretch">
                                        {completedOrders.map((order) => (
                                            <Flex
                                                key={order.id}
                                                align="center"
                                                justify="space-between"
                                                bg="gray.50"
                                                borderRadius="xl"
                                                px={3}
                                                py={2}
                                            >
                                                <Box>
                                                    <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                                                        #{order.id.slice(-6).toUpperCase()}
                                                    </Text>
                                                    <Text fontSize="xs" color="gray.400">
                                                        {order.vendorName || "Restaurante"}
                                                    </Text>
                                                </Box>
                                                <Box textAlign="right">
                                                    <Text fontSize="sm" fontWeight="bold" color="#2DC6B8">
                                                        ${(order.totalAmount / 100).toFixed(2)}
                                                    </Text>
                                                    <Badge colorScheme="gray" fontSize="9px" borderRadius="full">
                                                        {STATUS_LABELS[order.status]}
                                                    </Badge>
                                                </Box>
                                            </Flex>
                                        ))}
                                    </VStack>
                                </Box>
                            )}

                            <Flex pt={2} justify="center" w="full">
                                <LogoutButton />
                            </Flex>
                        </VStack>
                    )}
                </Box>
            </Box>
        </>
    );
};