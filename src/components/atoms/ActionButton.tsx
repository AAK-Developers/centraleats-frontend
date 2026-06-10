import { Button, type ButtonProps, Box } from '@chakra-ui/react';
import { FaArrowRight } from 'react-icons/fa';

interface ActionButtonProps extends ButtonProps {
    label: string;
    isLoading?: boolean;
}

export const ActionButton = ({ label, isLoading, ...props }: ActionButtonProps) => {
    return (
        <Button
            variant="outline"
            borderColor="#042E63"
            color="#042E63"
            borderRadius="full"
            px="6"
            py="5"
            display="flex"
            alignItems="center"
            gap="3"
            _hover={{ bg: "#042E63", color: "white" }}
            loading={isLoading}
            loadingText="Procesando..."
            {...props}
        >
            {label}
            <Box as={FaArrowRight} boxSize="25px" />
        </Button>
    );
};