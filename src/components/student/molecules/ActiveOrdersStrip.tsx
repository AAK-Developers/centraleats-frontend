import { Box, Flex, Text, Stack, Icon } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import {
    FaClock,
    FaCheckCircle,
    FaHourglassHalf,
    FaUtensils,
    FaBell,
    FaReceipt,
    FaStore,
    FaTicketAlt,
} from "react-icons/fa";
import { useStudentOrders, STATUS_LABELS } from "../../../hooks/useStudentOrders";

const slideInUp = keyframes`
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0);    }
`;

const ripple = keyframes`
    0%   { transform: scale(1);   opacity: 0.7; }
    100% { transform: scale(2.8); opacity: 0;   }
`;

const STATUS_ICONS: Record<string, React.ElementType> = {
    PAID: FaCheckCircle,
    PENDING: FaHourglassHalf,
    PENDING_PAYMENT: FaHourglassHalf,
    PREPARING: FaUtensils,
    READY: FaBell,
};

const STATUS_ACCENT: Record<string, string> = {
    PAID: "#30B2BC",
    PENDING: "#E65100",
    PENDING_PAYMENT: "#E65100",
    PREPARING: "#042E63",
    READY: "#22C55E",
};

const STATUS_PILL: Record<string, { bg: string; color: string; border: string }> = {
    PAID: { bg: "#E6F9F9", color: "#0E7C7C", border: "#A8E5E5" },
    PENDING: { bg: "#FFF3EC", color: "#C04A00", border: "#FBBF94" },
    PENDING_PAYMENT: { bg: "#FFF3EC", color: "#C04A00", border: "#FBBF94" },
    PREPARING: { bg: "#EEF2FB", color: "#042E63", border: "#B8C8E8" },
    READY: { bg: "#F0FDF4", color: "#166534", border: "#86EFAC" },
};

const getIcon = (s: string) => STATUS_ICONS[s] ?? FaReceipt;
const getAccent = (s: string) => STATUS_ACCENT[s] ?? "#A0AEC0";
const getPill = (s: string) => STATUS_PILL[s] ?? { bg: "#F3F4F6", color: "#374151", border: "#D1D5DB" };

export function ActiveOrdersStrip() {
    const { activeOrders, isInitialLoading } = useStudentOrders();

    if (isInitialLoading || activeOrders.length === 0) return null;

    return (
        <Box
            bg="white"
            borderRadius="2xl"
            border="1px solid"
            borderColor="#E2EAF4"
            boxShadow="0 4px 20px rgba(4,46,99,0.08)"
            overflow="hidden"
            mb={6}
        >
            <Box
                bg="linear-gradient(90deg, #2DC6B8 0%, #042E63 100%)"
                px={{ base: 4, md: 5 }}
                py={{ base: 3, md: 3.5 }}
            >
                <Flex align="center" gap={3}>
                    <Flex
                        w={{ base: "36px", md: "40px" }}
                        h={{ base: "36px", md: "40px" }}
                        bg="rgba(255,255,255,0.18)"
                        borderRadius="xl"
                        align="center"
                        justify="center"
                        flexShrink={0}
                        border="1px solid rgba(255,255,255,0.25)"
                    >
                        <Icon as={FaClock} color="white" boxSize={{ base: 3.5, md: 4 }} />
                    </Flex>
                    <Box>
                        <Text fontWeight="800" color="white" fontSize={{ base: "md", md: "lg" }} letterSpacing="-0.01em" lineHeight="1.2">
                            Mis pedidos activos
                        </Text>
                        <Text fontSize="sm" color="rgba(255,255,255,0.7)" mt="1px">
                            {activeOrders.length}{" "}
                            {activeOrders.length === 1 ? "pedido en curso" : "pedidos en curso"}
                        </Text>
                    </Box>
                    <Flex
                        ml="auto"
                        bg="rgba(255,255,255,0.2)"
                        border="1px solid rgba(255,255,255,0.3)"
                        borderRadius="full"
                        w="30px"
                        h="30px"
                        align="center"
                        justify="center"
                        flexShrink={0}
                    >
                        <Text color="white" fontWeight="800" fontSize="md" lineHeight="1">
                            {activeOrders.length}
                        </Text>
                    </Flex>
                </Flex>
            </Box>

            <Stack gap={0}>
                {activeOrders.map((order, idx) => {
                    const accent = getAccent(order.status);
                    const pill = getPill(order.status);
                    const StatusIcon = getIcon(order.status);
                    const isReady = order.status === "READY";
                    const isLast = idx === activeOrders.length - 1;

                    return (
                        <Box key={order.id}>
                            <Flex
                                align="center"
                                px={{ base: 4, md: 5 }}
                                py={{ base: 3, md: 3.5 }}
                                gap={{ base: 2, md: 3 }}
                                animation={`${slideInUp} 0.3s ease both`}
                                style={{ animationDelay: `${idx * 55}ms` }}
                                transition="background 0.15s ease"
                                _hover={{ bg: "#F8FAFD" }}
                                borderLeft="3px solid"
                                borderLeftColor={accent}
                                bg="white"
                                direction={{ base: "column", sm: "row" }}
                            >
                                <Box flex="1" minW="0">
                                    <Text
                                        fontSize={{ base: "md", md: "md" }}
                                        fontWeight="800"
                                        color="#042E63"
                                        letterSpacing="-0.01em"
                                        lineHeight="1.2"
                                        mb="5px"
                                    >
                                        Pedido{" "}
                                        <Box as="span" fontFamily="'Courier New', monospace" fontSize={{ base: "md", md: "lg" }}>
                                            #{order.id.slice(-6).toUpperCase()}
                                        </Box>
                                    </Text>

                                    {order.vendorName && (
                                        <Flex align="center" gap={1} display="inline-flex" bg="#F0F4FB" borderRadius="full" px={2} py="3px">
                                            <Icon as={FaStore} boxSize="10px" color="#6B7E9F" />
                                            <Text fontSize="sm" fontWeight="600" color="#6B7E9F">
                                                {order.vendorName}
                                            </Text>
                                        </Flex>
                                    )}
                                </Box>

                                <Box flex="1" display="flex" justifyContent="center" alignItems="center">
                                    {order.pickupCode ? (
                                        <Flex
                                            align="center"
                                            gap={2.5}
                                            bg="linear-gradient(135deg, #F0F7FF 0%, #E8F0FB 100%)"
                                            border="1.5px dashed #B0C4DE"
                                            borderRadius="xl"
                                            px={{ base: 3, md: 4 }}
                                            py={{ base: 2, md: 2.5 }}
                                        >
                                            <Icon as={FaTicketAlt} color="#30B2BC" boxSize={{ base: 4, md: 5 }} flexShrink={0} />
                                            <Box>
                                                <Text
                                                    fontSize="10px"
                                                    color="#8A9BBD"
                                                    fontWeight="700"
                                                    letterSpacing="0.1em"
                                                    textTransform="uppercase"
                                                    lineHeight="1"
                                                    mb="4px"
                                                >
                                                    Código de retiro
                                                </Text>
                                                <Text
                                                    fontSize={{ base: "xl", md: "2xl" }}
                                                    color="#042E63"
                                                    fontWeight="900"
                                                    letterSpacing="0.2em"
                                                    fontFamily="'Courier New', monospace"
                                                    lineHeight="1"
                                                >
                                                    {order.pickupCode}
                                                </Text>
                                            </Box>
                                        </Flex>
                                    ) : (
                                        <Box />
                                    )}
                                </Box>

                                <Box flex="1" display="flex" justifyContent="flex-end" alignItems="center">
                                    <Flex align="center" gap={2}>
                                        {isReady && (
                                            <Box position="relative" w="10px" h="10px" flexShrink={0}>
                                                <Box
                                                    position="absolute"
                                                    inset={0}
                                                    borderRadius="full"
                                                    bg="#22C55E"
                                                    animation={`${ripple} 1.6s ease-out infinite`}
                                                />
                                                <Box position="absolute" inset={0} borderRadius="full" bg="#22C55E" />
                                            </Box>
                                        )}
                                        <Flex
                                            align="center"
                                            gap={1.5}
                                            bg={pill.bg}
                                            color={pill.color}
                                            border="1px solid"
                                            borderColor={pill.border}
                                            borderRadius="full"
                                            px={{ base: 3, md: 4 }}
                                            py={{ base: 2, md: 2.5 }}
                                            fontSize="sm"
                                            fontWeight="700"
                                            letterSpacing="0.01em"
                                            whiteSpace="nowrap"
                                        >
                                            <Icon as={StatusIcon} boxSize={3.5} />
                                            {STATUS_LABELS[order.status]}
                                        </Flex>
                                    </Flex>
                                </Box>
                            </Flex>

                            {!isLast && (
                                <Box mx={4} h="1px" bg="linear-gradient(90deg, #E2EAF4 0%, transparent 100%)" />
                            )}
                        </Box>
                    );
                })}
            </Stack>
        </Box>
    );
}
