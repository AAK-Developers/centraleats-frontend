import { VStack, Heading, Box } from "@chakra-ui/react";
import { useUser } from "@clerk/clerk-react";
import { WaveLayout } from "../../components/layout/WaveLayout";
import { AppContainer } from "../../components/layout/AppContainer";
import { BackButton } from "../../components/atoms/BackButton";
import { AuthHeader } from "../../components/organisms/AuthHeader";
import { OrderCard } from "../../components/molecules/OrderCard";
import { useOrderHistory } from "../../hooks/useOrderHistory.ts";
import { LogoutButton } from "../../components/atoms/LogoutButton.tsx";
import { UserProfileHeader } from "../../components/organisms/UserProfileHeader.tsx";

export default function StudentProfilePage() {
    const { user, isLoaded } = useUser();
    const { orders, isLoading } = useOrderHistory();

    if (!isLoaded) return null;

    return (
        <WaveLayout>
            <Box w="100%" px={4}>
                <AppContainer>
                    <AuthHeader />
                    <BackButton />

                    <VStack gap={6} align="center" mt={4}>
                        <UserProfileHeader
                            imageUrl={user?.imageUrl}
                            fullName={user?.fullName || "Usuario"}
                            email={user?.primaryEmailAddress?.emailAddress || ""}
                        />
                        <Box w="full">
                            <Heading size="lg" color="#042E63" mb={3}>
                                Historial de Pedidos
                            </Heading>
                            {!isLoading && (
                                <VStack gap={3} w="full">
                                    {orders.map((order) => (
                                        <OrderCard
                                            key={order.id}
                                            {...order}
                                        />
                                    ))}
                                </VStack>
                            )}
                        </Box>
                        <LogoutButton />
                    </VStack>
                </AppContainer>
            </Box >
        </WaveLayout >
    );
}