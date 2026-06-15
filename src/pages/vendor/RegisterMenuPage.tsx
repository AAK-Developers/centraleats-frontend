import { VStack, Input, Textarea, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { WaveLayout } from '../../components/layout/WaveLayout';
import { AppContainer } from '../../components/layout/AppContainer';
import { AuthHeader } from '../../components/organisms/AuthHeader';
import { FormSection } from "../../components/molecules/FormSection";
import { ImageUploadBox } from "../../components/atoms/ImageUploadBox";
import { AppButton } from "../../components/atoms/AppButton";
import CentralEats from "../../assets/CentralEats.png";

export default function RegisterMenuPage() {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data: Record<string, unknown>) => {
        try {
            // Here you will call your final dish creation point
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
                <AuthHeader logoImage={CentralEats} logoSize="200px" />

                <VStack gap={2} mb={6} textAlign="center">
                    <Text color="#042E63" fontSize="md">Personaliza el menú que más a promocionar</Text>
                </VStack>

                <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
                    <VStack gap={6} w="full" px={4} pb={8}>

                        <FormSection title="Paso 1: Foto y Nombre (Obligatorio)">
                            <ImageUploadBox label="Foto atractiva del Plato" onFileSelect={(f) => console.log(f)} />
                            <Input {...register("name")} placeholder="Nombre del Plato (ej. Hamburguesa Tuka)" mt={3} />
                        </FormSection>

                        <FormSection title="Paso 2: Detalles y Precio">
                            <Textarea {...register("description")} placeholder="Descripción e Ingredientes" mb={3} />
                            <Input {...register("price")} placeholder="Precio" type="number" mb={3} />
                            <Input {...register("category")} placeholder="Categoría (Opcional)" />
                        </FormSection>

                        <AppButton
                            text="Publicar Plato"
                            isLoading={isSubmitting}
                        />
                    </VStack>
                </form>
            </AppContainer>
        </WaveLayout>
    );
}