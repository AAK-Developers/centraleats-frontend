import { Flex, HStack, Icon, VStack } from "@chakra-ui/react";
import { FaDownload, FaShareAlt, FaBell } from "react-icons/fa";

interface InvoiceActionsProps {
    onShare?: () => void;
    onDownload?: () => void;
    onSeguirPedido: () => void;
}

export const InvoiceActions = ({
    onShare,
    onDownload,
    onSeguirPedido,
}: InvoiceActionsProps) => {
    return (
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
                    py={{ base: 2.5, md: 3 }}
                    fontWeight="bold"
                    fontSize={{ base: "xs", md: "sm" }}
                    _hover={{ bg: "#f0fbfc" }}
                    transition="all 0.2s"
                    onClick={onShare}
                    minH="44px"
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
                    py={{ base: 2.5, md: 3 }}
                    fontWeight="bold"
                    fontSize={{ base: "xs", md: "sm" }}
                    _hover={{ bg: "#2899a1" }}
                    transition="all 0.2s"
                    onClick={onDownload}
                    minH="44px"
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
                py={{ base: 2, md: 3 }}
                fontWeight="bold"
                fontSize={{ base: "md", md: "xl" }}
                _hover={{ bg: "#ea6c0a" }}
                transition="all 0.2s"
                onClick={onSeguirPedido}
                minH="44px"
            >
                <Icon as={FaBell} />
                Seguir Pedido
            </Flex>
        </VStack>
    );
};
