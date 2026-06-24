import { Box, SimpleGrid } from "@chakra-ui/react";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";

import { WaveLayout } from "../../components/layout/WaveLayout";
import { AppContainer } from "../../components/layout/AppContainer";
import { DashboardHeaderVendor } from "../../components/organisms/DashboardHeaderVendor";
import { RestaurantSelectorVendor } from "../../components/molecules/RestaurantSelectorVendor";
import { PanelHeaderVendor } from "../../components/organisms/PanelHeaderVendor";
import { OrderTabsVendor, type OrderTab } from "../../components/molecules/OrderTabsVendor";
import { EmptyOrdersVendor } from "../../components/molecules/EmptyOrdersVendor";
import { ClosedStateVendor } from "../../components/molecules/ClosedStateVendor";

// HOOK: Restaurante del vendor

function useVendorRestaurant() {
    return {
        restaurant: {
            name: "Restaurante Central 1",
            logoUrl: "/assets/restaurant-placeholder.png",
        },
    };
}

// HOOK: Pedidos del vendor en tiempo real
// Endpoint sugerido: GET /api/vendor/orders?restaurantId=X
// Retorna: { nuevos: Order[], enCocina: Order[], listos: Order[] }

function useVendorOrders() {
    return {
        nuevos: [],
        enCocina: [],
        listos: [],
    };
}

export default function VendorDashboardPage() {
    const { user } = useUser();
    const { restaurant } = useVendorRestaurant();
    const { nuevos, enCocina, listos } = useVendorOrders();

    // TODO: sincronizar con el backend al hacer toggle
    // Endpoint sugerido: PATCH /api/vendor/restaurant/:id
    // Body: { isOpen: boolean }

    const [isOpen, setIsOpen] = useState(() => {
        return localStorage.getItem("vendorIsOpen") === "true";
    });

    const [activeTab, setActiveTab] = useState<OrderTab>("nuevos");

    const tabs: { key: OrderTab; label: string; count: number }[] = [
        { key: "nuevos", label: "Nuevos", count: nuevos.length },
        { key: "en_cocina", label: "En Cocina", count: enCocina.length },
        { key: "listos", label: "Listos", count: listos.length },
    ];

    const currentOrders =
        activeTab === "nuevos" ? nuevos :
            activeTab === "en_cocina" ? enCocina : listos;

    const handleToggle = () => setIsOpen((prev) => {
        const next = !prev;
        localStorage.setItem("vendorIsOpen", String(next));

        // TODO: llamar al backend para persistir el estado
        // Ejemplo:
        // await fetch(`/api/vendor/restaurant/${restaurant.id}`, {
        //     method: "PATCH",
        //     body: JSON.stringify({ isOpen: next }),
        // });

        return next;
    });

    return (
        <WaveLayout>
            <AppContainer>
                <DashboardHeaderVendor
                    userName={user?.firstName || "Nombre"}
                />

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

                        {currentOrders.length === 0 ? (
                            <EmptyOrdersVendor />
                        ) : (
                            <SimpleGrid
                                columns={{ base: 1, md: 2, lg: 3 }}
                                gap={6}
                                pb={10}
                                w="full"
                            >
                                {/* Cards de pedidos — datos de useVendorOrders()
                                    TODO: reemplazar Box con <VendorOrderCard />
                                    Endpoint sugerido para acciones por pedido:
                                    · Aceptar:   PATCH /api/orders/:id  → { status: "en_cocina" }
                                    · Listo:     PATCH /api/orders/:id  → { status: "listo" }
                                    · Rechazar:  PATCH /api/orders/:id  → { status: "rechazado" }
                                */}
                                {currentOrders.map((_order: unknown, i: number) => (
                                    <Box key={i}>
                                        {/* <VendorOrderCard order={_order} /> */}
                                    </Box>
                                ))}
                            </SimpleGrid>
                        )}
                    </Box>
                )}
            </AppContainer>
        </WaveLayout>
    );
}