import { Box, Flex, Input, SimpleGrid } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { useUser } from "@clerk/clerk-react";

import { WaveLayout } from "../../components/layout/WaveLayout";
import { AppContainer } from "../../components/layout/AppContainer";
import { DashboardHeader } from "../../components/organisms/DashboardHeader";
import { RestaurantInfoHeader } from "../../components/organisms/RestaurantInfoHeader";
import { MenuItemCard } from "../../components/molecules/MenuItemCard";
import { CartPanel } from "../../components/organisms/CartPanel";

interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
}

const MOCK_MENU: MenuItem[] = [
    { id: "1", name: "Almuerzo Ejecutivo", description: "Sopa, segundo, jugo del día", price: 2.90, image: "https://via.placeholder.com/150", category: "Almuerzos" },
    { id: "2", name: "Almuerzo Ejecutivo", description: "Sopa, segundo, jugo del día", price: 2.90, image: "https://via.placeholder.com/150", category: "Almuerzos" },
    { id: "3", name: "Almuerzo Ejecutivo", description: "Sopa, segundo, jugo del día", price: 2.90, image: "https://via.placeholder.com/150", category: "Almuerzos" },
    { id: "4", name: "Almuerzo Ejecutivo", description: "Sopa, segundo, jugo del día", price: 2.90, image: "https://via.placeholder.com/150", category: "Almuerzos" },
];

export default function StudentMenuViewPage() {
    const { user } = useUser();

    return (
        <WaveLayout>
            <AppContainer>
                <DashboardHeader userName={user?.firstName || "Usuario"} />

                <RestaurantInfoHeader
                    name="Restaurante Central 1"
                    image="https://via.placeholder.com/80"
                    time="20-30 min"
                    rating={4.5}
                    location="Edificio Central"
                />

                <Box position="relative" maxW="400px" w="full" mb={6}>
                    <Input
                        placeholder="Buscar....."
                        borderRadius="full"
                        bg="white"
                        shadow="md"
                        ps="10"
                        borderColor="gray.400"
                    />
                    <Box
                        position="absolute"
                        left="3"
                        top="50%"
                        transform="translateY(-50%)"
                        zIndex="1"
                        color="gray.400"
                    >
                        <FaSearch />
                    </Box>
                </Box>

                <Flex gap={6} align="start" alignItems="flex-start">
                    <Box flex={1}>
                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} pb={10}>
                            {MOCK_MENU.map((item) => (
                                <MenuItemCard
                                    key={item.id}
                                    {...item}
                                    onAdd={(id) => console.log("add", id)}
                                />
                            ))}
                        </SimpleGrid>
                    </Box>

                    <Box
                        display={{ base: "none", lg: "block" }}
                        w="380px"
                        flexShrink={0}
                        position="sticky"
                        top="0px"
                        mt="-180px"
                    >
                        <Box
                            borderRadius="3xl"
                            boxShadow="2xl"
                            overflow="hidden"
                            border="1px solid"
                            borderColor="gray.100"
                        >
                            <CartPanel isOpen={true} onClose={() => { }} isInline={true} />
                        </Box>
                    </Box>
                </Flex>
            </AppContainer>
        </WaveLayout>
    );
}