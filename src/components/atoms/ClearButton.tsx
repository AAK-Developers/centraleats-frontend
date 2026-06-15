import { Button, type ButtonProps } from '@chakra-ui/react';


export const ClearButton = (props: ButtonProps) => {
    return (
        <Button
            size="sm"
            bg="#30B2BC"
            color="white"
            borderRadius="full"
            _hover={{ bg: "#2898a0" }}
            {...props}
        />
    );
};