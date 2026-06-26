import { Box, Text, Image } from "@chakra-ui/react";
import { useRef, useState, type ChangeEvent } from "react";

interface ImageUploadBoxProps {
    label: string;
    onFileSelect: (file: File) => void;
}

export const ImageUploadBox = ({ label, onFileSelect }: ImageUploadBoxProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleBoxClick = () => fileInputRef.current?.click();

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            onFileSelect(file);

            // Crear una URL temporal para previsualizar la imagen
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
        }
    };

    return (
        <Box
            border="2px dashed #042E63"
            p={6}
            borderRadius="lg"
            textAlign="center"
            cursor="pointer"
            onClick={handleBoxClick}
            _hover={{ bg: "gray.50" }}
            transition="background 0.2s"
        >
            {preview ? (
                <Image src={preview} alt="Preview" maxH="150px" mx="auto" />
            ) : (
                <Text fontSize="xl" color="gray.500">{label}</Text>
            )}

            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept="image/*"
            />
        </Box>
    );
};