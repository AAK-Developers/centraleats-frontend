import { Flex, Heading, HStack, Icon, Box, IconButton } from "@chakra-ui/react";
import { FaBell, FaUser, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

type Props = {
    userName: string;
};

export const DashboardHeader = ({ userName }: Props) => {
    const navigate = useNavigate();

    return (
        <Flex justify="space-between" align="center" mb={6}>
            <Box>
                <Heading size="md" color="#042E63">
                    Hola, {userName}
                </Heading>
            </Box>

            <HStack gap={1}>
                <IconButton
                    aria-label="Notificaciones"
                    color="#FFA83F"
                    variant="ghost"
                    size="md"
                    onClick={() => navigate('/student/notifications')}
                >
                    <FaBell />
                </IconButton>


                <IconButton
                    aria-label="Perfil"
                    variant="ghost"
                    onClick={() => navigate('/student/profile')}
                >
                    <Icon as={FaUser} boxSize={5} color="#042E63" />
                </IconButton>




                <Icon as={FaShoppingCart} boxSize={5} color="#E65100" />
            </HStack>
        </Flex>
    );
};