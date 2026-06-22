import { useState } from 'react';
import { VStack, Text } from '@chakra-ui/react';
import toast from "react-hot-toast";
import { SimpleGrid } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { apiClient } from '../../api/axiosConfig';

import { WaveLayout } from '../../components/layout/WaveLayout';
import { RoleCard } from '../../components/molecules/RoleCard';
import { AuthHeader } from '../../components/organisms/AuthHeader';
import CentralEatsLogo from "../../assets/CentralEatsLogo.png";
import { AppContainer } from '../../components/layout/AppContainer';
import studentImg from '../../assets/Student.png';
import vendorImg from '../../assets/Vendor.jpg';


import { useAuthMe } from '../../hooks/useAuthMe';


export default function RoleSelectionPage() {
    const navigate = useNavigate();
    const { user } = useUser();
    const { fetchProfile } = useAuthMe();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSelection = async (role: 'student' | 'vendor') => {
        if (isSubmitting) return;

        console.log('--- Iniciando selección de rol ---');
        console.log('Rol seleccionado:', role);
        console.log('ID de Clerk (user.id):', 'Privado ########');
        console.log('URL Base de API:', import.meta.env.VITE_API_BASE_URL);

        setIsSubmitting(true);

        try {
            const payload = {
                role,
                clerkId: user?.id,
            };
            console.log('Enviando POST a /api/users con payload:', payload);

            await apiClient.post('/api/users', payload);

            console.log('Respuesta exitosa del servidor:', 'No se muestra response.data por seguirdad'/*response.data*/);

            if (user) {
                console.log('Recargando datos de Clerk...');
                await user.reload();
            }

            console.log('Sincronizando perfil con el backend...');
            await fetchProfile().catch(() => console.error("Error al sincronizar perfil tras selección"));

            toast.success("Rol asignado con éxito");

            navigate(
                role === "student"
                    ? "/student-dashboard"
                    : "/register-restaurant"
            );

        } catch (error: unknown) {
            console.error("--- Error detallado al asignar rol ---");
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.error("Datos de respuesta del error:", error.response.data);
                    console.error("Status del error:", error.response.status);
                    console.error("Cabeceras de respuesta:", error.response.headers);
                } else if (error.request) {
                    console.error("No hubo respuesta del servidor. Error de red o CORS.");
                    console.log(error.request);
                }
            } else {
                const message = error instanceof Error ? error.message : "Error desconocido";
                console.error("Error al configurar la petición:", message);
            }
            toast.error("Hubo un error al asignar el rol");
        } finally {
            setIsSubmitting(false);
            console.log('--- Fin del proceso de selección ---');
        }
    };

    return (
        <WaveLayout>
            <AppContainer>
                <AuthHeader logoImage={CentralEatsLogo} logoSize="300px">
                    <VStack gap={4} mt={-12}>
                        <Text fontSize="6xl" fontWeight="bold" textAlign="center">
                            <Text as="span" color="#042E63">¡Bienvenido a Central</Text>
                            <Text as="span" color="#E65100">Eats!</Text>
                        </Text>
                        <Text color="gray.600">
                            Por favor, selecciona tu entorno de interacción:
                        </Text>
                    </VStack>
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={8} w="full" px={{ base: 4, md: 0 }}>
                        <RoleCard
                            bgImage={studentImg}
                            subtitle="Diviértete y Disfruta"
                            title="Pide con Nosotros"
                            description="Regístrate como estudiante"
                            onClick={() => handleSelection('student')}
                            isLoading={isSubmitting}
                        />
                        <RoleCard
                            bgImage={vendorImg}
                            subtitle="Emprende y Gana"
                            title="Trabaja con Nosotros"
                            description="Regístrate como restaurante"
                            onClick={() => handleSelection('vendor')}
                            isLoading={isSubmitting}
                        />
                    </SimpleGrid>
                </AuthHeader>
            </AppContainer>
        </WaveLayout>
    );
}