import { Box, Flex, Text, Icon, Button } from "@chakra-ui/react";
import { HiX } from "react-icons/hi";
import { FilterSidebar } from "./FilterSidebar";
import type { ProductFiltersState } from "../../../hooks/useProductFilters";

interface VendorOption {
    id: string;
    name: string;
}

interface FilterMobileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    filters: ProductFiltersState;
    onChange: (partial: Partial<ProductFiltersState>) => void;
    onReset: () => void;
    priceBounds: { min: number; max: number };
    availableVendors: VendorOption[];
    activeFilterCount: number;
    resultCount: number;
}

export const FilterMobileDrawer = ({
    isOpen,
    onClose,
    resultCount,
    ...filterProps
}: FilterMobileDrawerProps) => {
    if (!isOpen) return null;

    return (
        <>
            <Box
                position="fixed"
                inset={0}
                bg="blackAlpha.500"
                backdropFilter="blur(2px)"
                zIndex={1200}
                onClick={onClose}
            />
            <Flex
                position="fixed"
                bottom={0}
                left={0}
                right={0}
                top="10%"
                bg="white"
                borderTopRadius="2xl"
                zIndex={1201}
                direction="column"
                boxShadow="0 -10px 40px rgba(4,46,99,0.2)"
                css={{ animation: "filterDrawerSlideUp 0.25s ease-out" }}
            >
                <Flex
                    align="center"
                    justify="space-between"
                    p={4}
                    borderBottom="1px solid"
                    borderColor="gray.100"
                    flexShrink={0}
                >
                    <Text fontWeight="extrabold" color="#042E63" fontSize="lg">
                        Filtros y orden
                    </Text>
                    <Box
                        as="button"
                        onClick={onClose}
                        w="32px"
                        h="32px"
                        borderRadius="full"
                        bg="gray.100"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        _hover={{ bg: "gray.200" }}
                    >
                        <Icon as={HiX} boxSize={4} color="gray.600" />
                    </Box>
                </Flex>

                <Box flex={1} overflowY="auto" p={4}>
                    <FilterSidebar {...filterProps} />
                </Box>

                <Box p={4} borderTop="1px solid" borderColor="gray.100" flexShrink={0}>
                    <Button
                        w="full"
                        bg="#2DC6B8"
                        color="white"
                        borderRadius="full"
                        py={6}
                        fontWeight="bold"
                        _hover={{ bg: "#25a89c" }}
                        onClick={onClose}
                    >
                        Ver {resultCount} {resultCount === 1 ? "resultado" : "resultados"}
                    </Button>
                </Box>
            </Flex>

            <style>
                {`
                    @keyframes filterDrawerSlideUp {
                        from { transform: translateY(100%); }
                        to { transform: translateY(0); }
                    }
                `}
            </style>
        </>
    );
};
