import { Box, Input, InputGroup, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { DashboardHeader } from "../../components/organisms/DashboardHeader";
import { RestaurantCard } from "../../components/molecules/RestaurantCard";
import { useUser } from "@clerk/clerk-react";
import { WaveLayout } from "../../components/layout/WaveLayout";
import { AuthHeader } from "../../components/organisms/AuthHeader";
import { FilterBar } from "../../components/molecules/FilterBar";
import { AppContainer } from "../../components/layout/AppContainer";
import { useRestaurants } from "../../hooks/useRestaurants";

export default function StudentDashboardPage() {
    const { user } = useUser();

    const [activeFilter, setActiveFilter] = useState("Todos");
    const { restaurants } = useRestaurants();
    const filters = ["Todos", "Almuerzos", "Comida Rápida"];

    return (
        <WaveLayout>
            <AppContainer>
                <Box mb={6}>
                    <AuthHeader />
                </Box>

                <DashboardHeader userName={user?.firstName || "Estudiante"} />

                <InputGroup mb={4} startElement={<FaSearch color="#A0AEC0" />}>
                    <Input placeholder="¿Qué deseas comer hoy?" borderRadius="xl" bg="gray.50" />
                </InputGroup>

                <FilterBar
                    filters={filters}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                />

                <VStack align="stretch" gap={3}>
                    {restaurants.map((rest, index) => (
                        <RestaurantCard key={index} {...rest} />
                    ))}
                </VStack>
            </AppContainer>
        </WaveLayout>
    );
}