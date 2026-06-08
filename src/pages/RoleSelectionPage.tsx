import { useState } from 'react';
import { Flex, VStack, Text, Box, Button, Image } from '@chakra-ui/react';
import toast from "react-hot-toast";
import { FaGraduationCap, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

import { apiClient } from '../api/axiosConfig';
import { WaveLayout } from '../components/layout/WaveLayout';
import CentralEatsLogo from '../assets/CentralEatsLogo.png';

export default function RoleSelectionPage() {
    const navigate = useNavigate();
    const { user } = useUser();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSelection = async (role: 'student' | 'vendor') => {
        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            await apiClient.post('/api/users/update-role', {
                role,
                clerkId: user?.id,
            });

            toast.success("Rol asignado con éxito");

            navigate(
                role === "student"
                    ? "/student-dashboard"
                    : "/vendor-dashboard"
            );

        } catch (error) {
            console.error("Error al asignar rol:", error);
            toast.error("Hubo un error al asignar el rol");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <WaveLayout>
            <Flex minH="100vh" align="center" justify="center" p="4" bg="white" direction="column">

                <VStack gap="8" w="full" maxW="md">

                    <VStack gap="0" w="full" mt="-100px">
                        <Image
                            src={CentralEatsLogo}
                            alt="CentralEatsLogo"
                            boxSize="250px"
                            objectFit="contain"
                        />

                        <Text fontSize="4xl" fontWeight="bold">
                            <Text as="span" color="#042E63">¡Bienvenido a Central</Text>
                            <Text as="span" color="#E65100">Eats!</Text>
                        </Text>

                        <Text color="gray.600">
                            Por favor, selecciona tu entorno de interacción:
                        </Text>
                    </VStack>

                    <Box w="full" p="6" borderWidth="1px" borderRadius="xl" shadow="md">
                        <VStack gap="4">
                            <Box p="4" bg="#b0f3f8" borderRadius="full">
                                <FaGraduationCap size="30px" color="#30B2BC" />
                            </Box>

                            <Text fontWeight="bold">Entorno Estudiante</Text>

                            <Text fontSize="sm" color="gray.500" textAlign="center">
                                Busca locales, revisa menús y realiza tus pedidos.
                            </Text>

                            <Button
                                variant="outline"
                                borderColor="#042E63"
                                color="#042E63"
                                borderRadius="full"
                                px="6"
                                py="5"
                                display="flex"
                                alignItems="center"
                                gap="3"
                                _hover={{ bg: "#042E63", color: "white" }}
                                onClick={() => handleSelection('student')}
                                loading={isSubmitting}
                                loadingText="Procesando..."
                            >
                                Continuar
                                <Box as={FaArrowRight} boxSize="25px" />
                            </Button>
                        </VStack>
                    </Box>

                    <Box w="full" p="6" borderWidth="1px" borderRadius="xl" shadow="md">
                        <VStack gap="4">
                            <Box p="4" bg="#fad4a7" borderRadius="full">
                                <FaGraduationCap size="30px" color="#FFA83F" />
                            </Box>

                            <Text fontWeight="bold">Panel de Vendedor</Text>

                            <Text fontSize="sm" color="gray.500" textAlign="center">
                                Gestiona tus platos en tiempo real, recibe pedidos y despacha comida.
                            </Text>

                            <Button
                                variant="outline"
                                borderColor="#042E63"
                                color="#042E63"
                                borderRadius="full"
                                px="6"
                                py="5"
                                display="flex"
                                alignItems="center"
                                gap="3"
                                _hover={{ bg: "#042E63", color: "white" }}
                                onClick={() => handleSelection('vendor')}
                                loading={isSubmitting}
                                loadingText="Procesando..."
                            >
                                Continuar
                                <Box as={FaArrowRight} boxSize="25px" />
                            </Button>
                        </VStack>
                    </Box>

                </VStack>
            </Flex>
        </WaveLayout>
    );
}