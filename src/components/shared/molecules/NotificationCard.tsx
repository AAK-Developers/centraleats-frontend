import { Box, Text, VStack } from '@chakra-ui/react';

interface NotificationProps {
    title: string;
    restaurant: string;
    status: string;
}

export const NotificationCard = ({ title, restaurant, status }: NotificationProps) => (
    <Box p={4} borderWidth="1px" borderRadius="lg" w="100%">
        <VStack align="start" gap={1}>
            <Text fontWeight="bold">{title} • {restaurant}</Text>
            <Text fontSize="sm" color="green.500">{status}</Text>
        </VStack>
    </Box>
);