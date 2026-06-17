import { Box, Flex, Text, Input, SimpleGrid, } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { useUser } from "@clerk/clerk-react";

import { WaveLayout } from "../../components/layout/WaveLayout";
import { AppContainer } from "../../components/layout/AppContainer";
import { RestaurantCard } from "../../components/molecules/RestaurantCard";
import { useRestaurants } from "../../hooks/useRestaurants";
import type { Restaurant } from "../../hooks/useRestaurants";
import { DashboardHeader } from "../../components/organisms/DashboardHeader";

export default function StudentDashboardPage() {
    const { user } = useUser();
    const { restaurants } = useRestaurants();

    return (
        <WaveLayout>
            <AppContainer>
                <DashboardHeader
                    userName={user?.firstName || "Usuario"}
                />
                <Flex
                    justify="space-between"
                    align="center"
                    mb={8}
                    gap={4}
                    flexWrap="wrap"
                >
                    <Text
                        fontSize="4xl"
                        fontWeight="bold"
                        color="#042E63"
                        flex="1"
                    >
                        Los mejores restaurantes de la Universidad Central del Ecuador
                    </Text>

                    <Box position="relative" maxW="300px" w="full">
                        <Input
                            placeholder="Buscar..."
                            borderRadius="full"
                            bg="white"
                            shadow="sm"
                            ps="10"
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
                </Flex>

                <SimpleGrid
                    columns={{ base: 1, md: 2, lg: 3 }}
                    gap={10}
                    pb={10}
                    w="full"
                >
                    {restaurants.map((rest: Restaurant, index) => (
                        <Box key={index} w="full">
                            <RestaurantCard {...rest} />
                        </Box>
                    ))}
                </SimpleGrid>

            </AppContainer>
        </WaveLayout>
    );
}