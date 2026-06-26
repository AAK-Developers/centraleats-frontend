import {
    Box,
    Flex,
    Text,
    Input,
    SimpleGrid,
    Button,
    Spinner,
    Stack,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { MdRestaurantMenu } from "react-icons/md";
import { useUser } from "@clerk/clerk-react";
import { useState, useMemo } from "react";
import toast from "react-hot-toast";

import { WaveLayout } from "../../components/layout/WaveLayout";
import { AppContainer } from "../../components/layout/AppContainer";
import { DashboardHeader } from "../../components/student/organisms/DashboardHeader";

// New componentized pieces
import { ProductCard } from "../../components/student/atoms/ProductCard";
import type { Product } from "../../components/student/atoms/ProductCard";
import { ActiveOrdersStrip } from "../../components/student/molecules/ActiveOrdersStrip";
import { ConflictDialog } from "../../components/student/molecules/ConflictDialog";

import { useAllProducts } from "../../hooks/useAllProducts";
import { useCartStore } from "../../store/cartStore";

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
                    <strong>"{product.name}"</strong> agregado 🛒
                    <br />
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

                {/* Hero */}
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

                    {/* Search bar */}
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

                {/* Active Orders */}
                <ActiveOrdersStrip />

                {/* Products Grid */}
                {isLoading ? (
                    <Flex justify="center" align="center" py={20}>
                        <Stack align="center" gap={3}>
                            <Spinner size="xl" color="#2DC6B8" borderWidth="4px" />
                            <Text color="gray.500" fontSize="sm">
                                Cargando platos...
                            </Text>
                        </Stack>
                    </Flex>
                ) : filtered.length === 0 ? (
                    <Flex direction="column" align="center" justify="center" py={20} gap={3}>
                        <MdRestaurantMenu size={64} color="#CBD5E0" />
                        <Text color="gray.500" fontSize="lg" fontWeight="semibold">
                            {search
                                ? "Sin resultados para tu búsqueda"
                                : "No hay platos disponibles"}
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
                                {filtered.length} plato
                                {filtered.length !== 1 ? "s" : ""} encontrado
                                {filtered.length !== 1 ? "s" : ""}
                                {search && ` para "${search}"`}
                            </Text>
                        </Flex>
                        <SimpleGrid
                            columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
                            gap={{ base: 4, md: 6 }}
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
