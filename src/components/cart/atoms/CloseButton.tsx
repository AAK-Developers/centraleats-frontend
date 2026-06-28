import { IconButton, type IconButtonProps } from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";

interface CloseButtonProps extends Omit<IconButtonProps, 'aria-label'> {
    onClick: () => void;
}

export const CloseButton = ({ onClick, ...props }: CloseButtonProps) => {
    return (
        <IconButton
            aria-label="Cerrar panel"
            variant="ghost"
            borderRadius="full"
            size="sm"
            onClick={onClick}
            _hover={{ bg: "gray.100" }}
            {...props}
        >
            <FaTimes />
        </IconButton>
    );
};