import { Box, Flex, Text, IconButton } from "@chakra-ui/react";
import { HiX } from "react-icons/hi";

interface CartItemProps {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    onRemove: (id: string) => void;
}

export const CartItem = ({
    id,
    name,
    description,
    price,
    quantity,
    onRemove,
}: CartItemProps) => (
    <Flex
        align="center"
        gap={{ base: 2, md: 3 }}
        p={{ base: 2, md: 3 }}
        borderBottom="1px solid"
        borderColor="gray.100"
    >
        <Flex
            w={{ base: "40px", md: "36px" }}
            h={{ base: "40px", md: "36px" }}
            bg="gray.200"
            borderRadius="md"
            align="center"
            justify="center"
            fontSize={{ base: "sm", md: "xs" }}
            fontWeight="bold"
            color="gray.500"
            flexShrink={0}
        >
            {quantity}x
        </Flex>

        <Box
            flex={1}
            minW={0}
        >
            <Text
                fontWeight="bold"
                color="#042E63"
                fontSize={{ base: "sm", md: "sm" }}
            >
                ${price.toFixed(2)}
            </Text>

            <Text
                fontWeight="semibold"
                fontSize={{ base: "sm", md: "sm" }}
                lineClamp="1"
            >
                {name}
            </Text>

            <Text
                fontSize={{ base: "xs", md: "xs" }}
                color="gray.500"
                lineClamp="2"
            >
                {description}
            </Text>
        </Box>

        <IconButton
            aria-label="Eliminar producto"
            size="sm"
            variant="ghost"
            color="gray.400"
            _hover={{
                color: "red.400",
                bg: "red.50",
            }}
            onClick={() => onRemove(id)}
        >
            <HiX />
        </IconButton>
    </Flex>
);