// src/pages/RoleSelectionPage.tsx
import { Flex, VStack, Heading, Text, Box, Button } from '@chakra-ui/react'

export default function RoleSelectionPage() {
    const handleSelection = (role: 'student' | 'vendor') => {
        console.log(`Seleccionado: ${role}`)
        // Aquí integraremos userService.updateUserRole(role) cuando tengas el endpoint
    }

    return (
        <Flex minH="100vh" align="center" justify="center" p="4" bg="white" direction="column">
            <VStack gap="8" w="full" maxW="md">
                <VStack gap="2">
                    <Heading color="primary.blue" size="lg">¡Bienvenido a CentralEats!</Heading>
                    <Text color="gray.600">Por favor, selecciona tu entorno de interacción:</Text>
                </VStack>

                <Box w="full" p="6" borderWidth="1px" borderRadius="lg" shadow="sm">
                    <VStack gap="4">
                        <Text fontWeight="bold">Entorno Estudiante</Text>
                        <Text fontSize="sm" color="gray.500" textAlign="center">
                            Busca locales, revisa menús y realiza tus pedidos.
                        </Text>
                        <Button w="full" colorScheme="blue" onClick={() => handleSelection('student')}>
                            Continuar →
                        </Button>
                    </VStack>
                </Box>

                <Box w="full" p="6" borderWidth="1px" borderRadius="lg" shadow="sm">
                    <VStack gap="4">
                        <Text fontWeight="bold">Panel de Vendedor</Text>
                        <Text fontSize="sm" color="gray.500" textAlign="center">
                            Gestiona tus platos en tiempo real, recibe pedidos y despacha comida.
                        </Text>
                        <Button w="full" colorScheme="orange" onClick={() => handleSelection('vendor')}>
                            Continuar →
                        </Button>
                    </VStack>
                </Box>
            </VStack>
        </Flex>
    )
}