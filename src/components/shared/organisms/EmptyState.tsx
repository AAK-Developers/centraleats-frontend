import { VStack, Icon, Text } from '@chakra-ui/react';
import type { IconType } from 'react-icons';

interface EmptyStateProps {
    icon: IconType;
    message: string;
}

export const EmptyState = ({ icon, message }: EmptyStateProps) => (
    <VStack py={10} gap={4} color="gray.400" justify="center"
        align="center"
        w="full" >
        <Icon as={icon} boxSize={20} />
        <Text textAlign="center">{message}</Text>
    </VStack>
);