import { Box, Text, VStack, HStack, Circle } from '@chakra-ui/react';

interface NotificationProps {
    title: string;
    restaurant: string;
    status: string;
}

const STATUS_STYLE: Record<string, { color: string; bg: string; border: string; label: string }> = {
    RECEIVED: { color: 'blue.600', bg: 'blue.50', border: 'blue.200', label: 'Aceptado' },
    PREPARING: { color: 'orange.500', bg: 'orange.50', border: 'orange.200', label: 'En preparación' },
    READY: { color: 'green.600', bg: 'green.50', border: 'green.200', label: 'Listo' },
};

const DOT_COLOR: Record<string, string> = {
    RECEIVED: 'blue.400',
    PREPARING: 'orange.400',
    READY: 'green.500',
};

export const NotificationCard = ({ title, restaurant, status }: NotificationProps) => {
    const style = STATUS_STYLE[status] ?? {
        color: 'gray.600',
        bg: 'gray.50',
        border: 'gray.200',
        label: status,
    };
    const dotColor = DOT_COLOR[status] ?? 'gray.400';

    return (
        <Box
            p={4}
            borderWidth="1px"
            borderRadius="xl"
            w="100%"
            bg={style.bg}
            borderColor={style.border}
            transition="all 0.2s"
            _hover={{ boxShadow: 'sm' }}
        >
            <VStack align="start" gap={1}>
                {/* Title row with dot indicator */}
                <HStack gap={2} align="center">
                    <Circle size="8px" bg={dotColor} flexShrink={0} />
                    <Text fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }} color="gray.800">
                        {title}
                    </Text>
                </HStack>

                {/* Restaurant */}
                <Text fontSize="sm" color="gray.500" pl="16px">
                    {restaurant}
                </Text>

                {/* Status badge */}
                <Box pl="16px">
                    <Text
                        fontSize="xs"
                        fontWeight="semibold"
                        color={style.color}
                        bg="white"
                        px={2}
                        py={0.5}
                        borderRadius="full"
                        border="1px solid"
                        borderColor={style.border}
                        display="inline-block"
                    >
                        {style.label}
                    </Text>
                </Box>
            </VStack>
        </Box>
    );
};
