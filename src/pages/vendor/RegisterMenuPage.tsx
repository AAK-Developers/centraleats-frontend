import { VStack, Input, Textarea, Text, Box, SimpleGrid, Flex } from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

import { WaveLayout } from '../../components/layout/WaveLayout';
import { AppContainer } from '../../components/layout/AppContainer';

import { ImageUploadBox } from "../../components/restaurant/atoms/RestaurantImageUploadBox";
import { AppButton } from "../../components/restaurant/atoms/RestaurantAppButton";
import CentralEats from "../../assets/CentralEats.png";
import { FormCard } from "../../components/restaurant/molecules/FormCard";
import { apiClient } from "../../api/axiosConfig";
import { AuthHeader } from "../../components/shared/organisms/AuthHeader";
import type { VendorProduct } from "../../components/restaurant/types/vendor.types";

interface MenuFormData {
    name: string;
    description: string;
    price: number;
    categoryId: string;
    image?: File;
}

type EditableProduct = VendorProduct & { categoryId?: string };

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
    const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm<MenuFormData>();
    const navigate = useNavigate();
    const location = useLocation();

    const editingProduct = (location.state as { product?: EditableProduct } | null)?.product;
    const isEditMode = !!editingProduct;

    useEffect(() => {
        if (editingProduct?.categoryId) {
            setValue("categoryId", editingProduct.categoryId);
        }
    }, []);

    const onSubmit = async (data: MenuFormData) => {
        try {
            const formData = new FormData();

            formData.append('name', data.name);
            formData.append('description', data.description);
            formData.append('price', String(Math.round(Number(data.price) * 100)));
            formData.append('stock', '999');
            if (data.categoryId) {
                formData.append('categoryId', data.categoryId);
            }

            formData.append('isAvailable', 'true');
            formData.append('isActive', 'true');

            if (data.image instanceof File) {
                formData.append('image', data.image);
            }

            if (isEditMode && editingProduct) {
                await apiClient.put(`/api/products/${editingProduct.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success("¡Plato actualizado!");
            } else {
                await apiClient.post('/api/products', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success("¡Plato publicado!");
            }

            navigate("/vendor-dashboard");
        } catch (error) {
            const err = error as { response?: { data?: unknown } };
            console.error('Error detallado:', err.response?.data);
            toast.error(isEditMode ? "Error al actualizar el plato" : "Error al publicar el plato");
        }
    };

    return (
        <WaveLayout>
            <AppContainer>
                <AuthHeader logoImage={CentralEats} logoSize="300px" />

                <VStack gap={2} mb={6} textAlign="center">
                    <Text color="#042E63" fontSize="lg">
                        {isEditMode
                            ? "Edita los detalles de tu plato"
                            : "Personaliza el menú que vas a promocionar"}
                    </Text>
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
                                    initialPreviewUrl={editingProduct?.imageUrl}
                                    onFileSelect={(file) => setValue("image", file, { shouldValidate: true })}
                                />
                                <Input
                                    {...register("name", { required: true })}
                                    defaultValue={editingProduct?.name}
                                    placeholder="Nombre del Plato (ej. Hamburguesa Especial)"
                                    mt={4}
                                    fontSize="lg"
                                />
                            </Box>

                            <Box>
                                <Text fontWeight="bold" color="#042E63" fontSize="lg" mb={4}>
                                    Paso 2: Detalles y Precio
                                </Text>
                                <VStack gap={4}>
                                    <Textarea
                                        {...register("description", { required: true })}
                                        defaultValue={editingProduct?.description}
                                        placeholder="Descripción e Ingredientes"
                                        minH="120px"
                                        fontSize="lg"
                                    />
                                    <Input
                                        {...register("price", { required: true })}
                                        defaultValue={editingProduct ? (editingProduct.price / 100).toFixed(2) : undefined}
                                        placeholder="Precio (ej. 3.50)"
                                        type="number"
                                        step="any"
                                        fontSize="lg"
                                    />
                                    <Box w="full">
                                        <select
                                            {...register("categoryId", { required: !isEditMode })}
                                            defaultValue={editingProduct?.categoryId ?? ""}
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
                                            <option value="">
                                                {isEditMode ? "Mantener categoría actual" : "Selecciona una categoría"}
                                            </option>

                                            {CATEGORIES.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                        {isEditMode && (
                                            <Text fontSize="xs" color="gray.400" mt={1}>
                                                Solo selecciona una categoría si quieres cambiarla.
                                            </Text>
                                        )}
                                    </Box>
                                </VStack>
                            </Box>
                        </SimpleGrid>
                        <Flex justify="center" mt={8}>
                            <AppButton
                                text={
                                    isSubmitting
                                        ? (isEditMode ? "Guardando..." : "Publicando...")
                                        : (isEditMode ? "Guardar Cambios" : "Publicar Plato")
                                }
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
