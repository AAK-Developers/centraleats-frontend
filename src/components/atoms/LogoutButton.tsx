import { Button, HStack } from "@chakra-ui/react";
import { useClerk } from "@clerk/clerk-react";
import { LuLogOut } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

export const LogoutButton = () => {
    const { signOut } = useClerk();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <Button
            w="full"
            maxW="300px"
            mx="auto"
            bg="#E65100"
            color="white"
            size="lg"
            borderRadius="full"
            _hover={{ bg: "#db601e" }}
            onClick={handleLogout}
        >
            <HStack gap={2}>
                <LuLogOut />
                <span>Cerrar Sesión</span>
            </HStack>
        </Button>
    );
};