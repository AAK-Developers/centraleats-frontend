import {
    Box,
    Flex,
    Text,
    Input,
    SimpleGrid,
    Button,
    Spinner,
    Image,
    Badge,
    Stack,
    HStack,
} from "@chakra-ui/react";
import { FaSearch, FaShoppingCart, FaStore, FaClock } from "react-icons/fa";
import { MdRestaurantMenu } from "react-icons/md";
import { useUser } from "@clerk/clerk-react";
import { useState, useMemo } from "react";
import toast from "react-hot-toast";

import { WaveLayout } from "../../components/layout/WaveLayout";
import { AppContainer } from "../../components/layout/AppContainer";

import { useAllProducts, type Product } from "../../hooks/useAllProducts";
import { useCartStore } from "../../store/cartStore";
import { useStudentOrders, STATUS_LABELS, STATUS_COLORS } from "../../hooks/useStudentOrders";
import { DashboardHeader } from "../../components/student/organisms/DashboardHeader";

// ─── Product Card ─────────────────────────────────────────────────────────────

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
    const cartItems = useCartStore((s) => s.items);
    const inCart = cartItems.find((i) => i.product.id === product.id);

    return (
        <Box
            bg="white"
            borderRadius="2xl"
            overflow="hidden"
            border="1px solid"
            borderColor="gray.100"
            boxShadow="sm"
            transition="all 0.25s"
            _hover={{ transform: "translateY(-5px)", boxShadow: "lg" }}
            display="flex"
            flexDirection="column"
        >
            {/* Image */}
            <Box position="relative" h="180px" w="full" bg="gray.50" flexShrink={0}>
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    h="full"
                    w="full"
                    objectFit="cover"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=0D8ABC&color=fff&size=200`;
                    }}
                />
                {/* Availability badge */}
                <Badge
                    position="absolute"
                    top={3}
                    right={3}
                    px={2}
                    py={0.5}
                    borderRadius="full"
                    colorScheme={product.isAvailable ? "teal" : "red"}
                    fontSize="10px"
                    fontWeight="bold"
                >
                    {product.isAvailable ? "Disponible" : "Agotado"}
                </Badge>
            </Box>

            {/* Body */}
            <Stack p={4} gap={2} flex={1}>
                <Flex justify="space-between" align="baseline">
                    <Text fontWeight="bold" fontSize="md" color="gray.800" lineClamp={1} flex={1}>
                        {product.name}
                    </Text>
                    <Text fontWeight="extrabold" color="#2DC6B8" fontSize="lg" ml={2}>
                        ${(product.price / 100).toFixed(2)}
                    </Text>
                </Flex>

                {/* Restaurant name — clearly visible below product name */}
                <HStack gap={1} align="center">
                    <FaStore size={10} color="#2DC6B8" />
                    <Text fontSize="11px" color="#2DC6B8" fontWeight="semibold" lineClamp={1}>
                        {product.vendorName}
                    </Text>
                </HStack>

                <Text fontSize="xs" color="gray.500" lineClamp={2} flex={1}>
                    {product.description || "Sin descripción disponible."}
                </Text>

                {/* Cart badge */}
                {inCart && (
                    <Badge colorScheme="teal" borderRadius="full" fontSize="10px" px={2} alignSelf="flex-start">
                        En carrito ×{inCart.quantity}
                    </Badge>
                )}

                <Button
                    mt={1}
                    size="sm"
                    bg={product.isAvailable && product.stock > 0 ? "#042E63" : "gray.200"}
                    color={product.isAvailable && product.stock > 0 ? "white" : "gray.400"}
                    borderRadius="xl"
                    _hover={
                        product.isAvailable && product.stock > 0
                            ? { bg: "#031F44", transform: "scale(1.02)" }
                            : {}
                    }
                    onClick={() => onAddToCart(product)}
                    disabled={!product.isAvailable || product.stock <= 0}
                    transition="all 0.2s"
                >
                    <HStack gap={1} justify="center">
                        <FaShoppingCart size={11} />
                        <Text fontSize="xs">{inCart ? "Agregar más" : "Agregar al carrito"}</Text>
                    </HStack>
                </Button>
            </Stack>
        </Box>
    );
}

// ─── Active Order Status Strip ─────────────────────────────────────────────────

function ActiveOrdersStrip() {
    const { activeOrders, isLoading } = useStudentOrders();

    if (isLoading || activeOrders.length === 0) return null;

    return (
        <Box
            bg="white"
            border="1px solid"
            borderColor="blue.100"
            borderRadius="2xl"
            p={4}
            mb={6}
            boxShadow="sm"
        >
            <Flex align="center" gap={2} mb={3}>
                <FaClock color="#042E63" />
                <Text fontWeight="bold" color="#042E63" fontSize="md">
                    Mis pedidos activos
                </Text>
            </Flex>
            <Stack gap={2}>
                {activeOrders.map((order) => (
                    <Flex
                        key={order.id}
                        align="center"
                        justify="space-between"
                        bg="gray.50"
                        borderRadius="xl"
                        px={4}
                        py={2}
                        gap={3}
                        flexWrap="wrap"
                    >
                        <HStack gap={2} flex={1} minW="0">
                            <Text fontSize="sm" fontWeight="bold" color="gray.700" lineClamp={1}>
                                Pedido #{order.id.slice(-6).toUpperCase()}
                            </Text>
                            {order.vendorName && (
                                <Text fontSize="xs" color="gray.400" lineClamp={1}>
                                    — {order.vendorName}
                                </Text>
                            )}
                            {order.pickupCode && (
                                <Badge colorScheme="blue" variant="subtle" borderRadius="md" px={2} py={0.5} fontSize="xs" fontWeight="extrabold">
                                    Código: {order.pickupCode}
                                </Badge>
                            )}
                        </HStack>
                        <Badge
                            colorScheme={STATUS_COLORS[order.status]}
                            borderRadius="full"
                            px={3}
                            py={1}
                            fontSize="xs"
                            fontWeight="bold"
                            animation={order.status === "READY" ? "pulse 1.5s infinite" : undefined}
                        >
                            {order.status === "READY" ? "🔔 " : ""}{STATUS_LABELS[order.status]}
                        </Badge>
                    </Flex>
                ))}
            </Stack>
        </Box>
    );
}

// ─── Conflict Modal ────────────────────────────────────────────────────────────

interface ConflictDialogProps {
    isOpen: boolean;
    currentVendorName: string;
    newVendorName: string;
    onConfirm: () => void;
    onCancel: () => void;
}

function ConflictDialog({ isOpen, currentVendorName, newVendorName, onConfirm, onCancel }: ConflictDialogProps) {
    if (!isOpen) return null;
    return (
        <>
            <Box
                position="fixed"
                inset={0}
                bg="blackAlpha.500"
                backdropFilter="blur(4px)"
                zIndex={1000}
                onClick={onCancel}
            />
            <Box
                position="fixed"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                bg="white"
                borderRadius="2xl"
                p={6}
                zIndex={1001}
                maxW="400px"
                w="calc(100% - 32px)"
                boxShadow="2xl"
            >
                <Text fontSize="lg" fontWeight="bold" color="#042E63" mb={2}>
                    ¿Cambiar restaurante?
                </Text>
                <Text fontSize="sm" color="gray.600" mb={5}>
                    Tu carrito tiene platos de <strong>{currentVendorName}</strong>. Si agregas de <strong>{newVendorName}</strong>, se vaciará el carrito.
                </Text>
                <Flex gap={3} justify="flex-end">
                    <Button variant="ghost" borderRadius="xl" onClick={onCancel} size="sm">
                        Cancelar
                    </Button>
                    <Button
                        bg="#042E63"
                        color="white"
                        borderRadius="xl"
                        _hover={{ bg: "#031F44" }}
                        onClick={onConfirm}
                        size="sm"
                    >
                        Sí, cambiar
                    </Button>
                </Flex>
            </Box>
        </>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function StudentDashboardPage() {
    const { user } = useUser();
    const { products, isLoading } = useAllProducts();
    const { addItem, clearCart, vendorName: currentVendorName } = useCartStore();

    const [search, setSearch] = useState("");
    const [conflictProduct, setConflictProduct] = useState<{
        product: Product;
        vendorId: string;
        vendorName: string;
    } | null>(null);

    // Filter logic: match name, description, or vendor name
    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        if (!q) return products;
        return products.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.vendorName.toLowerCase().includes(q)
        );
    }, [products, search]);

    const handleAddToCart = (product: Product) => {
        if (!product.vendorId) {
            toast.error("Este plato no tiene un restaurante asociado.");
            return;
        }

        const result = addItem(
            {
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                imageUrl: product.imageUrl,
            },
            product.vendorId,
            product.vendorName
        );

        if (result === "conflict") {
            setConflictProduct({
                product,
                vendorId: product.vendorId,
                vendorName: product.vendorName,
            });
            return;
        }

        toast.success(
            () => (
                <span>
                    <strong>"{product.name}"</strong> agregado 🛒<br />
                    <span style={{ fontSize: "12px", color: "#6b7280" }}>
                        {product.vendorName} · ${(product.price / 100).toFixed(2)}
                    </span>
                </span>
            ),
            { duration: 3000, icon: "✅" }
        );
    };

    const handleConflictConfirm = () => {
        if (!conflictProduct) return;
        clearCart();
        addItem(
            {
                id: conflictProduct.product.id,
                name: conflictProduct.product.name,
                description: conflictProduct.product.description,
                price: conflictProduct.product.price,
                imageUrl: conflictProduct.product.imageUrl,
            },
            conflictProduct.vendorId,
            conflictProduct.vendorName
        );
        toast.success(`Carrito actualizado. "${conflictProduct.product.name}" agregado 🛒`);
        setConflictProduct(null);
    };

    return (
        <WaveLayout>
            <AppContainer>
                <DashboardHeader userName={user?.firstName || "Usuario"} />

                {/* Hero Section — centered */}
                <Box mb={8} textAlign="center">
                    <Text
                        fontSize={{ base: "2xl", md: "4xl" }}
                        fontWeight="extrabold"
                        color="#042E63"
                        mb={1}
                    >
                        ¿Qué vas a pedir hoy?
                    </Text>
                    <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500" mb={6}>
                        Todos los platos de los restaurantes de la Universidad Central del Ecuador
                    </Text>

                    {/* Search bar — centered, responsive */}
                    <Box position="relative" maxW="560px" mx="auto" w="full">
                        <Box
                            position="absolute"
                            left="18px"
                            top="50%"
                            transform="translateY(-50%)"
                            zIndex={1}
                            color="gray.400"
                            pointerEvents="none"
                        >
                            <FaSearch />
                        </Box>
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por plato, descripción o restaurante..."
                            borderRadius="full"
                            bg="white"
                            boxShadow="lg"
                            pl="48px"
                            pr={5}
                            h={{ base: "48px", md: "56px" }}
                            fontSize={{ base: "sm", md: "md" }}
                            border="2px solid"
                            borderColor="gray.100"
                            _focus={{
                                borderColor: "#2DC6B8",
                                boxShadow: "0 0 0 4px rgba(45,198,184,0.18)",
                                outline: "none",
                            }}
                            _placeholder={{ color: "gray.400" }}
                        />
                    </Box>
                </Box>

                {/* Active Orders Strip */}
                <ActiveOrdersStrip />

                {/* Products Grid */}
                {isLoading ? (
                    <Flex justify="center" align="center" py={20}>
                        <Stack align="center" gap={3}>
                            <Spinner size="xl" color="#2DC6B8" borderWidth="4px" />
                            <Text color="gray.500" fontSize="sm">Cargando platos...</Text>
                        </Stack>
                    </Flex>
                ) : filtered.length === 0 ? (
                    <Flex direction="column" align="center" justify="center" py={20} gap={3}>
                        <Box fontSize="4xl">
                            <MdRestaurantMenu size={64} color="#CBD5E0" />
                        </Box>
                        <Text color="gray.500" fontSize="lg" fontWeight="semibold">
                            {search ? "Sin resultados para tu búsqueda" : "No hay platos disponibles"}
                        </Text>
                        {search && (
                            <Button
                                size="sm"
                                variant="ghost"
                                color="#2DC6B8"
                                onClick={() => setSearch("")}
                                borderRadius="full"
                            >
                                Limpiar búsqueda
                            </Button>
                        )}
                    </Flex>
                ) : (
                    <>
                        <Flex justify="space-between" align="center" mb={4}>
                            <Text fontSize="sm" color="gray.500">
                                {filtered.length} plato{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
                                {search && ` para "${search}"`}
                            </Text>
                        </Flex>
                        <SimpleGrid
                            columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
                            gap={6}
                            pb={16}
                            w="full"
                        >
                            {filtered.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToCart={handleAddToCart}
                                />
                            ))}
                        </SimpleGrid>
                    </>
                )}
            </AppContainer>

            {/* Conflict Dialog */}
            <ConflictDialog
                isOpen={!!conflictProduct}
                currentVendorName={currentVendorName}
                newVendorName={conflictProduct?.vendorName || ""}
                onConfirm={handleConflictConfirm}
                onCancel={() => setConflictProduct(null)}
            />
        </WaveLayout>
    );
}