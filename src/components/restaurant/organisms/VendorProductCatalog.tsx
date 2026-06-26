import { Box, Flex, Text, Button, SimpleGrid } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { VendorProductCard } from "../atoms/VendorProductCard";
import type { VendorProduct } from "../types/vendor.types";

interface VendorProductCatalogProps {
    products: VendorProduct[];
}

export function VendorProductCatalog({ products }: VendorProductCatalogProps) {
    const navigate = useNavigate();

    return (
        <Box>
            <Flex
                justifyContent="space-between"
                alignItems="center"
                mb={6}
                gap={3}
                flexWrap="wrap"
            >
                <Text
                    fontSize={{ base: "xl", md: "2xl" }}
                    fontWeight="extrabold"
                    color="#042E63"
                >
                    Catálogo de Platos
                </Text>
                <Button
                    onClick={() => navigate("/register-menu")}
                    bg="#2DC6B8"
                    color="white"
                    borderRadius="full"
                    px={{ base: 4, md: 6 }}
                    size={{ base: "sm", md: "md" }}
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
                <SimpleGrid
                    columns={{ base: 1, sm: 2, lg: 3 }}
                    gap={{ base: 4, md: 6 }}
                    pb={10}
                    w="full"
                >
                    {products.map((product) => (
                        <VendorProductCard key={product.id} product={product} />
                    ))}
                </SimpleGrid>
            )}
        </Box>
    );
}
