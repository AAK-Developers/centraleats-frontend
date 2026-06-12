import { Flex, Heading, HStack, Icon, Box } from "@chakra-ui/react";
import { FaBell, FaUser, FaShoppingCart } from "react-icons/fa";

type Props = {
    userName: string;
};

export const DashboardHeader = ({ userName }: Props) => {
    return (
        <Flex justify="space-between" align="center" mb={6}>
            <Box>
                <Heading size="md" color="#042E63">
                    Hola, {userName}
                </Heading>
            </Box>

            <HStack gap={3}>
                <Icon as={FaBell} boxSize={5} color="#FFA83F" />
                <Icon as={FaUser} boxSize={5} color="#042E63" />
                <Icon as={FaShoppingCart} boxSize={5} color="#E65100" />
            </HStack>
        </Flex>
    );
};