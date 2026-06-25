import {
    Box,
    Flex,
    Text,
    Input,
    SimpleGrid,
    Dialog,
    Portal,
    Button,
    useDisclosure,
    Spinner,
    Image,
    Badge,
    Stack
} from "@chakra-ui/react";
import { FaSearch, FaClock, FaStar } from "react-icons/fa";
import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { WaveLayout } from "../../components/layout/WaveLayout";
import { AppContainer } from "../../components/layout/AppContainer";
import { RestaurantCard } from "../../components/molecules/RestaurantCard";
import { useRestaurants } from "../../hooks/useRestaurants";
import type { Restaurant } from "../../hooks/useRestaurants";
import { DashboardHeader } from "../../components/organisms/DashboardHeader";
import { apiClient } from "../../api/axiosConfig";

interface MenuProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    isAvailable: boolean;
}

interface RestaurantMenuModalProps {
    restaurant: Restaurant | null;
    isOpen: boolean;
    onClose: () => void;
}

export function RestaurantMenuModal({ restaurant, isOpen, onClose }: RestaurantMenuModalProps) {
    const [products, setProducts] = useState<MenuProduct[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOrdering, setIsOrdering] = useState(false);

    useEffect(() => {
        const fetchMenu = async () => {
            if (!restaurant?.id) return;
            setIsLoading(true);
            try {
                const res = await apiClient.get(`/api/products?vendorId=${restaurant.id}`);
                const list = res.data?.data || res.data || [];
                setProducts(list.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    description: p.description || "",
                    price: p.price,
                    stock: p.stock || 0,
                    imageUrl: p.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=0D8ABC&color=fff&size=200`,
                    isAvailable: p.isAvailable,
                })));
            } catch (err) {
                console.error("Error fetching restaurant menu:", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (isOpen && restaurant?.id) {
            fetchMenu();
        } else {
            setProducts([]);
        }
    }, [isOpen, restaurant?.id]);

    const handleOrder = async (product: MenuProduct) => {
        if (!restaurant?.id || isOrdering) return;
        setIsOrdering(true);
        try {
            // Step 1: Create Order (enters PENDING_PAYMENT status)
            const orderRes = await apiClient.post("/api/orders", {
                vendorId: restaurant.id,
                items: [
                    {
                        productId: product.id,
                        targetQuantity: 1
                    }
                ],
                notes: "Pedido rápido desde menú del estudiante"
            });

            const newOrder = orderRes.data?.data || orderRes.data;
            if (!newOrder?.id) {
                throw new Error("Order creation failed");
            }

            // Step 2: Instant mock payment (transitions PENDING_PAYMENT -> PAID)
            await apiClient.patch(`/api/orders/${newOrder.id}/status`, {
                status: "PAID"
            });

            toast.success(`¡Pedido de "${product.name}" realizado y pagado con éxito!`);
            onClose();
        } catch (err) {
            console.error("Error placing order:", err);
            toast.error("Error al procesar el pedido o el pago.");
        } finally {
            setIsOrdering(false);
        }
    };

    if (!restaurant) return null;

    return (
        <Dialog.Root open={isOpen} onOpenChange={(details) => { if (!details.open) onClose(); }} size="lg">
            <Portal>
                <Dialog.Backdrop bg="blackAlpha.400" backdropFilter="blur(8px)" />
                <Dialog.Positioner>
                    <Dialog.Content borderRadius="3xl" overflow="hidden" maxW="600px" bg="white">
                        <Box bg="#042E63" p={6} color="white" position="relative">
                            <Dialog.CloseTrigger color="white" top={4} right={4} size="lg" borderRadius="full" bg="whiteAlpha.200" _hover={{ bg: "whiteAlpha.300" }} />
                            <Flex gap={4} align="center">
                                <Image
                                    boxSize="80px"
                                    borderRadius="2xl"
                                    src={restaurant.image}
                                    alt={restaurant.name}
                                    objectFit="cover"
                                    border="2px solid white"
                                />
                                <Stack spacing={1}>
                                    <Text fontSize="2xl" fontWeight="bold">
                                        {restaurant.name}
                                    </Text>
                                    <Text fontSize="sm" opacity={0.9}>
                                        {restaurant.category}
                                    </Text>
                                    <Flex gap={4} fontSize="xs" mt={1}>
                                        <Flex align="center" gap={1}>
                                            <FaClock />
                                            <Text>{restaurant.time}</Text>
                                        </Flex>
                                        <Flex align="center" gap={1}>
                                            <FaStar color="#FFD700" />
                                            <Text fontWeight="bold">{restaurant.rating}</Text>
                                        </Flex>
                                    </Flex>
                                </Stack>
                            </Flex>
                        </Box>
                        <Dialog.Body p={6} bg="gray.50" maxH="400px" overflowY="auto">
                            <Text fontSize="lg" fontWeight="extrabold" color="gray.700" mb={4}>
                                Menú / Platos Disponibles
                            </Text>
                            {isLoading ? (
                                <Flex justify="center" py={10}>
                                    <Spinner size="lg" color="#2DC6B8" />
                                </Flex>
                            ) : products.length === 0 ? (
                                <Box textAlign="center" py={10} color="gray.500">
                                    Este restaurante no tiene platos registrados todavía.
                                </Box>
                            ) : (
                                <Stack spacing={4}>
                                    {products.map((product) => (
                                        <Flex
                                            key={product.id}
                                            bg="white"
                                            p={4}
                                            borderRadius="2xl"
                                            border="1px solid"
                                            borderColor="gray.100"
                                            shadow="sm"
                                            gap={4}
                                            align="center"
                                            transition="all 0.2s"
                                            _hover={{ shadow: "md", transform: "translateY(-1px)" }}
                                        >
                                            <Image
                                                boxSize="90px"
                                                borderRadius="xl"
                                                src={product.imageUrl}
                                                alt={product.name}
                                                objectFit="cover"
                                                fallbackSrc="https://ui-avatars.com/api/?name=Plato&background=0D8ABC&color=fff&size=200"
                                            />
                                            <Stack flex={1} spacing={1}>
                                                <Flex justify="space-between" align="baseline">
                                                    <Text fontWeight="bold" fontSize="md" color="gray.800" noOfLines={1}>
                                                        {product.name}
                                                    </Text>
                                                    <Text fontWeight="extrabold" color="#2DC6B8" fontSize="md">
                                                        ${(product.price / 100).toFixed(2)}
                                                    </Text>
                                                </Flex>
                                                <Text fontSize="xs" color="gray.500" noOfLines={2}>
                                                    {product.description || "Sin descripción disponible."}
                                                </Text>
                                                <Flex justify="space-between" align="center" mt={1}>
                                                    <Flex align="center" gap={2}>
                                                        <Badge
                                                            colorScheme={product.isAvailable ? "teal" : "red"}
                                                            borderRadius="full"
                                                            px={2}
                                                            py={0.5}
                                                            fontSize="10px"
                                                        >
                                                            {product.isAvailable ? "Disponible" : "Agotado"}
                                                        </Badge>
                                                        <Text fontSize="10px" color="gray.400">
                                                            Stock: {product.stock}
                                                        </Text>
                                                    </Flex>
                                                    <Button
                                                        size="xs"
                                                        bg="#2DC6B8"
                                                        color="white"
                                                        borderRadius="full"
                                                        px={4}
                                                        _hover={{ bg: "#25a89c" }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleOrder(product);
                                                        }}
                                                        isLoading={isOrdering}
                                                        isDisabled={!product.isAvailable || product.stock <= 0}
                                                    >
                                                        Pedir y Pagar
                                                    </Button>
                                                </Flex>
                                            </Stack>
                                        </Flex>
                                    ))}
                                </Stack>
                            )}
                        </Dialog.Body>
                        <Dialog.Footer bg="gray.50" borderTop="1px solid" borderColor="gray.100" p={4}>
                            <Button onClick={onClose} borderRadius="full" px={6} colorScheme="blue" bg="#042E63" _hover={{ bg: "#031F44" }}>
                                Cerrar
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}

export default function StudentDashboardPage() {
    const { user } = useUser();
    const { restaurants } = useRestaurants();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

    const handleRestaurantClick = (rest: Restaurant) => {
        setSelectedRestaurant(rest);
        onOpen();
    };

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
                        <Box
                            key={index}
                            w="full"
                            onClick={() => handleRestaurantClick(rest)}
                            cursor="pointer"
                            transition="all 0.2s"
                            _hover={{ transform: "translateY(-4px)", opacity: 0.95 }}
                        >
                            <RestaurantCard {...rest} />
                        </Box>
                    ))}
                </SimpleGrid>

                <RestaurantMenuModal
                    restaurant={selectedRestaurant}
                    isOpen={isOpen}
                    onClose={onClose}
                />
            </AppContainer>
        </WaveLayout>
    );
}