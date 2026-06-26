import { Box, Flex, Text, Button } from "@chakra-ui/react";

interface ConflictDialogProps {
    isOpen: boolean;
    currentVendorName: string;
    newVendorName: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConflictDialog({
    isOpen,
    currentVendorName,
    newVendorName,
    onConfirm,
    onCancel,
}: ConflictDialogProps) {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <Box
                position="fixed"
                inset={0}
                bg="blackAlpha.500"
                backdropFilter="blur(4px)"
                zIndex={1000}
                onClick={onCancel}
            />

            {/* Modal */}
            <Box
                position="fixed"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                bg="white"
                borderRadius="2xl"
                p={{ base: 5, md: 6 }}
                zIndex={1001}
                maxW={{ base: "320px", sm: "400px" }}
                w="calc(100% - 32px)"
                boxShadow="2xl"
            >
                <Text
                    fontSize={{ base: "md", md: "lg" }}
                    fontWeight="bold"
                    color="#042E63"
                    mb={2}
                >
                    ¿Cambiar restaurante?
                </Text>

                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" mb={5}>
                    Tu carrito tiene platos de{" "}
                    <Text as="strong">{currentVendorName}</Text>. Si agregas de{" "}
                    <Text as="strong">{newVendorName}</Text>, se vaciará el carrito.
                </Text>

                <Flex
                    gap={3}
                    justify="flex-end"
                    direction={{ base: "column-reverse", sm: "row" }}
                >
                    <Button
                        variant="ghost"
                        borderRadius="xl"
                        onClick={onCancel}
                        size={{ base: "sm", md: "sm" }}
                        w={{ base: "full", sm: "auto" }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        bg="#042E63"
                        color="white"
                        borderRadius="xl"
                        _hover={{ bg: "#031F44" }}
                        onClick={onConfirm}
                        size={{ base: "sm", md: "sm" }}
                        w={{ base: "full", sm: "auto" }}
                    >
                        Sí, cambiar
                    </Button>
                </Flex>
            </Box>
        </>
    );
}
