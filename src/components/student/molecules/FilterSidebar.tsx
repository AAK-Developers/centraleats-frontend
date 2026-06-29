import { Box, VStack, Text, HStack, Checkbox, Flex, Icon, Button, Badge } from "@chakra-ui/react";
import { FaTags, FaStore, FaCheckCircle, FaClock, FaUndoAlt } from "react-icons/fa";
import type { ProductFiltersState } from "../../../hooks/useProductFilters";

interface VendorOption {
    id: string;
    name: string;
}

interface FilterSidebarProps {
    filters: ProductFiltersState;
    onChange: (partial: Partial<ProductFiltersState>) => void;
    onReset: () => void;
    priceBounds: { min: number; max: number };
    availableVendors: VendorOption[];
    activeFilterCount: number;
}

const SectionLabel = ({ icon, children }: { icon: React.ElementType; children: React.ReactNode }) => (
    <HStack gap={2} mb={3}>
        <Icon as={icon} color="#2DC6B8" boxSize={3.5} />
        <Text fontSize="xs" fontWeight="bold" color="#042E63" letterSpacing="wide" textTransform="uppercase">
            {children}
        </Text>
    </HStack>
);

const ComingSoonRow = ({ label }: { label: string }) => (
    <Flex
        align="center"
        justify="space-between"
        opacity={0.45}
        cursor="not-allowed"
        py={1.5}
    >
        <Text fontSize="sm" color="gray.500">{label}</Text>
        <Badge fontSize="9px" colorScheme="gray" borderRadius="full" px={2}>
            Próximamente
        </Badge>
    </Flex>
);

export const FilterSidebar = ({
    filters,
    onChange,
    onReset,
    priceBounds,
    availableVendors,
    activeFilterCount,
}: FilterSidebarProps) => {
    const handlePriceMin = (value: number) => {
        onChange({ priceRange: { ...filters.priceRange, min: Math.min(value, filters.priceRange.max) } });
    };
    const handlePriceMax = (value: number) => {
        onChange({ priceRange: { ...filters.priceRange, max: Math.max(value, filters.priceRange.min) } });
    };

    const toggleVendor = (vendorId: string) => {
        const isSelected = filters.vendorIds.includes(vendorId);
        const next = isSelected
            ? filters.vendorIds.filter((id) => id !== vendorId)
            : [...filters.vendorIds, vendorId];
        onChange({ vendorIds: next });
    };

    return (
        <VStack align="stretch" gap={6}>
            <Flex justify="space-between" align="center">
                <Text fontWeight="extrabold" color="#042E63" fontSize="lg">
                    Filtros
                </Text>
                {activeFilterCount > 0 && (
                    <Button
                        size="xs"
                        variant="ghost"
                        color="#2DC6B8"
                        onClick={onReset}
                        _hover={{ bg: "#F0FBFC" }}
                        borderRadius="full"
                    >
                        <HStack gap={1}>
                            <Icon as={FaUndoAlt} boxSize={2.5} />
                            <Text fontSize="xs">Limpiar ({activeFilterCount})</Text>
                        </HStack>
                    </Button>
                )}
            </Flex>

            <Box h="1px" bg="gray.100" />

            <Box>
                <SectionLabel icon={FaTags}>Precio</SectionLabel>
                {priceBounds.max > 0 ? (
                    <VStack align="stretch" gap={3}>
                        <HStack justify="space-between">
                            <Box
                                bg="gray.50"
                                border="1px solid"
                                borderColor="gray.200"
                                borderRadius="lg"
                                px={2.5}
                                py={1.5}
                                flex={1}
                            >
                                <Text fontSize="9px" color="gray.400" fontWeight="bold">MÍN</Text>
                                <Text fontSize="sm" fontWeight="bold" color="#042E63">
                                    ${filters.priceRange.min.toFixed(2)}
                                </Text>
                            </Box>
                            <Text color="gray.300">—</Text>
                            <Box
                                bg="gray.50"
                                border="1px solid"
                                borderColor="gray.200"
                                borderRadius="lg"
                                px={2.5}
                                py={1.5}
                                flex={1}
                            >
                                <Text fontSize="9px" color="gray.400" fontWeight="bold">MÁX</Text>
                                <Text fontSize="sm" fontWeight="bold" color="#042E63">
                                    ${filters.priceRange.max.toFixed(2)}
                                </Text>
                            </Box>
                        </HStack>

                        <Box px={1}>
                            <Text fontSize="11px" color="gray.400" mb={1}>Mínimo</Text>
                            <input
                                type="range"
                                min={priceBounds.min}
                                max={priceBounds.max}
                                step={0.5}
                                value={filters.priceRange.min}
                                onChange={(e) => handlePriceMin(Number(e.target.value))}
                                style={{ width: "100%", accentColor: "#2DC6B8" }}
                            />
                            <Text fontSize="11px" color="gray.400" mb={1} mt={2}>Máximo</Text>
                            <input
                                type="range"
                                min={priceBounds.min}
                                max={priceBounds.max}
                                step={0.5}
                                value={filters.priceRange.max}
                                onChange={(e) => handlePriceMax(Number(e.target.value))}
                                style={{ width: "100%", accentColor: "#2DC6B8" }}
                            />
                        </Box>
                    </VStack>
                ) : (
                    <Text fontSize="sm" color="gray.400">Cargando rango de precios...</Text>
                )}
            </Box>

            <Box h="1px" bg="gray.100" />

            <Box>
                <SectionLabel icon={FaStore}>Restaurante</SectionLabel>
                {availableVendors.length === 0 ? (
                    <Text fontSize="sm" color="gray.400">Sin restaurantes disponibles</Text>
                ) : (
                    <VStack align="stretch" gap={2} maxH="180px" overflowY="auto" pr={1}>
                        {availableVendors.map((vendor) => (
                            <Checkbox.Root
                                key={vendor.id}
                                checked={filters.vendorIds.includes(vendor.id)}
                                onCheckedChange={() => toggleVendor(vendor.id)}
                                colorPalette="teal"
                            >
                                <Checkbox.HiddenInput />
                                <Checkbox.Control borderColor="gray.300" />
                                <Checkbox.Label>
                                    <Text fontSize="sm" color="gray.700">{vendor.name}</Text>
                                </Checkbox.Label>
                            </Checkbox.Root>
                        ))}
                    </VStack>
                )}
            </Box>

            <Box h="1px" bg="gray.100" />

            <Box>
                <SectionLabel icon={FaCheckCircle}>Disponibilidad</SectionLabel>
                <Checkbox.Root
                    checked={filters.onlyAvailable}
                    onCheckedChange={() => onChange({ onlyAvailable: !filters.onlyAvailable })}
                    colorPalette="teal"
                >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control borderColor="gray.300" />
                    <Checkbox.Label>
                        <Text fontSize="sm" color="gray.700">Solo mostrar disponibles</Text>
                    </Checkbox.Label>
                </Checkbox.Root>
            </Box>

            <Box h="1px" bg="gray.100" />

            <Box>
                <SectionLabel icon={FaTags}>Categoría</SectionLabel>
                <VStack align="stretch" gap={0.5}>
                    <ComingSoonRow label="Almuerzos" />
                    <ComingSoonRow label="Bebidas" />
                    <ComingSoonRow label="Snacks" />
                </VStack>
            </Box>

            <Box h="1px" bg="gray.100" />

            <Box>
                <SectionLabel icon={FaClock}>Tiempo de entrega</SectionLabel>
                <VStack align="stretch" gap={0.5}>
                    <ComingSoonRow label="Menos de 15 min" />
                    <ComingSoonRow label="15 - 30 min" />
                    <ComingSoonRow label="30+ min" />
                </VStack>
            </Box>
        </VStack>
    );
};
