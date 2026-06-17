// src/components/atoms/SubtitleTag.tsx
import { Text, type TextProps } from "@chakra-ui/react";

export const SubtitleTag = ({ children, ...props }: TextProps) => {
    return (
        <Text
            bg="white"
            color="#042E63"
            px="8"
            py="1"
            borderRadius="md"
            fontSize="xl"
            fontWeight="bold"
            display="inline-block"
            {...props}
        >
            {children}
        </Text>
    );
};