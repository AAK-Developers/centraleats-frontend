import { Button, type ButtonProps } from "@chakra-ui/react";

interface ActionButtonProps extends ButtonProps {
    label: string;
    isLoading?: boolean;
}

export const ActionButton = ({ label, isLoading, ...props }: ActionButtonProps) => {
    return (
        <Button
            bg="#30B2BC"
            color="white"
            loading={isLoading}
            fontSize="lg"
            borderRadius="full"
            px={10}
            _hover={{ bg: "#1a958e" }}
            {...props} 
        >
            {label}
        </Button>
    );
};