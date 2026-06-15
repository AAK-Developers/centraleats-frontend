import { useState } from 'react';
import { VStack, Text } from '@chakra-ui/react';
import toast from "react-hot-toast";
import { FaGraduationCap } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

import { apiClient } from '../../api/axiosConfig';
import { WaveLayout } from '../../components/layout/WaveLayout';
import { RoleCard } from '../../components/molecules/RoleCard';
import { AuthHeader } from '../../components/organisms/AuthHeader';
import CentralEatsLogo from "../../assets/CentralEatsLogo.png";
import { AppContainer } from '../../components/layout/AppContainer';


export default function RoleSelectionPage() {
    const navigate = useNavigate();
    const { user } = useUser();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSelection = async (role: 'student' | 'vendor') => {
        if (isSubmitting) return;

        console.log('--- Iniciando selección de rol ---');
        console.log('Rol seleccionado:', role);
        console.log('ID de Clerk (user.id):', user?.id);
        console.log('URL Base de API:', import.meta.env.VITE_API_BASE_URL);

        setIsSubmitting(true);

        try {
            const payload = {
                role,
                clerkId: user?.id,
            };
            console.log('Enviando POST a /api/users con payload:', payload);

            const response = await apiClient.post('/api/users', payload);
            
            console.log('Respuesta exitosa del servidor:', response.data);
            
            // Forzar recarga de los datos del usuario en Clerk para obtener los nuevos metadatos
            if (user) {
                console.log('Recargando datos de Clerk...');
                await user.reload();
            }

            toast.success("Rol asignado con éxito");

            navigate(
                role === "student"
                    ? "/student-dashboard"
                    : "/vendor-dashboard"
            );

        } catch (error: unknown) {
            console.error("--- Error detallado al asignar rol ---");
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    // El servidor respondió con un código fuera del rango 2xx
                    console.error("Datos de respuesta del error:", error.response.data);
                    console.error("Status del error:", error.response.status);
                    console.error("Cabeceras de respuesta:", error.response.headers);
                } else if (error.request) {
                    // La petición se hizo pero no hubo respuesta (ej: CORS o servidor caído)
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
                <AuthHeader logoImage={CentralEatsLogo} logoSize="250px">
                    <VStack gap="2" mb="4">
                        <Text fontSize="4xl" fontWeight="bold" textAlign="center">
                            <Text as="span" color="#042E63">¡Bienvenido a Central</Text>
                            <Text as="span" color="#E65100">Eats!</Text>
                        </Text>
                        <Text color="gray.600">
                            Por favor, selecciona tu entorno de interacción:
                        </Text>
                    </VStack>
                    <RoleCard
                        icon={FaGraduationCap}
                        iconBg="#b0f3f8"
                        iconColor="#30B2BC"
                        title="Entorno Estudiante"
                        description="Busca locales, revisa menús y realiza tus pedidos."
                        onClick={() => handleSelection('student')}
                        isLoading={isSubmitting}
                    />
                    <RoleCard
                        icon={FaGraduationCap}
                        iconBg="#fad4a7"
                        iconColor="#FFA83F"
                        title="Panel de Vendedor"
                        description="Gestiona tus platos en tiempo real, recibe pedidos y despacha comida."
                        onClick={() => handleSelection('vendor')}
                        isLoading={isSubmitting}
                    />
                </AuthHeader>
            </AppContainer>
        </WaveLayout>
    );
}