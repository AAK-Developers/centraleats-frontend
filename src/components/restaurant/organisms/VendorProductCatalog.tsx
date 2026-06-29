import { Box, Flex, Text, SimpleGrid, Icon, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaUtensils } from "react-icons/fa";
import { VendorProductCard } from "../atoms/VendorProductCard";
import type { VendorProduct } from "../types/vendor.types";

interface VendorProductCatalogProps {
    products: VendorProduct[];
}

export function VendorProductCatalog({ products }: VendorProductCatalogProps) {
    const navigate = useNavigate();

    return (
        <Box>
            <Flex justify="space-between" align="center" mb={8} gap={3} flexWrap="wrap">
                <HStack gap={3} align="center">
                    <Box w="4px" h="28px" bg="#2DC6B8" borderRadius="full" flexShrink={0} />
                    <Box>
                        <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="extrabold" color="#042E63" lineHeight="1.1">
                            Catálogo de Platos
                        </Text>
                        <Text fontSize="lg" color="gray.400" fontWeight="medium" mt={0.5}>
                            {products.length} {products.length === 1 ? "plato registrado" : "platos registrados"}
                        </Text>
                    </Box>
                </HStack>

                <Flex
                    as="button"
                    onClick={() => navigate("/register-menu")}
                    align="center"
                    justify="space-between"
                    bg="linear-gradient(135deg, #2DC6B8 0%, #042E63 100%)"
                    borderRadius="full"
                    pl={4}
                    pr={2}
                    py={2}
                    gap={3}
                    boxShadow="0 4px 14px rgba(45,198,184,0.35)"
                    transition="all 0.2s"
                    _hover={{ boxShadow: "0 6px 20px rgba(45,198,184,0.5)", transform: "translateY(-1px)" }}
                    _active={{ transform: "scale(0.98)" }}
                    cursor="pointer"
                    minW="160px"
                >
                    <Text fontSize="lg" fontWeight="bold" color="white">
                        Agregar Plato
                    </Text>
                    <Flex
                        w="28px" h="28px"
                        bg="white"
                        borderRadius="full"
                        align="center"
                        justify="center"
                        boxShadow="sm"
                        flexShrink={0}
                    >
                        <Icon as={FaPlus} boxSize={3} color="#2DC6B8" />
                    </Flex>
                </Flex>
            </Flex>

            {products.length === 0 ? (
                <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    py={16}
                    gap={4}
                    bg="gray.50"
                    borderRadius="2xl"
                    border="2px dashed"
                    borderColor="gray.200"
                >
                    <Flex w="64px" h="64px" bg="white" borderRadius="2xl" align="center" justify="center" boxShadow="sm">
                        <Icon as={FaUtensils} boxSize={6} color="gray.300" />
                    </Flex>
                    <Box textAlign="center">
                        <Text fontWeight="bold" color="gray.500" fontSize="lg">
                            Aún no tienes platos
                        </Text>
                        <Text fontSize="lg" color="gray.400" mt={1}>
                            Agrega tu primer plato para comenzar a recibir pedidos
                        </Text>
                    </Box>
                    <Flex
                        as="button"
                        onClick={() => navigate("/register-menu")}
                        align="center"
                        justify="space-between"
                        bg="linear-gradient(135deg, #2DC6B8 0%, #1fa89c 100%)"
                        borderRadius="full"
                        pl={4} pr={2} py={2}
                        gap={3}
                        boxShadow="0 4px 14px rgba(45,198,184,0.35)"
                        transition="all 0.2s"
                        _hover={{ boxShadow: "0 6px 20px rgba(45,198,184,0.5)", transform: "translateY(-1px)" }}
                        _active={{ transform: "scale(0.98)" }}
                        cursor="pointer"
                    >
                        <Text fontSize="lg" fontWeight="bold" color="white">Agregar primer plato</Text>
                        <Flex w="28px" h="28px" bg="white" borderRadius="full" align="center" justify="center" boxShadow="sm" flexShrink={0}>
                            <Icon as={FaPlus} boxSize={3} color="#2DC6B8" />
                        </Flex>
                    </Flex>
                </Flex>
            ) : (
                <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={{ base: 4, md: 6 }} pb={10} w="full">
                    {products.map((product) => (
                        <VendorProductCard key={product.id} product={product} />
                    ))}
                </SimpleGrid>
            )}
        </Box>
    );
}
