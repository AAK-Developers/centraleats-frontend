import { Box, SimpleGrid, Image, Text, Badge, Stack, Flex, Spinner, Separator, Button } from "@chakra-ui/react";
import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { WaveLayout } from "../../components/layout/WaveLayout";
import { AppContainer } from "../../components/layout/AppContainer";
import { DashboardHeaderVendor } from "../../components/organisms/DashboardHeaderVendor";
import { RestaurantSelectorVendor } from "../../components/molecules/RestaurantSelectorVendor";
import { PanelHeaderVendor } from "../../components/organisms/PanelHeaderVendor";
import { OrderTabsVendor, type OrderTab } from "../../components/molecules/OrderTabsVendor";
import { EmptyOrdersVendor } from "../../components/molecules/EmptyOrdersVendor";
import { ClosedStateVendor } from "../../components/molecules/ClosedStateVendor";
import { useAuthStore } from "../../store/authStore";
import { apiClient } from "../../api/axiosConfig";

// HOOK: Restaurante del vendor

interface VendorRestaurant {
    id: string;
    name: string;
    logoUrl: string;
    description: string;
    location: string;
    phone: string;
    openingTime: string;
    closingTime: string;
}

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    isAvailable: boolean;
}

function useVendorRestaurant() {
    const profile = useAuthStore((state) => state.profile);
    const [restaurant, setRestaurant] = useState<VendorRestaurant | null>(() => {
        if (!profile?.id) {
            return {
                id: "test-restaurant-id",
                name: "Restaurante Central 1",
                logoUrl: "/assets/restaurant-placeholder.png",
                description: "",
                location: "",
                phone: "",
                openingTime: "08:00",
                closingTime: "17:00"
            };
        }
        return null;
    });
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(() => {
        return !!profile?.id;
    });

    useEffect(() => {
        const fetchVendorData = async () => {
            if (!profile?.id) return;
            setIsLoading(true);
            try {
                const res = await apiClient.get("/api/restaurants");
                const list = res.data?.data || res.data || [];
                const myRest = list.find((r: any) => r.ownerId === profile.id);
                if (myRest) {
                    setRestaurant({
                        id: myRest.id,
                        name: myRest.name,
                        logoUrl: myRest.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(myRest.name)}&background=0D8ABC&color=fff&size=200`,
                        description: myRest.description || "",
                        location: myRest.location || "",
                        phone: myRest.phone || "",
                        openingTime: myRest.openingTime || "",
                        closingTime: myRest.closingTime || "",
                    });

                    const prodRes = await apiClient.get(`/api/products?vendorId=${myRest.id}`);
                    const prodList = prodRes.data?.data || prodRes.data || [];
                    setProducts(prodList.map((p: any) => ({
                        id: p.id,
                        name: p.name,
                        description: p.description || "",
                        price: p.price,
                        stock: p.stock || 0,
                        imageUrl: p.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=0D8ABC&color=fff&size=200`,
                        isAvailable: p.isAvailable,
                    })));
                }
            } catch (err) {
                console.error("Error fetching vendor restaurant:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchVendorData();
    }, [profile?.id]);

    return {
        restaurant,
        products,
        isLoading,
    };
}

// HOOK: Pedidos del vendor en tiempo real
function useVendorOrders(restaurantId?: string) {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);

    const fetchOrders = async () => {
        if (!restaurantId || restaurantId === "test-restaurant-id") return;
        try {
            const res = await apiClient.get(`/api/orders/vendor?vendorId=${restaurantId}`);
            setOrders(res.data?.data || res.data || []);
        } catch (err) {
            console.error("Error fetching vendor orders:", err);
        }
    };

    useEffect(() => {
        if (!restaurantId || restaurantId === "test-restaurant-id") return;
        fetchOrders();
        const interval = setInterval(fetchOrders, 4000);
        return () => clearInterval(interval);
    }, [restaurantId]);

    const nuevos = orders.filter(o => o.status === "PENDING_PAYMENT" || o.status === "PAID" || o.status === "RECEIVED");
    const enCocina = orders.filter(o => o.status === "PREPARING");
    const listos = orders.filter(o => o.status === "READY" || o.status === "PICKED_UP");

    return {
        nuevos,
        enCocina,
        listos,
        refreshOrders: fetchOrders,
        isLoadingOrders
    };
}

// COMPONENT: Tarjeta de pedido individual
interface OrderItem {
    id: string;
    productName: string;
    quantity: number;
}

interface OrderCardProps {
    order: {
        id: string;
        status: string;
        totalAmount: number;
        notes?: string;
        createdAt: string;
        user: { fullName: string; email: string };
        items: OrderItem[];
    };
    onAccept?: () => void;
    onReady?: () => void;
    onDeliver?: () => void;
}

export function VendorOrderCard({ order, onAccept, onReady, onDeliver }: OrderCardProps) {
    const formattedDate = new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <Box
            bg="white"
            borderRadius="2xl"
            p={5}
            border="1px solid"
            borderColor="gray.100"
            shadow="sm"
            display="flex"
            flexDirection="column"
            gap={4}
            transition="all 0.2s"
            _hover={{ shadow: "md" }}
        >
            <Flex justify="space-between" align="center">
                <Text fontWeight="extrabold" color="#042E63" fontSize="md">
                    Pedido #{order.id.slice(-6).toUpperCase()}
                </Text>
                <Text fontSize="xs" color="gray.400">
                    {formattedDate}
                </Text>
            </Flex>

            <Separator />

            <VStack align="stretch" spacing={2}>
                <Text fontSize="sm" fontWeight="bold" color="gray.700">
                    Cliente: {order.user?.fullName || "Estudiante"}
                </Text>
                <Box>
                    <Text fontSize="xs" color="gray.400" mb={1}>Items:</Text>
                    {order.items.map((item) => (
                        <Flex key={item.id} justify="space-between" align="center" pl={2}>
                            <Text fontSize="sm" color="gray.600">
                                {item.quantity}x {item.productName}
                            </Text>
                        </Flex>
                    ))}
                </Box>
                {order.notes && (
                    <Box bg="orange.50" p={2} borderRadius="lg" borderLeft="3px solid" borderColor="orange.300">
                        <Text fontSize="xs" color="orange.700" italic>
                            Nota: {order.notes}
                        </Text>
                    </Box>
                )}
            </VStack>

            <Separator />

            <Flex justify="space-between" align="center">
                <Text fontSize="sm" color="gray.500">Total:</Text>
                <Text fontSize="lg" fontWeight="extrabold" color="#2DC6B8">
                    ${(order.totalAmount / 100).toFixed(2)}
                </Text>
            </Flex>

            <Flex justify="stretch" mt={2}>
                {onAccept && (
                    <Button onClick={onAccept} w="full" bg="#2DC6B8" color="white" borderRadius="xl" _hover={{ bg: "#25a89c" }}>
                        Aceptar Pedido
                    </Button>
                )}
                {onReady && (
                    <Button onClick={onReady} w="full" bg="orange.400" color="white" borderRadius="xl" _hover={{ bg: "orange.500" }}>
                        Marcar como Listo
                    </Button>
                )}
                {onDeliver && (
                    <Button onClick={onDeliver} w="full" bg="blue.500" color="white" borderRadius="xl" _hover={{ bg: "blue.600" }}>
                        Entregar Pedido
                    </Button>
                )}
            </Flex>
        </Box>
    );
}

export default function VendorDashboardPage() {
    const { user } = useUser();
    const navigate = useNavigate();
    const { restaurant, products, isLoading } = useVendorRestaurant();
    const { nuevos, enCocina, listos, refreshOrders } = useVendorOrders(restaurant?.id);

    // TODO: sincronizar con el backend al hacer toggle
    const [isOpen, setIsOpen] = useState(() => {
        return localStorage.getItem("vendorIsOpen") === "true";
    });

    const [activeTab, setActiveTab] = useState<OrderTab>("nuevos");

    const tabs: { key: OrderTab; label: string; count: number }[] = [
        { key: "nuevos", label: "Nuevos", count: nuevos.length },
        { key: "en_cocina", label: "En Cocina", count: enCocina.length },
        { key: "listos", label: "Listos", count: listos.length },
        { key: "platos", label: "Mis Platos", count: products.length },
    ];

    const currentOrders =
        activeTab === "nuevos" ? nuevos :
            activeTab === "en_cocina" ? enCocina : listos;

    const handleToggle = () => setIsOpen((prev) => {
        const next = !prev;
        localStorage.setItem("vendorIsOpen", String(next));
        return next;
    });

    const handleAccept = async (orderId: string) => {
        try {
            await apiClient.patch(`/api/orders/${orderId}/status`, { status: "RECEIVED" });
            await apiClient.patch(`/api/orders/${orderId}/status`, { status: "PREPARING" });
            toast.success("Pedido aceptado y en preparación.");
            refreshOrders();
        } catch (err) {
            console.error("Failed to accept order:", err);
            toast.error("Error al aceptar pedido");
        }
    };

    const handleReady = async (orderId: string) => {
        try {
            await apiClient.patch(`/api/orders/${orderId}/status`, { status: "READY" });
            toast.success("¡Pedido marcado como listo para retirar!");
            refreshOrders();
        } catch (err) {
            console.error("Failed to update status:", err);
            toast.error("Error al actualizar estado");
        }
    };

    const handleDeliver = async (orderId: string) => {
        try {
            await apiClient.patch(`/api/orders/${orderId}/status`, { status: "PICKED_UP" });
            await apiClient.patch(`/api/orders/${orderId}/status`, { status: "COMPLETED" });
            toast.success("¡Pedido entregado con éxito!");
            refreshOrders();
        } catch (err) {
            console.error("Failed to deliver order:", err);
            toast.error("Error al entregar pedido");
        }
    };

    if (isLoading) {
        return (
            <WaveLayout>
                <AppContainer>
                    <Box display="flex" justifyContent="center" alignItems="center" h="60vh">
                        <Spinner size="xl" color="#2DC6B8" thickness="4px" />
                    </Box>
                </AppContainer>
            </WaveLayout>
        );
    }

    if (!restaurant) {
        return (
            <WaveLayout>
                <AppContainer>
                    <Box textAlign="center" py={10} color="gray.500">
                        No se encontró ningún local registrado para este usuario.
                    </Box>
                </AppContainer>
            </WaveLayout>
        );
    }

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

                        {activeTab === "platos" ? (
                            <Box>
                                <Flex justifyContent="space-between" alignItems="center" mb={6}>
                                    <Text fontSize="2xl" fontWeight="extrabold" color="#042E63">
                                        Catálogo de Platos
                                    </Text>
                                    <Button
                                        onClick={() => navigate("/register-menu")}
                                        bg="#2DC6B8"
                                        color="white"
                                        borderRadius="full"
                                        px={6}
                                        _hover={{ bg: "#25a89c" }}
                                    >
                                        + Agregar Plato
                                    </Button>
                                </Flex>

                                {products.length === 0 ? (
                                    <Box textAlign="center" py={10} color="gray.500" fontSize="lg">
                                        Aún no has registrado ningún plato.
                                    </Box>
                                ) : (
                                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6} pb={10} w="full">
                                        {products.map((product) => (
                                            <Box
                                                key={product.id}
                                                bg="white"
                                                borderRadius="2xl"
                                                overflow="hidden"
                                                border="1px solid"
                                                borderColor="gray.100"
                                                boxShadow="sm"
                                                transition="all 0.3s"
                                                _hover={{ transform: "translateY(-4px)", boxShadow: "md" }}
                                            >
                                                <Box position="relative" h="200px" w="full" bg="gray.50">
                                                    <Image
                                                        src={product.imageUrl}
                                                        alt={product.name}
                                                        h="full"
                                                        w="full"
                                                        objectFit="cover"
                                                        fallbackSrc="https://ui-avatars.com/api/?name=Plato&background=0D8ABC&color=fff&size=200"
                                                    />
                                                    <Badge
                                                        position="absolute"
                                                        top={4}
                                                        right={4}
                                                        px={3}
                                                        py={1}
                                                        borderRadius="full"
                                                        colorScheme={product.isAvailable ? "teal" : "red"}
                                                        fontSize="xs"
                                                    >
                                                        {product.isAvailable ? "Disponible" : "Agotado"}
                                                    </Badge>
                                                </Box>
                                                <Stack p={5} spacing={3}>
                                                    <Flex justifyContent="space-between" alignItems="baseline">
                                                        <Text fontSize="lg" fontWeight="bold" noOfLines={1} color="gray.800">
                                                            {product.name}
                                                        </Text>
                                                        <Text fontSize="lg" fontWeight="extrabold" color="#2DC6B8">
                                                            ${(product.price / 100).toFixed(2)}
                                                        </Text>
                                                    </Flex>
                                                    <Text fontSize="sm" color="gray.600" noOfLines={2} h="40px">
                                                        {product.description || "Sin descripción disponible."}
                                                    </Text>
                                                    <Flex justifyContent="space-between" alignItems="center" pt={2} borderTop="1px solid" borderColor="gray.50">
                                                        <Text fontSize="xs" color="gray.400">
                                                            Stock disponible
                                                        </Text>
                                                        <Badge colorScheme="gray" borderRadius="md" px={2} py={0.5}>
                                                            {product.stock} unidades
                                                        </Badge>
                                                    </Flex>
                                                </Stack>
                                            </Box>
                                        ))}
                                    </SimpleGrid>
                                )}
                            </Box>
                        ) : currentOrders.length === 0 ? (
                            <EmptyOrdersVendor />
                        ) : (
                            <SimpleGrid
                                columns={{ base: 1, md: 2, lg: 3 }}
                                gap={6}
                                pb={10}
                                w="full"
                            >
                                {currentOrders.map((order: any) => (
                                    <VendorOrderCard
                                        key={order.id}
                                        order={order}
                                        onAccept={activeTab === "nuevos" ? () => handleAccept(order.id) : undefined}
                                        onReady={activeTab === "en_cocina" ? () => handleReady(order.id) : undefined}
                                        onDeliver={activeTab === "listos" ? () => handleDeliver(order.id) : undefined}
                                    />
                                ))}
                            </SimpleGrid>
                        )}
                    </Box>
                )}
            </AppContainer>
        </WaveLayout>
    );
}