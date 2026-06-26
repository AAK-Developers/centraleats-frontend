import { Box, Image, Badge, Stack, Flex, Text } from "@chakra-ui/react";
import type { VendorProduct } from "../types/vendor.types";

interface VendorProductCardProps {
    product: VendorProduct;
}

export function VendorProductCard({ product }: VendorProductCardProps) {
    return (
        <Box
            bg="white"
            borderRadius="2xl"
            overflow="hidden"
            border="1px solid"
            borderColor="gray.100"
            boxShadow="sm"
            transition="all 0.3s"
            _hover={{ transform: "translateY(-4px)", boxShadow: "md" }}
        >
            {/* Image */}
            <Box
                position="relative"
                h={{ base: "160px", md: "200px" }}
                w="full"
                bg="gray.50"
            >
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    h="full"
                    w="full"
                    objectFit="cover"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                            "https://ui-avatars.com/api/?name=Plato&background=0D8ABC&color=fff&size=200";
                    }}
                />
                <Badge
                    position="absolute"
                    top={{ base: 2, md: 4 }}
                    right={{ base: 2, md: 4 }}
                    px={3}
                    py={1}
                    borderRadius="full"
                    colorScheme={product.isAvailable ? "teal" : "red"}
                    fontSize={{ base: "10px", md: "xs" }}
                >
                    {product.isAvailable ? "Disponible" : "Agotado"}
                </Badge>
            </Box>

            {/* Body */}
            <Stack p={{ base: 3, md: 5 }} gap={3}>
                <Flex justifyContent="space-between" alignItems="baseline" gap={2}>
                    <Text
                        fontSize={{ base: "md", md: "lg" }}
                        fontWeight="bold"
                        lineClamp={1}
                        color="gray.800"
                        flex={1}
                    >
                        {product.name}
                    </Text>
                    <Text
                        fontSize={{ base: "md", md: "lg" }}
                        fontWeight="extrabold"
                        color="#2DC6B8"
                        flexShrink={0}
                    >
                        ${(product.price / 100).toFixed(2)}
                    </Text>
                </Flex>

                <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    color="gray.600"
                    lineClamp={2}
                    minH={{ base: "32px", md: "40px" }}
                >
                    {product.description || "Sin descripción disponible."}
                </Text>

                <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    pt={2}
                    borderTop="1px solid"
                    borderColor="gray.50"
                >
                    <Text fontSize="xs" color="gray.400">
                        Stock disponible
                    </Text>
                    <Badge colorScheme="gray" borderRadius="md" px={2} py={0.5} fontSize="xs">
                        {product.stock} unidades
                    </Badge>
                </Flex>
            </Stack>
        </Box>
    );
}
