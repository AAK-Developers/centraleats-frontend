import { Box, Flex, Text, Button, Spinner } from "@chakra-ui/react";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { WaveLayout } from "../../components/layout/WaveLayout";
import { AppContainer } from "../../components/layout/AppContainer";

// Existing components
import { DashboardHeaderVendor } from "../../components/restaurant/organisms/DashboardHeaderVendor";
import { PanelHeaderVendor } from "../../components/restaurant/organisms/PanelHeaderVendor";
import { RestaurantSelectorVendor } from "../../components/restaurant/molecules/RestaurantSelectorVendor";
import { OrderTabsVendor } from "../../components/restaurant/molecules/OrderTabsVendor";
import { ClosedStateVendor } from "../../components/restaurant/molecules/ClosedStateVendor";
import type { OrderTab } from "../../components/restaurant/molecules/OrderTabsVendor";

// New components
import { VendorProductCatalog } from "../../components/restaurant/organisms/VendorProductCatalog";
import { VendorOrdersPanel } from "../../components/restaurant/organisms/VendorOrdersPanel";

// Hooks
import { useVendorRestaurant } from "../../hooks/useVendorRestaurant";
import { useVendorOrders } from "../../hooks/useVendorOrders";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VendorDashboardPage() {
    const { user } = useUser();
    const navigate = useNavigate();
    const { restaurant, products, isLoading } = useVendorRestaurant();
    const { nuevos, enCocina, listos, refreshOrders } = useVendorOrders(restaurant?.id);

    const [isOpen, setIsOpen] = useState(() => {
        return localStorage.getItem("vendorIsOpen") === "true";
    });
    const [activeTab, setActiveTab] = useState<OrderTab>("nuevos");

    const tabs: { key: OrderTab; label: string; count: number; badgeColor?: string }[] = [
        { key: "nuevos", label: "Pedidos Nuevos", count: nuevos.length, badgeColor: "#E53E3E" },
        { key: "en_cocina", label: "En Cocina", count: enCocina.length, badgeColor: "#D69E2E" },
        { key: "listos", label: "Listos", count: listos.length, badgeColor: "#38A169" },
        { key: "platos", label: "Mis Platos", count: products.length },
    ];

    const currentOrders =
        activeTab === "nuevos" ? nuevos :
            activeTab === "en_cocina" ? enCocina : listos;

    const handleToggle = () =>
        setIsOpen((prev) => {
            const next = !prev;
            localStorage.setItem("vendorIsOpen", String(next));
            return next;
        });

    // ── Loading ──────────────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <WaveLayout>
                <AppContainer>
                    <Flex justify="center" align="center" h="60vh">
                        <Spinner size="xl" color="#2DC6B8" borderWidth="4px" />
                    </Flex>
                </AppContainer>
            </WaveLayout>
        );
    }

    // ── No restaurant ────────────────────────────────────────────────────────
    if (!restaurant) {
        return (
            <WaveLayout>
                <AppContainer>
                    <Flex
                        direction="column"
                        align="center"
                        justify="center"
                        py={10}
                        gap={4}
                        textAlign="center"
                    >
                        <Text fontSize={{ base: "md", md: "lg" }} color="gray.500">
                            No se encontró ningún local registrado para este usuario.
                        </Text>
                        <Button
                            onClick={() => navigate("/register-restaurant")}
                            bg="#2DC6B8"
                            color="white"
                            borderRadius="full"
                            px={6}
                            _hover={{ bg: "#25a89c" }}
                        >
                            Registrar mi Restaurante
                        </Button>
                    </Flex>
                </AppContainer>
            </WaveLayout>
        );
    }

    // ── Main ─────────────────────────────────────────────────────────────────
    return (
        <WaveLayout>
            <AppContainer>
                <DashboardHeaderVendor userName={user?.firstName || "Nombre"} />

                <RestaurantSelectorVendor
                    name={restaurant.name}
                    logoUrl={restaurant.logoUrl}
                />

                <PanelHeaderVendor
                    restaurantName={restaurant.name}
                    isOpen={isOpen}
                    onToggle={handleToggle}
                />

                {!isOpen ? (
                    <ClosedStateVendor />
                ) : (
                    <Box>
                        <OrderTabsVendor
                            tabs={tabs}
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                        />

                        {activeTab === "platos" ? (
                            <VendorProductCatalog products={products} />
                        ) : (
                            <VendorOrdersPanel
                                orders={currentOrders}
                                activeTab={activeTab}
                                onRefresh={refreshOrders}
                            />
                        )}
                    </Box>
                )}
            </AppContainer>
        </WaveLayout>
    );
}
