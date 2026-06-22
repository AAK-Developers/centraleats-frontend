import { Box, VStack, Heading, Flex } from "@chakra-ui/react";
import { useUser } from "@clerk/clerk-react";
import { UserProfileHeader } from "../organisms/UserProfileHeader";
import { OrderCard } from "../molecules/OrderCard";
import { LogoutButton } from "../atoms/LogoutButton";
import { useOrderHistory } from "../../hooks/useOrderHistory";
import { CloseButton } from "../atoms/CloseButton";

interface ProfilePanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ProfilePanel = ({ isOpen, onClose }: ProfilePanelProps) => {
    const { user, isLoaded } = useUser();
    const { orders, isLoading } = useOrderHistory();

    if (!isOpen) return null;

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
                w={{ base: "calc(100% - 8px)", md: "400px" }}
                bg="white"
                borderRadius="3xl"
                boxShadow="2xl"
                overflow="hidden"
                zIndex={999}
            >
                <Flex align="center" justify="space-between" p={6} borderBottom="1px solid" borderColor="gray.100">
                    <Heading size="md" color="#042E63">Mi Perfil</Heading>
                    <CloseButton onClick={onClose} />
                </Flex>

                <Box p={6} overflowY="auto" h="calc(100% - 88px)">
                    {isLoaded && (
                        <VStack gap={6} align="center">
                            <UserProfileHeader
                                imageUrl={user?.imageUrl}
                                fullName={user?.fullName || "Usuario"}
                                email={user?.primaryEmailAddress?.emailAddress || ""}
                            />

                            <Box w="full">
                                <Heading size="md" color="#042E63" mb={3}>Historial de Pedidos</Heading>
                                {!isLoading && (
                                    <VStack gap={3} w="full">
                                        {orders.map((order) => (
                                            <OrderCard key={order.id} {...order} />
                                        ))}
                                    </VStack>
                                )}
                            </Box>

                            <Flex pt={4} justify="center" w="full">
                                <LogoutButton />
                            </Flex>
                        </VStack>
                    )}
                </Box>
            </Box>
        </>
    );
};