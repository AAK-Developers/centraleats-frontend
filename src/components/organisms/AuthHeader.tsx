import { VStack, Text } from '@chakra-ui/react';
import { Logo } from '../atoms/Logo';

interface AuthHeaderProps {
    title?: string;
    subtitle?: string;
    logoSize?: string;
    logoImage?: string;
    children?: React.ReactNode;
}

export const AuthHeader = ({ title, subtitle, logoSize = "250px", logoImage, children }: AuthHeaderProps) => {
    return (
        <VStack gap="6" w="full" align="center" mt="-80px">
            <Logo size={logoSize} image={logoImage} />
            {(title || subtitle) && (
                <VStack gap="2" textAlign="center">
                    {title && <Text fontSize="4xl" fontWeight="bold">{title}</Text>}
                    {subtitle && <Text color="gray.600">{subtitle}</Text>}
                </VStack>
            )}
            {children}
        </VStack>
    );
};