import { Box, Flex, HStack, Text, VStack, Icon } from "@chakra-ui/react";
import { HiArrowLeft, HiArrowRight, HiExclamationCircle } from "react-icons/hi";

interface CardFormProps {
    cardNumber: string;
    cardName: string;
    cardExpiry: string;
    cardCvv: string;
    subtotal: number;
    onCardNumberChange: (v: string) => void;
    onCardNameChange: (v: string) => void;
    onCardExpiryChange: (v: string) => void;
    onCardCvvChange: (v: string) => void;
    onBack: () => void;
    onSubmit: () => void;
    error?: string;
}

const inputStyle = {
    width: "100%",
    padding: "12px",
    border: "1px solid #E2E8F0",
    borderRadius: "12px",
    fontSize: "16px",
    outline: "none",
};

export const CardForm = ({
    cardNumber,
    cardName,
    cardExpiry,
    cardCvv,
    subtotal,
    onCardNumberChange,
    onCardNameChange,
    onCardExpiryChange,
    onCardCvvChange,
    onBack,
    onSubmit,
    error
}: CardFormProps) => (
    <Box
        flex={1}
        display="flex"
        flexDirection="column"
        overflow="hidden"
    >
        <Box flex={1} overflowY="auto" p={{ base: 4, md: 6 }}>
            <VStack gap={4} align="stretch">

                <Box
                    fontWeight="semibold"
                    fontSize={{ base: "sm", md: "md" }}
                    color="#042E63"
                >
                    Datos de la tarjeta
                </Box>

                <Box>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.600" mb={1}>
                        Número de tarjeta
                    </Text>
                    <input
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={e => onCardNumberChange(e.target.value)}
                        style={inputStyle}
                    />
                </Box>

                <Box>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.600" mb={1}>
                        Nombre en la tarjeta
                    </Text>
                    <input
                        placeholder="Juan Pérez"
                        value={cardName}
                        onChange={e => onCardNameChange(e.target.value)}
                        style={inputStyle}
                    />
                </Box>

                <HStack gap={{ base: 2, md: 3 }} flexWrap="wrap">
                    <Box flex={1} minW="140px">
                        <Text fontSize="sm" fontWeight="semibold" color="gray.600" mb={1}>
                            Vencimiento
                        </Text>
                        <input
                            placeholder="MM/AA"
                            value={cardExpiry}
                            onChange={e => onCardExpiryChange(e.target.value)}
                            style={inputStyle}
                        />
                    </Box>

                    <Box flex={1} minW="140px">
                        <Text fontSize="sm" fontWeight="semibold" color="gray.600" mb={1}>
                            CVV
                        </Text>
                        <input
                            placeholder="123"
                            value={cardCvv}
                            onChange={e => onCardCvvChange(e.target.value)}
                            style={inputStyle}
                        />
                    </Box>
                </HStack>

                <Flex
                    bg="#F97316"
                    borderRadius="xl"
                    p={{ base: 3, md: 4 }}
                    justify="space-between"
                    align="center"
                >
                    <Text
                        color="white"
                        fontWeight="bold"
                        fontSize={{ base: "sm", md: "md" }}
                    >
                        Total a pagar
                    </Text>

                    <Text
                        color="white"
                        fontWeight="bold"
                        fontSize={{ base: "lg", md: "xl" }}
                        whiteSpace="nowrap"
                    >
                        ${subtotal.toFixed(2)}
                    </Text>
                </Flex>
                {error && (
                    <Flex
                        mt={3}
                        align="center"
                        justify="center"
                        gap={2}
                    >
                        <Icon
                            as={HiExclamationCircle}
                            color="red.500"
                            boxSize={5}
                        />
                        <Text
                            color="red.500"
                            fontSize="sm"
                            fontWeight="medium"
                            textAlign="center"
                        >
                            {error}
                        </Text>
                    </Flex>
                )}
            </VStack>
        </Box>

        <Box
            p={{ base: 3, md: 4 }}
            borderTop="1px solid"
            borderColor="gray.100"
        >
            <HStack gap={3}>

                <Flex
                    as="button"
                    flex={1}
                    align="center"
                    justify="center"
                    gap={2}
                    border="2px solid"
                    borderColor="gray.200"
                    borderRadius="full"
                    py={{ base: 3, md: 4 }}
                    fontWeight="bold"
                    color="gray.600"
                    bg="#d9dddd"
                    transition="all 0.2s ease"
                    _hover={{
                        bg: "#c0c0c0",
                    }}
                    _active={{
                        bg: "gray.400",
                        transform: "scale(0.98)",
                    }}
                    onClick={onBack}
                >
                    <Icon as={HiArrowLeft} />
                    Volver
                </Flex>

                <Flex
                    as="button"
                    flex={2}
                    align="center"
                    justify="space-between"
                    bg="#30B2BC"
                    color="white"
                    borderRadius="full"
                    px={{ base: 4, md: 6 }}
                    py={{ base: 3, md: 4 }}
                    fontWeight="bold"
                    fontSize="xl"
                    transition="all 0.2s ease"
                    _hover={{
                        bg: "#289aa3",
                    }}
                    _active={{
                        transform: "scale(0.98)",
                    }}
                    onClick={onSubmit}
                >
                    <Text>Pagar ahora</Text>

                    <Flex
                        w="32px"
                        h="32px"
                        bg="white"
                        borderRadius="full"
                        align="center"
                        justify="center"
                    >
                        <Icon as={HiArrowRight} color="#30B2BC" boxSize={5} />
                    </Flex>
                </Flex>

            </HStack>
        </Box>
    </Box>
);