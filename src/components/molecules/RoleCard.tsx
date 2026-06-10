import { VStack, Text, Box } from '@chakra-ui/react';
import { ActionButton } from '../atoms/ActionButton';
import type { IconType } from 'react-icons';

interface RoleCardProps {
    icon: IconType;
    iconBg: string;
    iconColor: string;
    title: string;
    description: string;
    onClick: () => void;
    isLoading: boolean;
}

export const RoleCard = ({
    icon: Icon,
    iconBg,
    iconColor,
    title,
    description,
    onClick,
    isLoading
}: RoleCardProps) => {
    return (
        <Box w="full" p="6" borderWidth="1px" borderRadius="xl" shadow="md">
            <VStack gap="4">
                <Box p="4" bg={iconBg} borderRadius="full">
                    <Icon size="30px" color={iconColor} />
                </Box>

                <Text fontWeight="bold">{title}</Text>

                <Text fontSize="sm" color="gray.500" textAlign="center">
                    {description}
                </Text>

                <ActionButton
                    label="Continuar"
                    onClick={onClick}
                    isLoading={isLoading}
                />
            </VStack>
        </Box>
    );
};