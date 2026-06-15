import { Box, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface FormSectionProps {
    title: string;
    children: ReactNode;
}

export const FormSection = ({ title, children }: FormSectionProps) => {
    return (
        <Box w="full">
            <Text
                fontWeight="bold"
                color="#042E63"
                textAlign="center"
                mb={2}
            >
                {title}
            </Text>
            {children}
        </Box>
    );
};