import { Box, Flex, Text, IconButton, HStack, Image } from "@chakra-ui/react";
import { HiX, HiPlus, HiMinus } from "react-icons/hi";

interface CartItemProps {
    id: string;
    name: string;
    description: string;
    price: number; // in cents
    quantity: number;
    imageUrl?: string;
    onRemove: (id: string) => void;
    onIncrement: (id: string) => void;
    onDecrement: (id: string) => void;
}

export const CartItem = ({
    id,
    name,
    description,
    price,
    quantity,
    imageUrl,
    onRemove,
    onIncrement,
    onDecrement,
}: CartItemProps) => (
    <Flex
        align="center"
        gap={3}
        p={3}
        borderBottom="1px solid"
        borderColor="gray.100"
        _last={{ borderBottom: "none" }}
    >
        {/* Product image */}
        {imageUrl && (
            <Image
                src={imageUrl}
                alt={name}
                boxSize="52px"
                borderRadius="lg"
                objectFit="cover"
                flexShrink={0}
                onError={(e) => {
                    e.currentTarget.style.display = "none";
                }}
            />
        )}

        {/* Info */}
        <Box flex={1} minW={0}>
            <Text
                fontWeight="bold"
                color="#042E63"
                fontSize="sm"
                lineClamp={1}
            >
                {name}
            </Text>
            <Text fontSize="xs" color="gray.500" lineClamp={1}>
                {description}
            </Text>
            <Text fontSize="sm" fontWeight="extrabold" color="#2DC6B8" mt={0.5}>
                ${(price / 100).toFixed(2)} c/u
            </Text>
        </Box>

        {/* Quantity controls */}
        <HStack gap={1} flexShrink={0}>
            <IconButton
                aria-label="Reducir cantidad"
                size="xs"
                variant="ghost"
                borderRadius="full"
                color="gray.500"
                _hover={{ bg: "red.50", color: "red.400" }}
                onClick={() => onDecrement(id)}
            >
                <HiMinus />
            </IconButton>
            <Text
                fontWeight="bold"
                color="#042E63"
                fontSize="sm"
                minW="20px"
                textAlign="center"
            >
                {quantity}
            </Text>
            <IconButton
                aria-label="Aumentar cantidad"
                size="xs"
                variant="ghost"
                borderRadius="full"
                color="gray.500"
                _hover={{ bg: "teal.50", color: "teal.500" }}
                onClick={() => onIncrement(id)}
            >
                <HiPlus />
            </IconButton>
        </HStack>

        {/* Subtotal + remove */}
        <Box textAlign="right" flexShrink={0}>
            <Text fontSize="sm" fontWeight="bold" color="gray.700">
                ${((price * quantity) / 100).toFixed(2)}
            </Text>
            <IconButton
                aria-label="Eliminar producto"
                size="xs"
                variant="ghost"
                color="gray.300"
                _hover={{ color: "red.400", bg: "red.50" }}
                onClick={() => onRemove(id)}
                mt={0.5}
            >
                <HiX />
            </IconButton>
        </Box>
    </Flex>
);