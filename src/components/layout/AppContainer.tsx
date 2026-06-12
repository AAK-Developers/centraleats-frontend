import { Box, type BoxProps } from "@chakra-ui/react";

interface AppContainerProps extends BoxProps {
    children: React.ReactNode;
}

export const AppContainer = ({ children, ...props }: AppContainerProps) => {
    return (
        <Box
            p={{ base: 4, md: 6 }}
            maxW={{ base: "100%", md: "400px" }}
            mx="auto"
            bg="white"
            borderTopRadius={{ base: "none", md: "3xl" }}
            mt={{ base: 0, md: -8 }}
            minH="100vh"
            boxShadow={{ base: "none", md: "xl" }}
            {...props}
        >
            {children}
        </Box>
    );
};