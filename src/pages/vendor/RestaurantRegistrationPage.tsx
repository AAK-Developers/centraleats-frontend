import { VStack, Text, Input, Box, SimpleGrid, Flex } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import { apiClient } from '../../api/axiosConfig';
import { WaveLayout } from '../../components/layout/WaveLayout';
import { AppContainer } from '../../components/layout/AppContainer';
import { AuthHeader } from '../../components/organisms/AuthHeader';
import CentralEats from "../../assets/CentralEats.png";
import { ImageUploadBox } from "../../components/atoms/ImageUploadBox";
import { TimeRangeInput } from "../../components/molecules/TimeRangeInput";
import { AppButton } from "../../components/atoms/AppButton";
import { FormCard } from "../../components/molecules/FormCard";

export default function RestaurantRegistrationPage() {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm();
    const navigate = useNavigate();
    const { user } = useUser();

    const onSubmit = async (data: Record<string, unknown>) => {
        try {
            await apiClient.post('/api/restaurants/register', {
                ...data,
                ownerClerkId: user?.id
            });

            toast.success("¡Restaurante registrado con éxito!");
            navigate("/register-menu");
        } catch (error) {
            console.error("Error al registrar:", error);
            toast.error("Hubo un error al registrar el restaurante");
        }
    };

    return (
        <WaveLayout>
            <AppContainer>
                <AuthHeader logoImage={CentralEats} logoSize="300px" />

                <VStack gap={2} mb={6} textAlign="center">
                    <Text color="#042E63" fontSize="lg">
                        Crea tu perfil para continuar con la experiencia
                    </Text>
                </VStack>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormCard>
                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                            <Box>
                                <Text
                                    fontWeight="bold"
                                    color="#042E63"
                                    fontSize="lg"
                                    mb={3}
                                >
                                    Paso 1: Información Básica
                                </Text>

                                <VStack gap={3} w="full">
                                    <Input
                                        {...register("name", { required: true })}
                                        placeholder="Nombre del Restaurante"
                                        fontSize="lg"
                                    />

                                    <Input
                                        {...register("cuisineType", { required: true })}
                                        placeholder="Tipo de cocina (ej. Almuerzos, Pizza)"
                                        fontSize="lg"
                                    />

                                    <Input
                                        {...register("address", { required: true })}
                                        placeholder="Dirección Completa"
                                        fontSize="lg"
                                    />

                                    <Input
                                        {...register("phone", { required: true })}
                                        placeholder="Teléfono de contacto"
                                        fontSize="lg"
                                    />
                                </VStack>
                            </Box>

                            <VStack align="stretch" gap={6}>
                                <Box>
                                    <Text
                                        fontWeight="bold"
                                        color="#042E63"
                                        fontSize="lg"
                                        mb={3}
                                    >
                                        Paso 2: Imagen
                                    </Text>

                                    <ImageUploadBox
                                        label="Sube la foto principal del plato"
                                        onFileSelect={(f) => console.log(f)}
                                    />
                                </Box>
                                <Box>
                                    <Text
                                        fontWeight="bold"
                                        color="#042E63"
                                        fontSize="lg"
                                        mb={3}
                                    >
                                        Paso 3: Horarios
                                    </Text>

                                    <TimeRangeInput register={register} />

                                    <Input
                                        {...register("deliveryTime", { required: true })}
                                        placeholder="Tiempo estimado (minutos)"
                                        fontSize="lg"
                                        mt={3}
                                        type="number"
                                    />
                                </Box>
                            </VStack>
                        </SimpleGrid>

                        <Flex justify="center" mt={8}>
                            <AppButton
                                text="Registrar Restaurante"
                                fontSize="lg"
                                isLoading={isSubmitting}
                            />
                        </Flex>
                    </FormCard>
                </form>
            </AppContainer>
        </WaveLayout>
    );
}