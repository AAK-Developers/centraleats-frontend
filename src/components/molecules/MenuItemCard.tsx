import { Box, Flex, HStack, Image, Text, VStack } from "@chakra-ui/react";

interface MenuItemCardProps {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    onAdd: (id: string) => void;
}

export const MenuItemCard = ({ id, name, description, price, image, onAdd }: MenuItemCardProps) => {
    return (
        <Box
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="2xl"
            p={4}
            boxShadow="md"
            bg="white"
            w="full"
        >
            <HStack gap={3} align="center">
                <Image
                    src={image}
                    alt={name}
                    boxSize="90px"
                    borderRadius="xl"
                    objectFit="cover"
                    flexShrink={0}
                />
                <VStack align="start" gap={1} flex={1}>
                    <Text fontWeight="bold" fontSize="md" color="#042E63">
                        {name}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                        {description}
                    </Text>
                    <HStack justify="space-between" w="full" mt={1}>
                        <Text fontWeight="bold" color="#042E63" fontSize="md">
                            Precio:{" "}
                            <Text as="span" color="#30B2BC">
                                ${price.toFixed(2)}
                            </Text>
                        </Text>
                        <Flex
                            as="button"
                            w="32px"
                            h="32px"
                            bg="#30B2BC"
                            borderRadius="full"
                            align="center"
                            justify="center"
                            color="white"
                            fontWeight="bold"
                            fontSize="xl"
                            _hover={{ bg: "#2899a1" }}
                            transition="all 0.2s"
                            onClick={() => onAdd(id)}
                        >
                            +
                        </Flex>
                    </HStack>
                </VStack>
            </HStack>
        </Box>
    );
};