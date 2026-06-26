import { Box } from "@chakra-ui/react";

export const FormCard = ({ children }: { children: React.ReactNode }) => (
    <Box
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="xl"
        p={8}
        w="100%"
        maxW="900px"
        mx="auto"
        boxShadow="lg"
    >
        {children}
    </Box>
);