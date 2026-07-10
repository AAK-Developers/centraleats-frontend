import { Flex, Text, Image, Box } from "@chakra-ui/react";
import logoUrl from "../../../assets/CentralEatsLogo.png";



export const SplashScreen = () => {
    return (
        <Flex
            position="fixed"
            top="0"
            left="0"
            w="100vw"
            h="100vh"
            bg="white"
            direction="column"
            align="center"
            justify="center"
            zIndex="9999"
        >
            <style>
                {`
                @keyframes pulseAnimation {
                    0% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.05); opacity: 1; }
                    100% { transform: scale(1); opacity: 0.8; }
                }
                `}
            </style>
            <Flex flex="1" align="center" justify="center">
                <Box animation="pulseAnimation 2s infinite ease-in-out">
                    <Image src={logoUrl} alt="CentralEats Logo" w="120px" h="120px" objectFit="contain" />
                </Box>
            </Flex>
            <Box pb={8}>
                <Text fontSize="sm" color="gray.500" fontWeight="medium" letterSpacing="wide">
                    by: Amawta Antony Kevin
                </Text>
            </Box>
        </Flex>
    );
};
