import { Flex, HStack, Icon, Image, Text, VStack } from "@chakra-ui/react";
import { FaClock, FaMapMarkerAlt, FaStar } from "react-icons/fa";

interface RestaurantInfoHeaderProps {
    name: string;
    image: string;
    time: string;
    rating: number;
    location: string;
}

export const RestaurantInfoHeader = ({ name, image, time, rating, location }: RestaurantInfoHeaderProps) => {
    return (
        <Flex align="center" gap={4} mb={6} flexWrap="wrap">
            <Image
                src={image}
                alt={name}
                boxSize="80px"
                borderRadius="xl"
                objectFit="cover"
            />
            <VStack align="start" gap={1}>
                <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="#042E63">
                    {name}
                </Text>
                <HStack gap={4} flexWrap="wrap">
                    <HStack gap={1} color="gray.500" fontSize="sm">
                        <Icon as={FaClock} />
                        <Text>{time}</Text>
                    </HStack>
                    <HStack gap={1} fontSize="sm">
                        <Icon as={FaStar} color="#E53E3E" />
                        <Text fontWeight="bold" color="gray.500">{rating}</Text>
                    </HStack>
                    <HStack gap={1} color="gray.500" fontSize="sm">
                        <Icon as={FaMapMarkerAlt} />
                        <Text>{location}</Text>
                    </HStack>
                </HStack>
            </VStack>
        </Flex>
    );
};