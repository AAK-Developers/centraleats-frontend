import { useState } from 'react';
import { VStack, Text } from '@chakra-ui/react';
import toast from "react-hot-toast";
import { FaGraduationCap } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

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