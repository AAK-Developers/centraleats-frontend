import { Flex, Text, Icon, Box } from "@chakra-ui/react";
import { FaStore } from "react-icons/fa";
import { StatusToggleVendor } from "../molecules/StatusToggleVendor";


interface Props {
    restaurantName: string;
    isOpen: boolean;
    onToggle: () => void;
}

export function PanelHeaderVendor({ restaurantName, isOpen, onToggle }: Props) {
    return (
        <Flex
            justify="space-between"
            align="center"
            mb={{ base: 4, md: 5, lg: 6 }}
            gap={{ base: 2, md: 4 }}
            flexWrap="wrap"
            px={{ base: 2, md: 4, lg: 0 }}
        >
            <Flex align="center" gap={3}>
                <Flex
                    w={{ base: "36px", md: "42px" }}
                    h={{ base: "36px", md: "42px" }}
                    borderRadius="xl"
                    bg="#042E63"
                    align="center"
                    justify="center"
                    flexShrink={0}
                >
                    <Icon as={FaStore} color="white" boxSize={{ base: 4, md: 5 }} />
                </Flex>
                <Box>
                    <Text
                        fontSize={{ base: "10px", md: "xs" }}
                        color="gray.400"
                        fontWeight="bold"
                        letterSpacing="wide"
                        textTransform="uppercase"
                        lineHeight="1"
                        mb={0.5}
                    >
                        Panel de control
                    </Text>
                    <Text
                        fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                        fontWeight="extrabold"
                        color="#042E63"
                        lineHeight="1.1"
                    >
                        {restaurantName}
                    </Text>
                </Box>
            </Flex>

            <StatusToggleVendor isOpen={isOpen} onToggle={onToggle} />
        </Flex>
    );
}
