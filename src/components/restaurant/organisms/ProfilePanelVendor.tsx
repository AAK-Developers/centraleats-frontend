import { Box, VStack, Heading, Flex, Text, Badge, HStack, Icon, SimpleGrid } from "@chakra-ui/react";
import { useUser } from "@clerk/clerk-react";
import { CloseButton } from "../../cart/atoms/CloseButton";
import { UserProfileHeader } from "../../shared/molecules/UserProfileHeader";
import { LogoutButton } from "../../shared/atoms/LogoutButton";
import { useVendorOrders } from "../../../hooks/useVendorOrders";
import { FaFire, FaBell, FaCreditCard, FaMoneyBillWave, FaClipboardList } from "react-icons/fa";

interface ProfilePanelVendorProps {
    isOpen: boolean;
    onClose: () => void;
    restaurantId?: string;
}

interface StatCardProps {
    icon: React.ElementType;
    label: string;
    count: number;
    bg: string;
    iconColor: string;
    badgeColor: string;
}

function StatCard({ icon, label, count, bg, iconColor, badgeColor }: StatCardProps) {
    return (
        <Flex
            direction="column"
            align="center"
            justify="center"
            bg={bg}
            borderRadius="2xl"
            p={4}
            gap={2}
            position="relative"
            border="1px solid"
            borderColor="gray.100"
            minH="90px"
        >
            {count > 0 && (
                <Badge
                    position="absolute"
                    top={2}
                    right={2}
                    colorScheme={badgeColor}
                    borderRadius="full"
                    fontSize="10px"
                    fontWeight="bold"
                    px={1.5}
                >
                    {count}
                </Badge>
            )}
            <Flex
                w="36px" h="36px"
                borderRadius="xl"
                bg="white"
                align="center"
                justify="center"
                boxShadow="sm"
            >
                <Icon as={icon} boxSize={4} color={iconColor} />
            </Flex>
            <Text fontSize="xs" fontWeight="semibold" color="gray.600" textAlign="center" lineHeight="1.2">
                {label}
            </Text>
        </Flex>
    );
}

export const ProfilePanelVendor = ({
    isOpen,
    onClose,
    restaurantId,
}: ProfilePanelVendorProps) => {
    const { user, isLoaded } = useUser();
    const { nuevos, enCocina, listos } = useVendorOrders(restaurantId);

    if (!isOpen) return null;

    const pendingPayment = nuevos.filter((o) => o.status === "PENDING_PAYMENT");
    const paid = nuevos.filter((o) => o.status === "PAID");
    const received = nuevos.filter((o) => o.status === "RECEIVED");

    const stats = [
        {
            icon: FaMoneyBillWave,
            label: "Pago pendiente",
            count: pendingPayment.length,
            bg: "orange.50",
            iconColor: "orange.400",
            badgeColor: "orange",
        },
        {
            icon: FaCreditCard,
            label: "Pagados",
            count: paid.length,
            bg: "green.50",
            iconColor: "green.500",
            badgeColor: "green",
        },
        {
            icon: FaClipboardList,
            label: "Aceptados",
            count: received.length,
            bg: "blue.50",
            iconColor: "blue.500",
            badgeColor: "blue",
        },
        {
            icon: FaFire,
            label: "En cocina",
            count: enCocina.length,
            bg: "yellow.50",
            iconColor: "yellow.500",
            badgeColor: "yellow",
        },
        {
            icon: FaBell,
            label: "Listos",
            count: listos.length,
            bg: "teal.50",
            iconColor: "teal.500",
            badgeColor: "teal",
        },
    ];

    const totalActive = nuevos.length + enCocina.length + listos.length;

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
                boxShadow="2xl"
                overflow="hidden"
                zIndex={999}
                display="flex"
                flexDirection="column"
            >
                <Flex
                    align="center"
                    justify="space-between"
                    p={{ base: 4, md: 5 }}
                    borderBottom="1px solid"
                    borderColor="gray.100"
                    flexShrink={0}
                >
                    <Heading size={{ base: "sm", md: "md" }} color="#042E63">
                        Mi Perfil
                    </Heading>
                    <CloseButton onClick={onClose} />
                </Flex>

                <Box p={{ base: 4, md: 5 }} overflowY="auto" flex={1}>
                    {isLoaded && (
                        <VStack gap={6} align="stretch">
                            {/* User info */}
                            <UserProfileHeader
                                imageUrl={user?.imageUrl}
                                fullName={user?.fullName || "Usuario"}
                                email={user?.primaryEmailAddress?.emailAddress || ""}
                            />

                            <Box>
                                <HStack gap={2} mb={3}>
                                    <Box
                                        w="3px" h="16px"
                                        bg="#2DC6B8"
                                        borderRadius="full"
                                        flexShrink={0}
                                    />
                                    <Heading size="sm" color="#042E63">
                                        Pedidos del día
                                    </Heading>
                                    {totalActive > 0 && (
                                        <Badge
                                            colorScheme="teal"
                                            borderRadius="full"
                                            fontSize="10px"
                                            fontWeight="bold"
                                        >
                                            {totalActive} activos
                                        </Badge>
                                    )}
                                </HStack>

                                {totalActive === 0 ? (
                                    <Box
                                        bg="gray.50"
                                        borderRadius="xl"
                                        p={4}
                                        textAlign="center"
                                        border="1px dashed"
                                        borderColor="gray.200"
                                    >
                                        <Text fontSize="sm" color="gray.400">
                                            Sin pedidos activos por ahora
                                        </Text>
                                    </Box>
                                ) : (
                                    <SimpleGrid columns={2} gap={3}>
                                        {stats.map((s) => (
                                            <StatCard key={s.label} {...s} />
                                        ))}
                                    </SimpleGrid>
                                )}
                            </Box>

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
