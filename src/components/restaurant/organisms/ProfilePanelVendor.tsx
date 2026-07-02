import {
    Box, VStack, Heading, Flex, Text, Badge, HStack, Icon,
} from "@chakra-ui/react";
import { useUser } from "@clerk/clerk-react";
import { CloseButton } from "../../cart/atoms/CloseButton";
import { UserProfileHeader } from "../../shared/molecules/UserProfileHeader";
import { LogoutButton } from "../../shared/atoms/LogoutButton";
import { useVendorOrders } from "../../../hooks/useVendorOrders";
import { useVendorRestaurant } from "../../../hooks/useVendorRestaurant";
import {
    FaStore, FaClock, FaCheckCircle, FaDollarSign, FaReceipt,
} from "react-icons/fa";
import { HiStatusOnline, HiStatusOffline } from "react-icons/hi";

interface ProfilePanelVendorProps {
    isOpen: boolean;
    onClose: () => void;
    restaurantId?: string;
    vendorIsOpen?: boolean;
}

interface StatRowProps {
    icon: React.ElementType;
    label: string;
    value: string;
    iconBg: string;
    iconColor: string;
    isLast?: boolean;
}

function StatRow({ icon, label, value, iconBg, iconColor, isLast = false }: StatRowProps) {
    return (
        <Box>
            <Flex align="center" justify="space-between" py={2.5}>
                <HStack gap={3}>
                    <Flex
                        w="34px" h="34px"
                        borderRadius="xl"
                        bg={iconBg}
                        align="center"
                        justify="center"
                        flexShrink={0}
                    >
                        <Icon as={icon} boxSize={3.5} color={iconColor} />
                    </Flex>
                    <Text fontSize="sm" color="gray.600" fontWeight="medium">{label}</Text>
                </HStack>
                <Text fontSize="sm" fontWeight="extrabold" color="#042E63">{value}</Text>
            </Flex>
            {!isLast && <Box h="1px" bg="gray.50" />}
        </Box>
    );
}

export const ProfilePanelVendor = ({
    isOpen,
    onClose,
    restaurantId,
    vendorIsOpen = false,
}: ProfilePanelVendorProps) => {
    const { user, isLoaded } = useUser();
    const { restaurant } = useVendorRestaurant();
    const { nuevos, enCocina, listos, completedOrders } = useVendorOrders(restaurantId);

    if (!isOpen) return null;

    const completedToday = completedOrders;
    const totalRevenue = completedToday.reduce((acc, o) => acc + o.totalAmount, 0) / 100;
    const avgTicket = completedToday.length > 0 ? totalRevenue / completedToday.length : 0;

    const openingTime = restaurant?.openingTime || "--:--";
    const closingTime = restaurant?.closingTime || "--:--";

    const formatTime = (t: string) => {
        if (!t || t === "--:--") return t;
        const [h, m] = t.split(":").map(Number);
        const ampm = h >= 12 ? "PM" : "AM";
        const h12 = h % 12 || 12;
        return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
    };

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
                top={{ base: "40px", md: "60px" }}
                bottom={{ base: "40px", md: "60px" }}
                right={{ base: "4px", md: "24px" }}
                w={{ base: "calc(100% - 8px)", md: "380px", lg: "400px" }}
                bg="white"
                borderRadius="3xl"
                boxShadow="0 24px 60px rgba(4,46,99,0.18)"
                overflow="hidden"
                zIndex={999}
                display="flex"
                flexDirection="column"
            >
                <Box
                    bg="linear-gradient(135deg, #042E63 0%, #0a4a9e 60%, #2DC6B8 100%)"
                    px={{ base: 5, md: 6 }}
                    pt={{ base: 4, md: 5 }}
                    pb={{ base: 4, md: 5 }}
                    flexShrink={0}
                >
                    <Flex align="center" justify="space-between" mb={4}>
                        <Heading size="md" color="white">Mi Perfil</Heading>
                        <CloseButton onClick={onClose} />
                    </Flex>

                    {isLoaded && (
                        <UserProfileHeader
                            imageUrl={user?.imageUrl}
                            fullName={user?.fullName || "Usuario"}
                            email={user?.primaryEmailAddress?.emailAddress || ""}
                            nameColor="white"
                            emailColor="whiteAlpha.700"
                            layout="horizontal"
                            avatarSize={100}
                        />
                    )}
                </Box>

                <Box
                    flex={1}
                    overflowY="auto"
                    px={{ base: 4, md: 5 }}
                    pt={5}
                    pb={4}
                    bg="white"
                >
                    <VStack gap={5} align="stretch">

                        <Box
                            bg="gray.50"
                            borderRadius="2xl"
                            p={4}
                            border="1px solid"
                            borderColor="gray.100"
                        >
                            <HStack gap={2} mb={3}>
                                <Box w="3px" h="16px" bg="#2DC6B8" borderRadius="full" />
                                <Heading size="xs" color="#042E63" textTransform="uppercase" letterSpacing="wider">
                                    Restaurante
                                </Heading>
                            </HStack>

                            <HStack justify="space-between" align="flex-start" gap={3}>
                                <HStack gap={3} flex={1} minW={0}>
                                    <Flex
                                        w="40px" h="40px"
                                        borderRadius="xl"
                                        bg="white"
                                        align="center"
                                        justify="center"
                                        boxShadow="sm"
                                        border="1px solid"
                                        borderColor="gray.100"
                                        flexShrink={0}
                                    >
                                        <Icon as={FaStore} color="#2DC6B8" boxSize={4} />
                                    </Flex>
                                    <Box minW={0}>
                                        <Text fontWeight="bold" color="#042E63" fontSize="md" lineClamp={1}>
                                            {restaurant?.name || "Mi Restaurante"}
                                        </Text>
                                        <HStack gap={1} mt={0.5}>
                                            <Icon as={FaClock} color="gray.400" boxSize={3} />
                                            <Text fontSize="xs" color="gray.500">
                                                {formatTime(openingTime)} – {formatTime(closingTime)}
                                            </Text>
                                        </HStack>
                                    </Box>
                                </HStack>

                                <Flex
                                    align="center"
                                    gap={1.5}
                                    bg={vendorIsOpen ? "green.50" : "red.50"}
                                    border="1px solid"
                                    borderColor={vendorIsOpen ? "green.200" : "red.200"}
                                    borderRadius="full"
                                    px={2.5}
                                    py={1}
                                    flexShrink={0}
                                >
                                    <Icon
                                        as={vendorIsOpen ? HiStatusOnline : HiStatusOffline}
                                        boxSize={3}
                                        color={vendorIsOpen ? "green.500" : "red.400"}
                                    />
                                    <Text
                                        fontSize="14px"
                                        fontWeight="bold"
                                        color={vendorIsOpen ? "green.600" : "red.500"}
                                    >
                                        {vendorIsOpen ? "Abierto" : "Cerrado"}
                                    </Text>
                                </Flex>
                            </HStack>
                        </Box>

                        <Box
                            bg="white"
                            borderRadius="2xl"
                            p={4}
                            border="1px solid"
                            borderColor="gray.100"
                            boxShadow="0 2px 8px rgba(4,46,99,0.05)"
                        >
                            <HStack gap={2} mb={1}>
                                <Box w="3px" h="16px" bg="#042E63" borderRadius="full" />
                                <Heading size="md" color="#042E63" textTransform="uppercase" letterSpacing="wider">
                                    Resumen del día
                                </Heading>
                            </HStack>

                            {completedToday.length === 0 ? (
                                <Box
                                    bg="gray.50"
                                    borderRadius="xl"
                                    p={4}
                                    textAlign="center"
                                    border="1px dashed"
                                    borderColor="gray.200"
                                    mt={3}
                                >
                                    <Text fontSize="md" color="gray.400">
                                        Aún no hay pedidos completados hoy
                                    </Text>
                                </Box>
                            ) : (
                                <VStack align="stretch" gap={0} mt={1}>
                                    <StatRow
                                        icon={FaCheckCircle}
                                        label="Pedidos completados"
                                        value={String(completedToday.length)}
                                        iconBg="green.50"
                                        iconColor="green.500"
                                    />
                                    <StatRow
                                        icon={FaDollarSign}
                                        label="Ingresos del día"
                                        value={`$${totalRevenue.toFixed(2)}`}
                                        iconBg="teal.50"
                                        iconColor="#2DC6B8"
                                    />
                                    <StatRow
                                        icon={FaReceipt}
                                        label="Ticket promedio"
                                        value={`$${avgTicket.toFixed(2)}`}
                                        iconBg="blue.50"
                                        iconColor="#042E63"
                                        isLast
                                    />
                                </VStack>
                            )}
                        </Box>

                        {(nuevos.length + enCocina.length + listos.length) > 0 && (
                            <Flex gap={2} flexWrap="wrap">
                                {nuevos.length > 0 && (
                                    <Badge colorScheme="orange" borderRadius="full" px={3} py={1} fontSize="md" fontWeight="bold">
                                        {nuevos.length} nuevo{nuevos.length !== 1 ? "s" : ""}
                                    </Badge>
                                )}
                                {enCocina.length > 0 && (
                                    <Badge colorScheme="yellow" borderRadius="full" px={3} py={1} fontSize="md" fontWeight="bold">
                                        {enCocina.length} en cocina
                                    </Badge>
                                )}
                                {listos.length > 0 && (
                                    <Badge colorScheme="teal" borderRadius="full" px={3} py={1} fontSize="md" fontWeight="bold">
                                        {listos.length} listo{listos.length !== 1 ? "s" : ""}
                                    </Badge>
                                )}
                            </Flex>
                        )}

                        <Flex pt={1} justify="center" w="full">
                            <LogoutButton />
                        </Flex>
                    </VStack>
                </Box>
            </Box>
        </>
    );
};
