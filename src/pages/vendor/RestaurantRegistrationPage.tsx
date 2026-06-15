import { VStack, Text, Input } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import { apiClient } from '../../api/axiosConfig';
import { WaveLayout } from '../../components/layout/WaveLayout';
import { AppContainer } from '../../components/layout/AppContainer';
import { AuthHeader } from '../../components/organisms/AuthHeader';
import CentralEats from "../../assets/CentralEats.png";
import { FormSection } from "../../components/molecules/FormSection";
import { ImageUploadBox } from "../../components/atoms/ImageUploadBox";
import { TimeRangeInput } from "../../components/molecules/TimeRangeInput";
import { AppButton } from "../../components/atoms/AppButton";

export default function RestaurantRegistrationPage() {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm();
    const navigate = useNavigate();
    const { user } = useUser();

    const onSubmit = async (data: any) => {
        try {
            await apiClient.post('/api/restaurants/register', {
                ...data,
                ownerClerkId: user?.id
            });

            toast.success("¡Restaurante registrado con éxito!");
            navigate("/vendor-dashboard");
        } catch (error) {
            console.error("Error al registrar:", error);
            toast.error("Hubo un error al registrar el restaurante");
        }
    };

    return (
        <WaveLayout>
            <AppContainer>
                <AuthHeader logoImage={CentralEats} logoSize="200px" />

                <VStack gap={2} mb={6} textAlign="center">
                    <Text color="#042E63" fontSize="md">
                        Crea tu perfil para continuar con la experiencia
                    </Text>
                </VStack>

                <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
                    <VStack gap={6} w="full" px={4} pb={8}>
                        <FormSection title="Paso 1: Información Básica">
                            <Input {...register("name", { required: true })} placeholder="Nombre del Restaurante" mb={3} />
                            <Input {...register("cuisineType", { required: true })} placeholder="Tipo de cocina (ej. Almuerzos, Pizza)" mb={3} />
                            <Input {...register("address", { required: true })} placeholder="Dirección Completa" mb={3} />
                            <Input {...register("phone", { required: true })} placeholder="Teléfono de contacto" />
                        </FormSection>

                        <FormSection title="Paso 2: Carga de Logo">
                            <ImageUploadBox
                                label="Sube la foto principal de tu Restaurante"
                                onFileSelect={(file) => {
                                    console.log("Archivo seleccionado:", file);
                                }}
                            />
                        </FormSection>

                        <FormSection title="Paso 3: Horarios">
                            <TimeRangeInput register={register} />
                            <Input
                                {...register("deliveryTime", { required: true })}
                                placeholder="Tiempo estimado (minutos)"
                                mt={3}
                                type="number"
                            />
                        </FormSection>

                        <AppButton
                            text="Registrar Restaurante"
                            isLoading={isSubmitting}
                        />
                    </VStack>
                </form>
            </AppContainer>
        </WaveLayout>
    );
}