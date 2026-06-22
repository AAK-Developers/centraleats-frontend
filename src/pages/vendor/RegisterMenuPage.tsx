import { VStack, Input, Textarea, Text, Box, SimpleGrid, Flex } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { WaveLayout } from '../../components/layout/WaveLayout';
import { AppContainer } from '../../components/layout/AppContainer';
import { AuthHeader } from '../../components/organisms/AuthHeader';
import { ImageUploadBox } from "../../components/atoms/ImageUploadBox";
import { AppButton } from "../../components/atoms/AppButton";
import CentralEats from "../../assets/CentralEats.png";
import { FormCard } from "../../components/molecules/FormCard";

export default function RegisterMenuPage() {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data: Record<string, unknown>) => {
        try {
            console.log("Datos del plato:", data);
            toast.success("¡Plato publicado con éxito!");
            navigate("/vendor-dashboard");
        } catch {
            toast.error("Error al publicar el plato");
        }
    };

    return (
        <WaveLayout>
            <AppContainer>
                <AuthHeader logoImage={CentralEats} logoSize="300px" />

                <VStack gap={2} mb={6} textAlign="center">
                    <Text color="#042E63" fontSize="lg">Personaliza el menú que vas a promocionar</Text>
                </VStack>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormCard>
                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
                            <Box>
                                <Text fontWeight="bold" color="#042E63" fontSize="lg" mb={4}>
                                    Paso 1: Foto y Nombre
                                </Text>
                                <ImageUploadBox label="Sube una foto atractiva del plato" onFileSelect={(f) => console.log(f)} />
                                <Input {...register("name", { required: true })} placeholder="Nombre del Plato (ej. Hamburguesa Especial)" mt={4} fontSize="lg" />
                            </Box>

                            <Box>
                                <Text fontWeight="bold" color="#042E63" fontSize="lg" mb={4}>
                                    Paso 2: Detalles y Precio
                                </Text>
                                <VStack gap={4}>
                                    <Textarea {...register("description", { required: true })} placeholder="Descripción e Ingredientes" minH="120px" fontSize="lg" />
                                    <Input {...register("price", { required: true })} placeholder="Precio" type="number" fontSize="lg" />
                                    <Input {...register("category", { required: true })} placeholder="Categoría (Opcional)" fontSize="lg" />
                                </VStack>
                            </Box>
                        </SimpleGrid>
                        <Flex justify="center" mt={8}>
                            <AppButton
                                text="Publicar Plato"
                                isLoading={isSubmitting}
                                fontSize="lg"
                            />
                        </Flex>
                    </FormCard>
                </form>
            </AppContainer>
        </WaveLayout>
    );
}