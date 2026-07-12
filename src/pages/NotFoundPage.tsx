import { Box, Button, Center, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <Center h="100vh" w="100vw" bg="gray.50" p={4}>
            <VStack gap={6} maxW="400px" textAlign="center">
                <Box>
                    <Text fontSize="6xl" fontWeight="black" color="primaryOrange" lineHeight="1">
                        404
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold" color="primaryBlue" mt={2}>
                        Página no encontrada
                    </Text>
                </Box>

                <Text color="gray.600" fontSize="md">
                    Lo sentimos, la página que estás buscando no existe o ha sido movida.
                </Text>

                <Button
                    leftIcon={<FaHome />}
                    colorScheme="orange"
                    bg="#E65100"
                    color="white"
                    _hover={{ bg: "#cc4800" }}
                    size="lg"
                    w="full"
                    onClick={() => navigate("/")}
                >
                    Volver al inicio
                </Button>
            </VStack>
        </Center>
    );
}
