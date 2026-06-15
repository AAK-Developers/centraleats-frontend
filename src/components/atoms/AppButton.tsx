import { Button, type ButtonProps, HStack, Icon } from "@chakra-ui/react";
import { HiArrowRight } from "react-icons/hi";

interface AppButtonProps extends ButtonProps {
    text: string;
    isLoading?: boolean;
}

export const AppButton = ({
    text,
    isLoading,
    ...props
}: AppButtonProps) => (
    <Button
        w="full"
        bg="#E65100"
        color="white"
        size="lg"
        borderRadius="full"
        type="submit"
        loading={isLoading}
        _hover={{ bg: "#c54822" }}
        {...props}
    >
        <HStack gap={2}>
            <span>{text}</span>
            <Icon as={HiArrowRight} />
        </HStack>
    </Button>
);