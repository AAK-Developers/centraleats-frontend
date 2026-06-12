import { Button, HStack } from "@chakra-ui/react";
import { useClerk } from "@clerk/clerk-react";
import { LuLogOut } from "react-icons/lu";

export const LogoutButton = () => {
    const { signOut } = useClerk();

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
            onClick={() => signOut()}
        >
            <HStack gap={2}>
                <LuLogOut />
                <span>Cerrar Sesión</span>
            </HStack>
        </Button>
    );
};