import {
    Box, Flex, Text, VStack, HStack, Icon, SimpleGrid, Image
} from "@chakra-ui/react";
import { useUser } from "@clerk/clerk-react";
import { FaDownload, FaShareAlt, FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";

import { WaveLayout } from "../../components/layout/WaveLayout";
import { AppContainer } from "../../components/layout/AppContainer";
import { DashboardHeader } from "../../components/organisms/DashboardHeader";
import CentralEats from "../../assets/CentralEats.png";

const MOCK_ORDER = {
    invoiceNumber: "F-001",
    date: new Date().toLocaleDateString("es-EC"),
    restaurant: {
        name: "Mañaz Cafetería",
        address: "Carrera 70 #17a-50",
        city: "Quito, Ecuador",
    },
    customer: {
        name: "Aquiles Parra",
        address: "Carrera 70 #17a-50",
    },
    items: [
        { code: "1", name: "Almuerzo Ejecutivo", quantity: 2, unitPrice: 2.90 },
        { code: "2", name: "Jugo Natural", quantity: 1, unitPrice: 1.50 },
        { code: "3", name: "Empanada", quantity: 3, unitPrice: 1.00 },
    ],
    paymentMethod: "Efectivo",
    amountPaid: 15.00,
};

export default function FactureDashboard() {
    const { user } = useUser();
    const navigate = useNavigate();

    const subtotal = MOCK_ORDER.items.reduce(
        (acc, item) => acc + item.unitPrice * item.quantity, 0
    );
    const change = MOCK_ORDER.amountPaid - subtotal;
    const qrValue = `Factura:${MOCK_ORDER.invoiceNumber}|Total:${subtotal.toFixed(2)}|Restaurante:${MOCK_ORDER.restaurant.name}`;

    return (
        <WaveLayout>
            <AppContainer>
                <DashboardHeader userName={user?.firstName || "Usuario"} />

                <Flex justify="center" pb={10}>
                    <Box
                        bg="white"
                        borderRadius="3xl"
                        boxShadow="2xl"
                        overflow="hidden"
                        w={{ base: "full", md: "600px" }}
                        border="1px solid"
                        borderColor="gray.100"
                    >
                        {/* Header azul */}
                        <Box bg="#042E63" px={6} py={4}>
                            <Flex justify="space-between" align="center">
                                <Image src={CentralEats} alt="Logo" h="40px" />
                                <VStack align="end" gap={0}>
                                    <Text color="white" fontSize="xs" opacity={0.8}>
                                        {MOCK_ORDER.restaurant.address}
                                    </Text>
                                    <Text color="white" fontSize="xs" opacity={0.8}>
                                        {MOCK_ORDER.restaurant.city}
                                    </Text>
                                </VStack>
                            </Flex>
                        </Box>

                        <Box px={{ base: 4, md: 8 }} py={6}>

                            {/* Título FACTURA */}
                            <Flex justify="space-between" align="start" mb={6}>
                                <VStack align="start" gap={1}>
                                    <Text fontSize="xs" color="gray.500" fontWeight="semibold">
                                        RESTAURANTE
                                    </Text>
                                    <Text fontWeight="bold" color="#042E63" fontSize="lg">
                                        {MOCK_ORDER.restaurant.name}
                                    </Text>
                                </VStack>
                                <VStack align="end" gap={1}>
                                    <Text
                                        fontWeight="bold"
                                        fontSize="2xl"
                                        color="#30B2BC"
                                        letterSpacing="widest"
                                    >
                                        FACTURA
                                    </Text>
                                    <HStack gap={2}>
                                        <Text fontSize="xs" color="gray.500">N° FACTURA</Text>
                                        <Text fontSize="xs" fontWeight="bold" color="#042E63">
                                            {MOCK_ORDER.invoiceNumber}
                                        </Text>
                                    </HStack>
                                    <HStack gap={2}>
                                        <Text fontSize="xs" color="gray.500">FECHA</Text>
                                        <Text fontSize="xs" fontWeight="bold" color="#042E63">
                                            {MOCK_ORDER.date}
                                        </Text>
                                    </HStack>
                                </VStack>
                            </Flex>

                            {/* Cliente */}
                            <Box
                                bg="gray.50"
                                borderRadius="xl"
                                p={4}
                                mb={6}
                                border="1px solid"
                                borderColor="gray.100"
                            >
                                <SimpleGrid columns={2} gap={3}>
                                    <Box>
                                        <Text fontSize="xs" color="gray.500" fontWeight="semibold" mb={1}>
                                            CLIENTE
                                        </Text>
                                        <Text fontSize="sm" fontWeight="bold" color="#042E63">
                                            {MOCK_ORDER.customer.name}
                                        </Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize="xs" color="gray.500" fontWeight="semibold" mb={1}>
                                            DOMICILIO
                                        </Text>
                                        <Text fontSize="sm" color="gray.600">
                                            {MOCK_ORDER.customer.address}
                                        </Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize="xs" color="gray.500" fontWeight="semibold" mb={1}>
                                            MÉTODO DE PAGO
                                        </Text>
                                        <Text fontSize="sm" fontWeight="bold" color="#30B2BC">
                                            {MOCK_ORDER.paymentMethod}
                                        </Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize="xs" color="gray.500" fontWeight="semibold" mb={1}>
                                            ESTADO
                                        </Text>
                                        <Box
                                            display="inline-block"
                                            bg="green.100"
                                            color="green.700"
                                            borderRadius="full"
                                            px={3}
                                            py={0.5}
                                            fontSize="xs"
                                            fontWeight="bold"
                                        >
                                            Confirmado
                                        </Box>
                                    </Box>
                                </SimpleGrid>
                            </Box>

                            {/* Tabla de items */}
                            <Box mb={6}>
                                <Box
                                    bg="#042E63"
                                    borderRadius="xl"
                                    px={4}
                                    py={2}
                                    mb={2}
                                >
                                    <SimpleGrid columns={4} gap={2}>
                                        {["CÓDIGO", "ARTÍCULO", "CANT.", "TOTAL"].map((h) => (
                                            <Text key={h} fontSize="xs" color="white" fontWeight="bold">
                                                {h}
                                            </Text>
                                        ))}
                                    </SimpleGrid>
                                </Box>

                                <VStack gap={0} align="stretch">
                                    {MOCK_ORDER.items.map((item, i) => (
                                        <Box
                                            key={i}
                                            px={4}
                                            py={2}
                                            bg={i % 2 === 0 ? "gray.50" : "white"}
                                        >
                                            <SimpleGrid columns={4} gap={2}>
                                                <Text fontSize="sm" color="gray.500">
                                                    {item.code}
                                                </Text>
                                                <Text fontSize="sm" color="#042E63" fontWeight="semibold">
                                                    {item.name}
                                                </Text>
                                                <Text fontSize="sm" color="gray.600">
                                                    {item.quantity}
                                                </Text>
                                                <Text fontSize="sm" fontWeight="bold" color="#042E63">
                                                    ${(item.unitPrice * item.quantity).toFixed(2)}
                                                </Text>
                                            </SimpleGrid>
                                        </Box>
                                    ))}
                                </VStack>

                                <Box h="1px" bg="gray.200" w="full" />

                                {/* Totales */}
                                <VStack align="stretch" gap={2} px={4}>
                                    <Flex justify="space-between">
                                        <Text fontSize="sm" color="gray.500">SUBTOTAL</Text>
                                        <Text fontSize="sm" fontWeight="bold" color="#042E63">
                                            ${subtotal.toFixed(2)}
                                        </Text>
                                    </Flex>
                                    <Flex justify="space-between">
                                        <Text fontSize="sm" color="gray.500">PAGA CON</Text>
                                        <Text fontSize="sm" fontWeight="bold" color="#042E63">
                                            ${MOCK_ORDER.amountPaid.toFixed(2)}
                                        </Text>
                                    </Flex>
                                    <Flex justify="space-between">
                                        <Text fontSize="sm" color="gray.500">VUELTAS</Text>
                                        <Text fontSize="sm" fontWeight="bold" color="green.500">
                                            ${change.toFixed(2)}
                                        </Text>
                                    </Flex>
                                    <Box />
                                    <Flex
                                        justify="space-between"
                                        bg="#042E63"
                                        borderRadius="xl"
                                        px={4}
                                        py={3}
                                    >
                                        <Text fontWeight="bold" color="white" fontSize="md">
                                            TOTAL FACTURA
                                        </Text>
                                        <Text fontWeight="bold" color="#30B2BC" fontSize="md">
                                            ${subtotal.toFixed(2)}
                                        </Text>
                                    </Flex>
                                </VStack>
                            </Box>

                            {/* QR */}
                            <Flex justify="center" mb={6}>
                                <Box
                                    p={4}
                                    bg="white"
                                    borderRadius="2xl"
                                    boxShadow="md"
                                    border="1px solid"
                                    borderColor="gray.100"
                                >
                                    <QRCode value={qrValue} size={160} />
                                </Box>
                            </Flex>

                            {/* Botones */}
                            <VStack gap={3}>
                                <HStack gap={3} w="full">
                                    <Flex
                                        as="button"
                                        flex={1}
                                        align="center"
                                        justify="center"
                                        gap={2}
                                        bg="white"
                                        border="2px solid"
                                        borderColor="#30B2BC"
                                        color="#30B2BC"
                                        borderRadius="full"
                                        py={3}
                                        fontWeight="bold"
                                        fontSize="sm"
                                        _hover={{ bg: "#f0fbfc" }}
                                        transition="all 0.2s"
                                    >
                                        <Icon as={FaShareAlt} />
                                        Share
                                    </Flex>
                                    <Flex
                                        as="button"
                                        flex={1}
                                        align="center"
                                        justify="center"
                                        gap={2}
                                        bg="#30B2BC"
                                        color="white"
                                        borderRadius="full"
                                        py={3}
                                        fontWeight="bold"
                                        fontSize="sm"
                                        _hover={{ bg: "#2899a1" }}
                                        transition="all 0.2s"
                                    >
                                        <Icon as={FaDownload} />
                                        Download
                                    </Flex>
                                </HStack>

                                <Flex
                                    as="button"
                                    w="full"
                                    align="center"
                                    justify="center"
                                    gap={2}
                                    bg="#F97316"
                                    color="white"
                                    borderRadius="full"
                                    py={4}
                                    fontWeight="bold"
                                    fontSize="md"
                                    _hover={{ bg: "#ea6c0a" }}
                                    transition="all 0.2s"
                                    onClick={() => navigate("/student-dashboard")}
                                >
                                    <Icon as={FaBell} />
                                    Seguir Pedido
                                </Flex>
                            </VStack>
                        </Box>

                        {/* Footer */}
                        <Box bg="#042E63" px={6} py={3}>
                            <Text color="white" fontSize="xs" textAlign="center" opacity={0.8}>
                                © 2026 CentralEats UCE. Desarrollado por Ingeniería en Sistemas de Información.
                            </Text>
                        </Box>
                    </Box>
                </Flex>
            </AppContainer>
        </WaveLayout>
    );
}