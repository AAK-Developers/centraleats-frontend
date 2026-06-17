import { Box, Container } from "@chakra-ui/react";

interface AppContainerProps {
    children: React.ReactNode;
}

export const AppContainer = ({ children }: AppContainerProps) => {
    return (
        <Container
            maxW="container.xl"
            py={8}
            px={{ base: 4, md: 8 }}
            minH="80vh"
        >
            <Box
                w="full"
            >
                {children}
            </Box>
        </Container>
    );
};