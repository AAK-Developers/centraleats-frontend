import { Box, Image, Badge, Flex, Text, Icon, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import type { VendorProduct } from "../types/vendor.types";

interface VendorProductCardProps {
    product: VendorProduct;
}

export function VendorProductCard({ product }: VendorProductCardProps) {
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate("/edit-menu", { state: { product } });
    };

    return (
        <Box
            bg="white"
            borderRadius="2xl"
            overflow="hidden"
            border="1px solid"
            borderColor="gray.100"
            boxShadow="0 2px 12px rgba(4,46,99,0.07)"
            transition="all 0.3s cubic-bezier(0.4,0,0.2,1)"
            _hover={{
                transform: "translateY(-6px)",
                boxShadow: "0 12px 36px rgba(4,46,99,0.13)",
                borderColor: "#2DC6B8",
            }}
            display="flex"
            flexDirection="column"
        >
            <Box position="relative" h={{ base: "170px", md: "210px" }} w="full" bg="gray.50" flexShrink={0}>
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    h="full"
                    w="full"
                    objectFit="cover"
                    transition="transform 0.4s ease"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                            "https://ui-avatars.com/api/?name=Plato&background=0D8ABC&color=fff&size=200";
                    }}
                />

                <Box
                    position="absolute"
                    bottom={0} left={0} right={0}
                    h="70px"
                    bgGradient="linear(to-t, blackAlpha.600, transparent)"
                    pointerEvents="none"
                />

                <Badge
                    position="absolute"
                    top={3} right={3}
                    px={3} py={1}
                    borderRadius="full"
                    fontSize="10px"
                    fontWeight="bold"
                    letterSpacing="wide"
                    bg={product.isAvailable ? "rgba(45,198,184,0.92)" : "rgba(229,62,62,0.88)"}
                    color="white"
                    backdropFilter="blur(4px)"
                    boxShadow="sm"
                    textTransform="uppercase"
                >
                    {product.isAvailable ? "Disponible" : "Agotado"}
                </Badge>

                <Box
                    position="absolute"
                    bottom={3} left={3}
                    bg="white"
                    borderRadius="full"
                    px={3} py={1}
                    boxShadow="md"
                >
                    <Text fontWeight="extrabold" color="#042E63" fontSize="sm">
                        ${(product.price / 100).toFixed(2)}
                    </Text>
                </Box>
            </Box>

            <Flex direction="column" p={{ base: 3, md: 4 }} gap={3} flex={1}>
                <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold" color="gray.800" lineClamp={1}>
                    {product.name}
                </Text>

                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500" lineClamp={2} flex={1} minH={{ base: "32px", md: "40px" }}>
                    {product.description || "Sin descripción disponible."}
                </Text>

                <HStack justify="space-between" align="center" pt={2} borderTop="1px dashed" borderColor="gray.100">
                    <Text fontSize="xs" color="gray.400" fontWeight="medium">Stock</Text>
                    <HStack gap={1.5}>
                        <Box w="40px" h="4px" borderRadius="full" bg="gray.100" overflow="hidden">
                            <Box
                                h="full"
                                borderRadius="full"
                                bg={product.stock > 10 ? "#2DC6B8" : product.stock > 0 ? "orange.400" : "red.400"}
                                w={`${Math.min((product.stock / 20) * 100, 100)}%`}
                                transition="width 0.3s"
                            />
                        </Box>
                        <Text fontSize="xs" fontWeight="bold" color="gray.600">{product.stock} uds.</Text>
                    </HStack>
                </HStack>

                <Flex
                    as="button"
                    onClick={handleEdit}
                    align="center"
                    justify="space-between"
                    bg="linear-gradient(135deg, #2DC6B8 0%, #042E63 100%)"
                    borderRadius="full"
                    px={4}
                    py={2.5}
                    w="full"
                    boxShadow="0 4px 14px rgba(45,198,184,0.35)"
                    transition="all 0.2s"
                    _hover={{ boxShadow: "0 6px 20px rgba(45,198,184,0.5)", transform: "translateY(-1px)" }}
                    _active={{ transform: "scale(0.98)" }}
                    cursor="pointer"
                >
                    <Text fontSize="lg" fontWeight="bold" color="white">
                        Editar Plato
                    </Text>
                    <Flex
                        w="26px" h="26px"
                        bg="white"
                        borderRadius="full"
                        align="center"
                        justify="center"
                        boxShadow="sm"
                        flexShrink={0}
                    >
                        <Icon as={FaPen} boxSize={3} color="#2DC6B8" />
                    </Flex>
                </Flex>
            </Flex>
        </Box>
    );
}
