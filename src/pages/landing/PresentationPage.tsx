import { Box, Text, Flex, VStack, Button } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { WaveLayout } from '../../components/layout/WaveLayout'
import { AuthHeader } from '../../components/organisms/AuthHeader'
import { AppContainer } from '../../components/layout/AppContainer'

export default function PresentationPage() {
    const navigate = useNavigate()

    return (
        <WaveLayout >
            <AppContainer>
                <Flex justify="flex-end" align="center" w="full" p={4} gap={4}>
                    <Button
                        bg="transparent"
                        color="#042E63"
                        border="2px solid"
                        borderColor="#042E63"
                        _hover={{ bg: "gray.50" }}
                        size="md"
                        borderRadius="full"
                        onClick={() => navigate('/login')}
                    >
                        Iniciar Sesión
                    </Button>
                    <Button
                        bg="#E65100"
                        color="white"
                        _hover={{ bg: "#cc4800" }}
                        size="md"
                        borderRadius="full"
                        onClick={() => navigate('/register')}
                    >
                        Registrarse
                    </Button>
                </Flex>

                <VStack gap={8} mt={{ base: 10, md: 20 }} flex="1">
                    <AuthHeader logoSize="500px" />
                    <Text fontSize={{ base: "2xl", md: "5xl" }} fontWeight="bold" textAlign="center" color="#042E63">
                        Your Order, Your time <Text as="span" color="#E65100">,Your Pace</Text>
                    </Text>
                </VStack>
                <Box textAlign="center" py={10}>
                    <Text fontSize="sm" color="gray.600">
                        © 2026 CentralEats UCE. Desarrollado por Ingeniería en Sistemas de Información.
                    </Text>
                </Box>
            </AppContainer>
        </WaveLayout>
    )
}