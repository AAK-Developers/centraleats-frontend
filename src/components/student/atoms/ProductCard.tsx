import {
    Box,
    Flex,
    Text,
    Button,
    Image,
    Badge,
    Stack,
    HStack,
} from "@chakra-ui/react";
import { FaShoppingCart, FaStore } from "react-icons/fa";
import { useCartStore } from "../../../store/cartStore";

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    isAvailable: boolean;
    stock: number;
    vendorId: string;
    vendorName: string;
}

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
    const cartItems = useCartStore((s) => s.items);
    const inCart = cartItems.find((i) => i.product.id === product.id);

    const isOrderable = product.isAvailable && product.stock > 0;

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
            h="full"
        >
            {/* Image */}
            <Box
                position="relative"
                h={{ base: "160px", sm: "180px", md: "180px" }}
                w="full"
                bg="gray.50"
                flexShrink={0}
            >
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    h="full"
                    w="full"
                    objectFit="cover"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            product.name
                        )}&background=0D8ABC&color=fff&size=200`;
                    }}
                />
                <Badge
                    position="absolute"
                    top={3}
                    right={3}
                    px={2}
                    py={0.5}
                    borderRadius="full"
                    colorScheme={product.isAvailable ? "teal" : "red"}
                    fontSize={{ base: "9px", md: "10px" }}
                    fontWeight="bold"
                >
                    {product.isAvailable ? "Disponible" : "Agotado"}
                </Badge>
            </Box>

            {/* Body */}
            <Stack p={{ base: 3, md: 4 }} gap={2} flex={1}>
                <Flex justify="space-between" align="baseline" gap={2}>
                    <Text
                        fontWeight="bold"
                        fontSize={{ base: "sm", md: "md" }}
                        color="gray.800"
                        lineClamp={1}
                        flex={1}
                    >
                        {product.name}
                    </Text>
                    <Text
                        fontWeight="extrabold"
                        color="#2DC6B8"
                        fontSize={{ base: "md", md: "lg" }}
                        flexShrink={0}
                    >
                        ${(product.price / 100).toFixed(2)}
                    </Text>
                </Flex>

                <HStack gap={1} align="center">
                    <FaStore size={10} color="#2DC6B8" />
                    <Text
                        fontSize={{ base: "10px", md: "11px" }}
                        color="#2DC6B8"
                        fontWeight="semibold"
                        lineClamp={1}
                    >
                        {product.vendorName}
                    </Text>
                </HStack>

                <Text
                    fontSize={{ base: "11px", md: "xs" }}
                    color="gray.500"
                    lineClamp={2}
                    flex={1}
                >
                    {product.description || "Sin descripción disponible."}
                </Text>

                {inCart && (
                    <Badge
                        colorScheme="teal"
                        borderRadius="full"
                        fontSize="10px"
                        px={2}
                        alignSelf="flex-start"
                    >
                        En carrito ×{inCart.quantity}
                    </Badge>
                )}

                <Button
                    mt={1}
                    size={{ base: "xs", md: "sm" }}
                    bg={isOrderable ? "#042E63" : "gray.200"}
                    color={isOrderable ? "white" : "gray.400"}
                    borderRadius="xl"
                    _hover={isOrderable ? { bg: "#031F44", transform: "scale(1.02)" } : {}}
                    onClick={() => onAddToCart(product)}
                    disabled={!isOrderable}
                    transition="all 0.2s"
                    w="full"
                >
                    <HStack gap={1} justify="center">
                        <FaShoppingCart size={11} />
                        <Text fontSize={{ base: "11px", md: "xs" }}>
                            {inCart ? "Agregar más" : "Agregar al carrito"}
                        </Text>
                    </HStack>
                </Button>
            </Stack>
        </Box>
    );
}
