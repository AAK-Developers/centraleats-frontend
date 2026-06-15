
import { Box, Text } from "@chakra-ui/react";
import { useRef, type ChangeEvent } from "react";

interface ImageUploadBoxProps {
    label: string;
    onFileSelect: (file: File) => void;
}

export const ImageUploadBox = ({ label, onFileSelect }: ImageUploadBoxProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleBoxClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            onFileSelect(event.target.files[0]);
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
            <Text fontSize="sm" color="gray.500">{label}</Text>
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