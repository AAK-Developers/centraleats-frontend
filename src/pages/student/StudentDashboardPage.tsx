import {
    Box,
    Flex,
    Text,
    Input,
    SimpleGrid,
    Button,
    Spinner,
    Stack,
    Icon,
} from "@chakra-ui/react";
import { FaSearch, FaFilter } from "react-icons/fa";
import { MdRestaurantMenu } from "react-icons/md";
import { useUser } from "@clerk/clerk-react";
import { useState, useMemo } from "react";
import toast from "react-hot-toast";

import { WaveLayout } from "../../components/layout/WaveLayout";
import { AppContainer } from "../../components/layout/AppContainer";
import { DashboardHeader } from "../../components/student/organisms/DashboardHeader";

import { ProductCard } from "../../components/student/atoms/ProductCard";
import type { Product } from "../../components/student/atoms/ProductCard";
import { ActiveOrdersStrip } from "../../components/student/molecules/ActiveOrdersStrip";
import { ConflictDialog } from "../../components/student/molecules/ConflictDialog";
import { CartAddedToast } from "../../components/student/molecules/CartAddedToast";
import { FilterSidebar } from "../../components/student/molecules/FilterSidebar";
import { FilterMobileDrawer } from "../../components/student/molecules/FilterMobileDrawer";
import { SortDropdown } from "../../components/student/molecules/SortDropdown";
import { PaginationControls } from "../../components/student/molecules/PaginationControls";

import { useAllProducts } from "../../hooks/useAllProducts";
import { useCartStore } from "../../store/cartStore";
import { useCartToast } from "../../hooks/useCartToast";
import { useProductFilters } from "../../hooks/useProductFilters";


export default function StudentDashboardPage() {
    const { user } = useUser();
    const { products, isLoading } = useAllProducts();
    const { addItem, clearCart, vendorName: currentVendorName } = useCartStore();
    const { toasts, notify, dismiss } = useCartToast();

    const [search, setSearch] = useState("");
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [conflictProduct, setConflictProduct] = useState<{
        product: Product;
        vendorId: string;
        vendorName: string;
    } | null>(null);

    const searchFiltered = useMemo(() => {
        const q = search.toLowerCase().trim();
        if (!q) return products;
        return products.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.vendorName.toLowerCase().includes(q)
        );
    }, [products, search]);

    const {
        filters,
        updateFilters,
        resetFilters,
        priceBounds,
        availableVendors,
        activeFilterCount,
        results,
        totalResults,
        page,
        totalPages,
        setPage,
    } = useProductFilters({ products, searchFiltered });

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

        notify({
            productName: product.name,
            vendorName: product.vendorName,
            price: product.price,
            imageUrl: product.imageUrl,
        });
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
        notify({
            productName: conflictProduct.product.name,
            vendorName: conflictProduct.product.vendorName,
            price: conflictProduct.product.price,
            imageUrl: conflictProduct.product.imageUrl,
        });
        setConflictProduct(null);
    };

    const filterSidebarProps = {
        filters,
        onChange: updateFilters,
        onReset: resetFilters,
        priceBounds,
        availableVendors,
        activeFilterCount,
    };

    return (
        <WaveLayout>
            <AppContainer>
                <DashboardHeader userName={user?.firstName || "Usuario"} />

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

                <ActiveOrdersStrip />

                <Flex gap={6} align="flex-start">
                    <Box
                        as="aside"
                        display={{ base: "none", lg: "block" }}
                        w="280px"
                        flexShrink={0}
                        bg="white"
                        borderRadius="2xl"
                        border="1px solid"
                        borderColor="gray.100"
                        boxShadow="0 4px 16px rgba(4,46,99,0.06)"
                        p={5}
                        position="sticky"
                        top="20px"
                    >
                        <FilterSidebar {...filterSidebarProps} />
                    </Box>

                    <Box flex={1} minW={0}>
                        <Flex
                            justify="space-between"
                            align="center"
                            mb={4}
                            gap={3}
                            flexWrap="wrap"
                        >
                            <Flex align="center" gap={3}>
                                <Button
                                    display={{ base: "flex", lg: "none" }}
                                    onClick={() => setIsMobileFiltersOpen(true)}
                                    bg="white"
                                    border="1.5px solid"
                                    borderColor={activeFilterCount > 0 ? "#2DC6B8" : "gray.200"}
                                    color={activeFilterCount > 0 ? "#2DC6B8" : "gray.600"}
                                    borderRadius="full"
                                    size="sm"
                                    _hover={{ borderColor: "#2DC6B8", color: "#2DC6B8" }}
                                >
                                    <Flex align="center" gap={2}>
                                        <Icon as={FaFilter} boxSize={3} />
                                        <Text fontSize="xs" fontWeight="bold">
                                            Filtros{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
                                        </Text>
                                    </Flex>
                                </Button>

                                <Text fontSize="sm" color="gray.500" display={{ base: "none", sm: "block" }}>
                                    {totalResults} plato{totalResults !== 1 ? "s" : ""} encontrado{totalResults !== 1 ? "s" : ""}
                                    {search && ` para "${search}"`}
                                </Text>
                            </Flex>

                            <SortDropdown
                                value={filters.sortBy}
                                onChange={(sortBy) => updateFilters({ sortBy })}
                            />
                        </Flex>

                        <Text fontSize="xs" color="gray.500" mb={3} display={{ base: "block", sm: "none" }}>
                            {totalResults} plato{totalResults !== 1 ? "s" : ""} encontrado{totalResults !== 1 ? "s" : ""}
                        </Text>

                        {isLoading ? (
                            <Flex justify="center" align="center" py={20}>
                                <Stack align="center" gap={3}>
                                    <Spinner size="xl" color="#2DC6B8" borderWidth="4px" />
                                    <Text color="gray.500" fontSize="sm">
                                        Cargando platos...
                                    </Text>
                                </Stack>
                            </Flex>
                        ) : totalResults === 0 ? (
                            <Flex direction="column" align="center" justify="center" py={20} gap={3}>
                                <MdRestaurantMenu size={64} color="#CBD5E0" />
                                <Text color="gray.500" fontSize="lg" fontWeight="semibold">
                                    {search || activeFilterCount > 0
                                        ? "Sin resultados para tu búsqueda"
                                        : "No hay platos disponibles"}
                                </Text>
                                {(search || activeFilterCount > 0) && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        color="#2DC6B8"
                                        onClick={() => {
                                            setSearch("");
                                            resetFilters();
                                        }}
                                        borderRadius="full"
                                    >
                                        Limpiar búsqueda y filtros
                                    </Button>
                                )}
                            </Flex>
                        ) : (
                            <>
                                <SimpleGrid
                                    columns={{ base: 1, sm: 2, md: 2, lg: 3 }}
                                    gap={{ base: 4, md: 6 }}
                                    w="full"
                                >
                                    {results.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            onAddToCart={handleAddToCart}
                                        />
                                    ))}
                                </SimpleGrid>

                                <PaginationControls
                                    page={page}
                                    totalPages={totalPages}
                                    onPageChange={setPage}
                                />
                            </>
                        )}
                    </Box>
                </Flex>
            </AppContainer>

            <FilterMobileDrawer
                isOpen={isMobileFiltersOpen}
                onClose={() => setIsMobileFiltersOpen(false)}
                resultCount={totalResults}
                {...filterSidebarProps}
            />

            <ConflictDialog
                isOpen={!!conflictProduct}
                currentVendorName={currentVendorName}
                newVendorName={conflictProduct?.vendorName || ""}
                onConfirm={handleConflictConfirm}
                onCancel={() => setConflictProduct(null)}
            />

            <CartAddedToast toasts={toasts} onDismiss={dismiss} />
        </WaveLayout>
    );
}
