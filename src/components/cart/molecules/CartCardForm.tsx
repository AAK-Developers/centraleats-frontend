import { Box, Flex, HStack, Text, VStack, Icon, Spinner, Button } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import {
    HiArrowLeft,
    HiCheckCircle,
    HiExclamationCircle,
    HiLockClosed,
} from "react-icons/hi";
import { FaCcVisa, FaCcMastercard, FaCreditCard } from "react-icons/fa";

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
    isSubmitting?: boolean;
    error?: string;
}


const onlyDigits = (v: string) => v.replace(/\D/g, "");

const formatCardNumber = (raw: string) => {
    const digits = onlyDigits(raw).slice(0, 19);
    return digits.replace(/(.{4})/g, "$1 ").trim();
};

const formatExpiry = (raw: string) => {
    const digits = onlyDigits(raw).slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const formatCvv = (raw: string) => onlyDigits(raw).slice(0, 4);

type CardBrand = "visa" | "mastercard" | "generic" | null;

const detectBrand = (digits: string): CardBrand => {
    if (!digits) return null;
    if (/^4/.test(digits)) return "visa";
    if (/^(5[1-5]|2[2-7])/.test(digits)) return "mastercard";
    return "generic";
};

const luhnCheck = (digits: string) => {
    let sum = 0;
    let shouldDouble = false;
    for (let i = digits.length - 1; i >= 0; i--) {
        let d = parseInt(digits[i], 10);
        if (shouldDouble) {
            d *= 2;
            if (d > 9) d -= 9;
        }
        sum += d;
        shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
};

const validateCardNumber = (raw: string): string | null => {
    const digits = onlyDigits(raw);
    if (!digits) return "Ingresa el número de tarjeta";
    if (digits.length < 13 || digits.length > 19) return "El número de tarjeta debe tener entre 13 y 19 dígitos";
    if (!luhnCheck(digits)) return "Número de tarjeta inválido";
    return null;
};

const validateCardName = (name: string): string | null => {
    const trimmed = name.trim();
    if (!trimmed) return "Ingresa el nombre del titular";
    if (trimmed.length < 3) return "El nombre es demasiado corto";
    if (!/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s'.-]+$/.test(trimmed)) return "El nombre solo puede contener letras";
    if (!trimmed.includes(" ")) return "Ingresa nombre y apellido";
    return null;
};

const validateExpiry = (raw: string): string | null => {
    const digits = onlyDigits(raw);
    if (!digits) return "Ingresa la fecha de vencimiento";
    if (digits.length < 4) return "Usa el formato MM/AA";

    const month = parseInt(digits.slice(0, 2), 10);
    const year = parseInt(digits.slice(2, 4), 10);

    if (month < 1 || month > 12) return "El mes debe estar entre 01 y 12";

    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
        return "La tarjeta está vencida";
    }
    if (year > currentYear + 20) return "Fecha de vencimiento no válida";

    return null;
};

const validateCvv = (cvv: string, brand: CardBrand): string | null => {
    if (!cvv) return "Ingresa el CVV";
    const expectedLength = brand === "generic" ? 4 : 3;
    if (cvv.length < 3) return "El CVV debe tener 3 dígitos";
    if (cvv.length > expectedLength) return "CVV inválido";
    return null;
};


const baseInputStyle: React.CSSProperties = {
    width: "100%",
    padding: "13px 14px",
    borderRadius: "12px",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
    fontFamily: "inherit",
    color: "#0F2A4A",
    backgroundColor: "#FAFBFC",
};

const getInputStyle = (hasError: boolean, isFocused: boolean): React.CSSProperties => ({
    ...baseInputStyle,
    border: `1.5px solid ${hasError ? "#E53E3E" : isFocused ? "#30B2BC" : "#E2E8F0"}`,
    boxShadow: isFocused ? `0 0 0 3px ${hasError ? "rgba(229,62,62,0.12)" : "rgba(48,178,188,0.15)"}` : "none",
});

const FieldError = ({ message }: { message: string }) => (
    <Flex align="center" gap={1} mt={1.5}>
        <Icon as={HiExclamationCircle} color="red.500" boxSize={3.5} flexShrink={0} />
        <Text color="red.500" fontSize="xs" fontWeight="medium">
            {message}
        </Text>
    </Flex>
);

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
    isSubmitting = false,
    error,
}: CardFormProps) => {
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [focused, setFocused] = useState<string | null>(null);
    const [submitAttempted, setSubmitAttempted] = useState(false);

    const digits = useMemo(() => onlyDigits(cardNumber), [cardNumber]);
    const brand = useMemo(() => detectBrand(digits), [digits]);

    const errors = useMemo(
        () => ({
            cardNumber: validateCardNumber(cardNumber),
            cardName: validateCardName(cardName),
            cardExpiry: validateExpiry(cardExpiry),
            cardCvv: validateCvv(cardCvv, brand),
        }),
        [cardNumber, cardName, cardExpiry, cardCvv, brand]
    );

    const isValid = !errors.cardNumber && !errors.cardName && !errors.cardExpiry && !errors.cardCvv;

    const shouldShow = (field: string) => (touched[field] || submitAttempted) && !!errors[field as keyof typeof errors];

    const markTouched = (field: string) => setTouched((t) => ({ ...t, [field]: true }));

    const handleSubmit = () => {
        setSubmitAttempted(true);
        setTouched({ cardNumber: true, cardName: true, cardExpiry: true, cardCvv: true });
        if (!isValid || isSubmitting) return;
        onSubmit();
    };

    const generalError = submitAttempted && !isValid
        ? "Revisa los campos marcados en rojo antes de continuar"
        : error;

    const BrandIcon = brand === "visa" ? FaCcVisa : brand === "mastercard" ? FaCcMastercard : FaCreditCard;

    return (
        <Box flex={1} display="flex" flexDirection="column" overflow="hidden" bg="white">
            <Box flex={1} overflowY="auto" p={{ base: 4, md: 6 }}>
                <VStack gap={5} align="stretch">

                    <Flex align="center" justify="space-between">
                        <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }} color="#042E63">
                            Datos de la tarjeta
                        </Text>
                        <Flex align="center" gap={1.5} bg="#F0FBFC" px={2.5} py={1} borderRadius="full">
                            <Icon as={HiLockClosed} color="#30B2BC" boxSize={3} />
                            <Text fontSize="10px" fontWeight="bold" color="#30B2BC" letterSpacing="wide">
                                PAGO SEGURO
                            </Text>
                        </Flex>
                    </Flex>

                    <Box>
                        <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={1.5} letterSpacing="wide" textTransform="uppercase">
                            Número de tarjeta
                        </Text>
                        <Box position="relative">
                            <input
                                inputMode="numeric"
                                placeholder="1234 5678 9012 3456"
                                value={cardNumber}
                                maxLength={23}
                                onChange={(e) => onCardNumberChange(formatCardNumber(e.target.value))}
                                onFocus={() => setFocused("cardNumber")}
                                onBlur={() => { setFocused(null); markTouched("cardNumber"); }}
                                style={{ ...getInputStyle(shouldShow("cardNumber"), focused === "cardNumber"), paddingRight: "44px" }}
                            />
                            <Flex
                                position="absolute"
                                right="12px"
                                top="50%"
                                transform="translateY(-50%)"
                                align="center"
                                justify="center"
                            >
                                <Icon
                                    as={BrandIcon}
                                    boxSize={brand && brand !== "generic" ? 7 : 5}
                                    color={brand === "visa" ? "#1A1F71" : brand === "mastercard" ? "#EB001B" : "gray.300"}
                                />
                            </Flex>
                        </Box>
                        {shouldShow("cardNumber") && <FieldError message={errors.cardNumber!} />}
                    </Box>

                    <Box>
                        <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={1.5} letterSpacing="wide" textTransform="uppercase">
                            Nombre en la tarjeta
                        </Text>
                        <input
                            placeholder="Juan Pérez"
                            value={cardName}
                            onChange={(e) => onCardNameChange(e.target.value.toUpperCase())}
                            onFocus={() => setFocused("cardName")}
                            onBlur={() => { setFocused(null); markTouched("cardName"); }}
                            style={getInputStyle(shouldShow("cardName"), focused === "cardName")}
                        />
                        {shouldShow("cardName") && <FieldError message={errors.cardName!} />}
                    </Box>

                    <HStack gap={{ base: 3, md: 4 }} align="flex-start">
                        <Box flex={1}>
                            <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={1.5} letterSpacing="wide" textTransform="uppercase">
                                Vencimiento
                            </Text>
                            <input
                                inputMode="numeric"
                                placeholder="MM/AA"
                                value={cardExpiry}
                                maxLength={5}
                                onChange={(e) => onCardExpiryChange(formatExpiry(e.target.value))}
                                onFocus={() => setFocused("cardExpiry")}
                                onBlur={() => { setFocused(null); markTouched("cardExpiry"); }}
                                style={getInputStyle(shouldShow("cardExpiry"), focused === "cardExpiry")}
                            />
                            {shouldShow("cardExpiry") && <FieldError message={errors.cardExpiry!} />}
                        </Box>

                        <Box flex={1}>
                            <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={1.5} letterSpacing="wide" textTransform="uppercase">
                                CVV
                            </Text>
                            <input
                                inputMode="numeric"
                                type="password"
                                placeholder="123"
                                value={cardCvv}
                                maxLength={4}
                                onChange={(e) => onCardCvvChange(formatCvv(e.target.value))}
                                onFocus={() => setFocused("cardCvv")}
                                onBlur={() => { setFocused(null); markTouched("cardCvv"); }}
                                style={getInputStyle(shouldShow("cardCvv"), focused === "cardCvv")}
                            />
                            {shouldShow("cardCvv") && <FieldError message={errors.cardCvv!} />}
                        </Box>
                    </HStack>

                    <Flex
                        bg="linear-gradient(135deg, #F97316 0%, #FB923C 100%)"
                        borderRadius="xl"
                        p={{ base: 3, md: 4 }}
                        justify="space-between"
                        align="center"
                        boxShadow="0 4px 14px rgba(249,115,22,0.25)"
                    >
                        <Text color="white" fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>
                            Total a pagar
                        </Text>
                        <Text color="white" fontWeight="extrabold" fontSize={{ base: "lg", md: "xl" }} whiteSpace="nowrap">
                            ${subtotal.toFixed(2)}
                        </Text>
                    </Flex>

                    {generalError && (
                        <Flex
                            align="center"
                            gap={2}
                            bg="red.50"
                            border="1px solid"
                            borderColor="red.200"
                            borderRadius="xl"
                            p={3}
                        >
                            <Icon as={HiExclamationCircle} color="red.500" boxSize={5} flexShrink={0} />
                            <Text color="red.600" fontSize="sm" fontWeight="medium">
                                {generalError}
                            </Text>
                        </Flex>
                    )}
                </VStack>
            </Box>

            <Box p={{ base: 4, md: 5 }} borderTop="1px solid" borderColor="gray.100">
                {isSubmitting ? (
                    <Flex justify="center" py={3}>
                        <Spinner color="#30B2BC" />
                    </Flex>
                ) : (
                    <VStack gap={3}>
                        <Button
                            w="full"
                            bg="#30B2BC"
                            color="white"
                            borderRadius="2xl"
                            py={6}
                            fontSize="md"
                            fontWeight="bold"
                            opacity={isValid ? 1 : 0.6}
                            _hover={{ bg: "#289aa3", transform: "translateY(-1px)", boxShadow: "lg" }}
                            _active={{ transform: "scale(0.98)" }}
                            transition="all 0.2s"
                            onClick={handleSubmit}
                        >
                            <HStack gap={2}>
                                <Icon as={HiCheckCircle} boxSize={5} />
                                <Text>Pagar ${subtotal.toFixed(2)}</Text>
                            </HStack>
                        </Button>
                        <Button
                            w="full"
                            variant="ghost"
                            color="gray.600"
                            borderRadius="2xl"
                            py={6}
                            fontSize="md"
                            fontWeight="medium"
                            onClick={onBack}
                            _hover={{ bg: "#c5c3c3", color: "#031F44" }}
                            transition="all 0.2s"
                        >
                            <HStack gap={2}>
                                <Icon as={HiArrowLeft} boxSize={5} />
                                <Text>Volver al carrito</Text>
                            </HStack>
                        </Button>
                    </VStack>
                )}
            </Box>
        </Box>
    );
};
