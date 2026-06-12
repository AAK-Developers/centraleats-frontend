import { Box, Image, Text, HStack, VStack, Icon } from "@chakra-ui/react";
import { FaStar, FaClock } from "react-icons/fa";

type RestaurantCardProps = {
    name: string;
    category: string;
    time: string;
    rating: number;
    image: string;
};

export const RestaurantCard = ({
    name,
    category,
    time,
    rating,
    image,
}: RestaurantCardProps) => {
    return (
        <Box
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="2xl"
            p={3}
            boxShadow="sm"
            bg="white"
            mb={2}
            w="full"
        >
            <HStack gap={4} align="center">
                <Image
                    boxSize="70px"
                    borderRadius="xl"
                    src={image}
                    alt={name}
                    objectFit="cover"
                />

                <VStack align="center" gap={1} flex={1} w="full">
                    <Text
                        fontWeight="bold"
                        fontSize="md"
                        color="#042E63"
                        lineHeight="short"
                    >
                        {name}
                    </Text>

                    <Text fontSize="sm" color="gray.500" lineHeight="short">
                        • {category}
                    </Text>

                    <HStack w="full" justify="space-between" mt={1} align="center" >
                        <HStack gap={1} color="gray.500" fontSize="xs">
                            <Icon as={FaClock} />
                            <Text>{time}</Text>
                        </HStack>

                        <HStack gap={1} fontSize="xs">
                            <Icon as={FaStar} color="#E53E3E" />
                            <Text fontWeight="bold" color="gray.500">{rating} </Text>
                        </HStack>
                    </HStack>
                </VStack>
            </HStack>
        </Box>
    );
};