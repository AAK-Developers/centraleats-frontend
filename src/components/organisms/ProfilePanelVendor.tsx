import { Box, VStack, Heading, Flex, Text } from "@chakra-ui/react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { UserProfileHeader } from "../organisms/UserProfileHeader";
import { LogoutButton } from "../atoms/LogoutButton";
import { CloseButton } from "../atoms/CloseButton";

interface ProfilePanelVendorProps {
    isOpen: boolean;
    onClose: () => void;
    restaurantName?: string;
    restaurantLogoUrl?: string;
}

export const ProfilePanelVendor = ({
    isOpen,
    onClose,
    restaurantName = "Restaurante Central 1",
    restaurantLogoUrl = "/assets/restaurant-placeholder.png",
}: ProfilePanelVendorProps) => {
    const { user, isLoaded } = useUser();
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleEditMenu = () => {
        onClose();
        navigate("/vendor/edit-menu");
    };

    return (
        <>
            <Box
                position="fixed"
                inset={0}
                bg="blackAlpha.400"
                backdropFilter="blur(2px)"
                zIndex={998}
                onClick={onClose}
            />

            <Box
                position="fixed"
                top={{ base: "40px", md: "60px" }}
                bottom={{ base: "40px", md: "60px" }}
                right={{ base: "4px", md: "24px" }}
                w={{ base: "calc(100% - 8px)", md: "380px", lg: "400px" }}
                bg="white"
                borderRadius="3xl"
                boxShadow="2xl"
                overflow="hidden"
                zIndex={999}
            >
                <Flex
                    align="center"
                    justify="space-between"
                    p={{ base: 4, md: 5, lg: 6 }}
                    borderBottom="1px solid"
                    borderColor="gray.100"
                >
                    <Heading size={{ base: "sm", md: "md" }} color="#042E63">
                        Mi Perfil
                    </Heading>
                    <CloseButton onClick={onClose} />
                </Flex>

                <Box
                    p={{ base: 4, md: 5, lg: 6 }}
                    overflowY="auto"
                    h="calc(100% - 88px)"
                >
                    {isLoaded && (
                        <VStack gap={{ base: 4, md: 5, lg: 6 }} align="center">

                            <UserProfileHeader
                                imageUrl={user?.imageUrl}
                                fullName={user?.fullName || "Usuario"}
                                email={user?.primaryEmailAddress?.emailAddress || ""}
                            />

                            <Box w="full">
                                <Heading
                                    size={{ base: "xs", md: "sm" }}
                                    color="#042E63"
                                    mb={{ base: 2, md: 3 }}
                                >
                                    Editar Platos
                                </Heading>
                                <Flex
                                    align="center"
                                    gap={{ base: 2, md: 3 }}
                                    p={{ base: 2, md: 3 }}
                                    bg="white"
                                    border="1px solid"
                                    borderColor="gray.200"
                                    borderRadius="xl"
                                    cursor="pointer"
                                    _hover={{ bg: "gray.50", borderColor: "#30B2BC" }}
                                    transition="all 0.2s"
                                    onClick={handleEditMenu}
                                >
                                    <img
                                        src={restaurantLogoUrl}
                                        alt={`Menú ${restaurantName}`}
                                        width={40}
                                        height={40}
                                        style={{ objectFit: "contain", borderRadius: "6px" }}
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.onerror = null;
                                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(restaurantName)}&background=0D8ABC&color=fff&size=40`;
                                        }}
                                    />
                                    <Text
                                        fontWeight="semibold"
                                        color="#042E63"
                                        fontSize={{ base: "xs", md: "sm" }}
                                    >
                                        Menú {restaurantName}
                                    </Text>
                                </Flex>
                            </Box>

                            <Flex pt={{ base: 2, md: 4 }} justify="center" w="full">
                                <LogoutButton />
                            </Flex>

                        </VStack>
                    )}
                </Box>
            </Box>
        </>
    );
};