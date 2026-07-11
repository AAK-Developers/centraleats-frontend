import { Flex, Image, Text, Box } from "@chakra-ui/react";
import logoUrl from "../../../assets/CentralEatsLogo.png";

interface SplashScreenProps {
    fadeOut?: boolean;
}

export const SplashScreen = ({ fadeOut = false }: SplashScreenProps) => {
    return (
        <Flex
            position="fixed"
            inset="0"
            w="100vw"
            h="100vh"
            bg="white"
            direction="column"
            align="center"
            justify="center"
            zIndex="9999"
            opacity={fadeOut ? 0 : 1}
            transition="opacity 0.6s ease"
            pointerEvents={fadeOut ? "none" : "auto"}
        >
            <style>
                {`
        @keyframes splashLogoIn {
          0% { transform: scale(0.85); opacity: 0; }
          60% { transform: scale(1.03); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes splashGlow {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 1; }
        }
        @keyframes splashTextIn {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        `}
            </style>

            <Flex flex="1" align="center" justify="center" direction="column" gap={5}>
                <Box
                    position="relative"
                    animation="splashLogoIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards"
                >
                    <Box
                        position="absolute"
                        inset="-16px"
                        borderRadius="full"
                        bg="radial-gradient(circle, rgba(230,81,0,0.16) 0%, rgba(230,81,0,0) 70%)"
                        animation="splashGlow 2.2s ease-in-out infinite"
                    />
                    <Image
                        src={logoUrl}
                        alt="CentralEats Logo"
                        w="108px"
                        h="108px"
                        objectFit="contain"
                        position="relative"
                    />
                </Box>

                <Flex
                    fontFamily="'Plus Jakarta Sans', sans-serif"
                    fontWeight="800"
                    fontSize="26px"
                    letterSpacing="-0.02em"
                    animation="splashTextIn 0.7s ease 0.35s both"
                >
                    <Text as="span" color="#042E63">Central</Text>
                    <Text as="span" color="#E65100">Eats</Text>
                </Flex>
            </Flex>

            <Box pb={8} animation="splashTextIn 0.7s ease 0.55s both">
                <Text fontSize="xs" color="gray.400" fontWeight="medium" letterSpacing="wide">
                    by Amawta Antony Kevin
                </Text>
            </Box>
        </Flex>
    );
};