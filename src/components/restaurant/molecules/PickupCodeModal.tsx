import { useEffect, useRef, useState } from "react";
import { Box, Flex, Text, HStack, VStack, Icon, Button } from "@chakra-ui/react";
import { HiKey, HiExclamationCircle } from "react-icons/hi";

interface PickupCodeModalProps {
    isOpen: boolean;
    vendorOrderLabel: string; 
    onConfirm: (code: string) => void;
    onCancel: () => void;
    error?: string;
    isSubmitting?: boolean;
}

export const PickupCodeModal = ({
    isOpen,
    vendorOrderLabel,
    onConfirm,
    onCancel,
    error,
    isSubmitting = false,
}: PickupCodeModalProps) => {
    const [code, setCode] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setCode("");
            const t = setTimeout(() => inputRef.current?.focus(), 50);
            return () => clearTimeout(t);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const digitsOnly = (v: string) => v.replace(/\D/g, "").slice(0, 4);
    const isComplete = code.length === 4;

    const handleConfirm = () => {
        if (!isComplete || isSubmitting) return;
        onConfirm(code);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleConfirm();
    };

    return (
        <>
            <Box
                position="fixed"
                inset={0}
                bg="blackAlpha.600"
                backdropFilter="blur(3px)"
                zIndex={1500}
                onClick={onCancel}
            />

            <Flex
                position="fixed"
                inset={0}
                zIndex={1501}
                align="center"
                justify="center"
                p={4}
                onClick={onCancel}
                pointerEvents="none"
            >
                <Box
                    onClick={(e) => e.stopPropagation()}
                    pointerEvents="auto"
                    bg="white"
                    borderRadius="2xl"
                    boxShadow="0 24px 60px rgba(4,46,99,0.25)"
                    w="full"
                    maxW="380px"
                    position="relative"
                    overflow="hidden"
                >
                    <Box h="5px" w="full" bg="linear-gradient(90deg, #2DC6B8 0%, #042E63 100%)" />

                    <Box p={{ base: 5, md: 6 }}>
                        <VStack gap={4} align="stretch">
                            <HStack gap={3} align="center">
                                <Flex
                                    w="44px"
                                    h="44px"
                                    borderRadius="xl"
                                    bg="#F0FBFC"
                                    align="center"
                                    justify="center"
                                    flexShrink={0}
                                >
                                    <Icon as={HiKey} color="#2DC6B8" boxSize={6} />
                                </Flex>
                                <Box>
                                    <Text fontWeight="bold" fontSize="md" color="#042E63" lineHeight="1.2">
                                        Código de retiro
                                    </Text>
                                    <Text fontSize="xs" color="gray.400">
                                        {vendorOrderLabel}
                                    </Text>
                                </Box>
                            </HStack>

                            <Text fontSize="sm" color="gray.600">
                                Ingresa el código de 4 dígitos proporcionado por el estudiante para confirmar la entrega.
                            </Text>

                            <Box>
                                <input
                                    ref={inputRef}
                                    inputMode="numeric"
                                    maxLength={4}
                                    value={code}
                                    onChange={(e) => setCode(digitsOnly(e.target.value))}
                                    onKeyDown={handleKeyDown}
                                    placeholder="••••"
                                    style={{
                                        width: "100%",
                                        padding: "14px",
                                        textAlign: "center",
                                        fontSize: "28px",
                                        fontWeight: 700,
                                        letterSpacing: "12px",
                                        borderRadius: "14px",
                                        border: `2px solid ${error ? "#E53E3E" : "#E2E8F0"}`,
                                        outline: "none",
                                        color: "#042E63",
                                        backgroundColor: "#FAFBFC",
                                        boxShadow: error ? "0 0 0 3px rgba(229,62,62,0.12)" : "none",
                                        transition: "all 0.15s ease",
                                    }}
                                    onFocus={(e) => {
                                        if (!error) {
                                            e.target.style.borderColor = "#2DC6B8";
                                            e.target.style.boxShadow = "0 0 0 3px rgba(45,198,184,0.15)";
                                        }
                                    }}
                                    onBlur={(e) => {
                                        if (!error) {
                                            e.target.style.borderColor = "#E2E8F0";
                                            e.target.style.boxShadow = "none";
                                        }
                                    }}
                                />
                                {error && (
                                    <Flex align="center" gap={1.5} mt={2} px={1}>
                                        <Icon as={HiExclamationCircle} color="red.500" boxSize={4} flexShrink={0} />
                                        <Text fontSize="sm" color="red.500" fontWeight="medium">
                                            {error}
                                        </Text>
                                    </Flex>
                                )}
                            </Box>

                            <VStack gap={2.5} pt={1}>
                                <Button
                                    w="full"
                                    bg="#2DC6B8"
                                    color="white"
                                    borderRadius="xl"
                                    py={5}
                                    fontWeight="bold"
                                    opacity={isComplete ? 1 : 0.5}
                                    cursor={isComplete ? "pointer" : "not-allowed"}
                                    _hover={isComplete ? { bg: "#25a89c" } : {}}
                                    transition="all 0.2s"
                                    onClick={handleConfirm}
                                    loading={isSubmitting}
                                >
                                    Confirmar Entrega
                                </Button>
                                <Button
                                    w="full"
                                    variant="ghost"
                                    color="gray.500"
                                    borderRadius="xl"
                                    py={5}
                                    fontWeight="medium"
                                    onClick={onCancel}
                                    _hover={{ bg: "gray.100" }}
                                    transition="all 0.2s"
                                >
                                    Cancelar
                                </Button>
                            </VStack>
                        </VStack>
                    </Box>
                </Box>
            </Flex>
        </>
    );
};
