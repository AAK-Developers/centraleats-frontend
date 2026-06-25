import { Box, Image, Text, HStack, VStack, Icon } from "@chakra-ui/react";
import { FaStar, FaClock } from "react-icons/fa";

type RestaurantCardProps = {
    name: string;
    category: string;
    time: string;
    rating: number;
    image: string;
    onClick?: () => void;
};

export const RestaurantCard = ({
    name,
    category,
    time,
    rating,
    image,
    onClick,
}: RestaurantCardProps) => {
    return (
        <Box
            borderWidth="1px"
            minH="150px"
            borderColor="gray.200"
            borderRadius="2xl"
            p={6}
            boxShadow="lg"
            bg="white"
            maxW="100%"
            mb={2}
            w="full"
            cursor={onClick ? "pointer" : "default"}
            onClick={onClick}
            _hover={onClick ? { boxShadow: "xl", borderColor: "#30B2BC" } : {}}
            transition="all 0.2s"
        >
            <HStack gap={4} align="center">
                <Image
                    boxSize="100px"
                    borderRadius="xl"
                    src={image}
                    alt={name}
                    objectFit="cover"
                />
                <VStack align="center" gap={1} flex={1} w="full">
                    <Text fontWeight="bold" fontSize="xl" color="#042E63" lineHeight="short">
                        {name}
                    </Text>
                    <Text fontSize="md" color="gray.500" lineHeight="short">
                        • {category}
                    </Text>
                    <HStack w="full" justify="space-between" mt={1} align="center">
                        <HStack gap={1} color="gray.500" fontSize="xs">
                            <Icon as={FaClock} />
                            <Text>{time}</Text>
                        </HStack>
                        <HStack gap={1} fontSize="xs">
                            <Icon as={FaStar} color="#E53E3E" />
                            <Text fontWeight="bold" color="gray.500">{rating}</Text>
                        </HStack>
                    </HStack>
                </VStack>
            </HStack>
        </Box>
    );
};