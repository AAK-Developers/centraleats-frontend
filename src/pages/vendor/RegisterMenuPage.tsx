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
import { apiClient } from "../../api/axiosConfig";
import { useUser } from "@clerk/clerk-react";

const CATEGORIES = [
    {
        id: "06542c60-ad6b-4844-b1b1-3ad6d5baf35a",
        name: "Almuerzos"
    },
    {
        id: "b5003928-6d64-417b-8798-2726d16c8cfb",
        name: "Bebidas"
    },
    {
        id: "153a9f76-160d-4895-814d-9831c33088cd",
        name: "Snacks"
    }
];

export default function RegisterMenuPage() {
    const { user } = useUser();
    console.log("ID de usuario de Clerk que estoy enviando:", user?.id);
    const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm();
    const navigate = useNavigate();


    const onSubmit = async (data: Record<string, any>) => {
        try {
            const formData = new FormData();

            if (user?.id) {
                formData.append('vendorId', user.id);
            } else {
                toast.error("Error: No se pudo identificar al usuario.");
                return;
            }

            formData.append('name', data.name);
            formData.append('description', data.description);
            formData.append('price', String(data.price));
            formData.append('categoryId', data.categoryId);

            formData.append('stock', '999');
            formData.append('isAvailable', 'true');
            formData.append('isActive', 'true');

            if (data.image instanceof File) {
                formData.append('image', data.image);
            }

            await apiClient.post('/api/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success("¡Plato publicado!");
            navigate("/vendor-dashboard");
        } catch (error: any) {
            console.error('Error detallado:', error.response?.data);
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
                                <ImageUploadBox
                                    label="Sube una foto atractiva del plato"
                                    onFileSelect={(file) => setValue("image", file, { shouldValidate: true })}
                                />
                                <Input {...register("name", { required: true })} placeholder="Nombre del Plato (ej. Hamburguesa Especial)" mt={4} fontSize="lg" />
                            </Box>

                            <Box>
                                <Text fontWeight="bold" color="#042E63" fontSize="lg" mb={4}>
                                    Paso 2: Detalles y Precio
                                </Text>
                                <VStack gap={4}>
                                    <Textarea {...register("description", { required: true })} placeholder="Descripción e Ingredientes" minH="120px" fontSize="lg" />
                                    <Input {...register("price", { required: true })} placeholder="Precio" type="number" fontSize="lg" />
                                    <Box w="full">
                                        <select
                                            {...register("categoryId", { required: true })}
                                            style={{
                                                width: "100%",
                                                padding: "12px 16px",
                                                borderRadius: "8px",
                                                border: "1px solid #E2E8F0",
                                                fontSize: "18px",
                                                backgroundColor: "white",
                                                outline: "none",
                                            }}
                                        >
                                            <option value="">Selecciona una categoría</option>

                                            {CATEGORIES.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </Box>
                                </VStack>
                            </Box>
                        </SimpleGrid>
                        <Flex justify="center" mt={8}>
                            <AppButton
                                text={isSubmitting ? "Publicando..." : "Publicar Plato"}
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