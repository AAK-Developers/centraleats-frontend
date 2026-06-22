import { HStack, VStack, Text, Image } from "@chakra-ui/react";

interface OrderCardProps {
    id: string;
    restaurant: string;
    price: string;
    date: string;
    status: "Entregado";
    imageUrl?: string;
}

export const OrderCard = ({ id, restaurant, price, date, status, imageUrl }: OrderCardProps) => {
    return (
        <HStack
            p={4}
            borderWidth="1px"
            borderRadius="xl"
            w="full"
            borderColor="gray.200"
            gap={4}
            bg="white"
        >
            <Image
                src={imageUrl || "/placeholder-food.png"}
                alt={restaurant}
                boxSize="65px"
                borderRadius="full"
                objectFit="cover"
            />

            <VStack align="start" gap={0.5} flex="1">
                <Text fontWeight="bold" color="#042E63" fontSize="md">
                    Pedido #{id}
                </Text>
                <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    {restaurant}
                </Text>
                <Text fontSize="xs" color="gray.500">
                    {price} • {date}
                </Text>
            </VStack>

            <Text
                fontSize="xs"
                fontWeight="bold"
                color="green.500"
                alignSelf="center"
            >
                {status}
            </Text>
        </HStack>
    );
};