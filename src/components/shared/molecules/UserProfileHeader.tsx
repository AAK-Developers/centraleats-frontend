import { Box, Flex, VStack, Text, Icon, Image } from "@chakra-ui/react";
import { FaUser } from "react-icons/fa";

interface UserProfileHeaderProps {
    imageUrl?: string;
    fullName: string;
    email: string;
    nameColor?: string;
    emailColor?: string;
    layout?: "vertical" | "horizontal";
    avatarSize?: number;
}

export const UserProfileHeader = ({
    imageUrl,
    fullName,
    email,
    nameColor = "#042E63",
    emailColor = "gray.500",
    layout = "vertical",
    avatarSize,
}: UserProfileHeaderProps) => {
    const size = avatarSize ?? (layout === "horizontal" ? 92 : 100);

    const Avatar = (
        <Box
            w={`${size}px`}
            h={`${size}px`}
            borderRadius="full"
            overflow="hidden"
            border="3px solid"
            borderColor="whiteAlpha.400"
            flexShrink={0}
            bg="whiteAlpha.200"
        >
            {imageUrl ? (
                <Image
                    src={imageUrl}
                    alt={fullName || "Avatar"}
                    w="full"
                    h="full"
                    objectFit="cover"
                />
            ) : (
                <Flex w="full" h="full" align="center" justify="center" bg="gray.100">
                    <Icon as={FaUser} color="gray.400" boxSize={`${Math.round(size * 0.4)}px`} />
                </Flex>
            )}
        </Box>
    );

    if (layout === "horizontal") {
        return (
            <Flex align="center" gap={4}>
                {Avatar}
                <Box minW={0} flex={1}>
                    <Text
                        fontWeight="extrabold"
                        fontSize={{ base: "md", md: "3xl" }}
                        color={nameColor}
                        lineHeight="1.2"
                        mb={0.5}
                        lineClamp={1}
                    >
                        {fullName}
                    </Text>
                    <Text
                        fontSize="xl"
                        color={emailColor}
                        lineClamp={1}
                    >
                        {email}
                    </Text>
                </Box>
            </Flex>
        );
    }

    return (
        <VStack gap={2} align="center">
            {Avatar}
            {fullName && (
                <Text fontWeight="bold" fontSize="md" color={nameColor} textAlign="center" lineHeight="1.2">
                    {fullName}
                </Text>
            )}
            {email && (
                <Text fontSize="xs" color={emailColor} textAlign="center" lineClamp={1}>
                    {email}
                </Text>
            )}
        </VStack>
    );
};
