import { VStack, Heading, Text } from "@chakra-ui/react";
import { AvatarRoot, AvatarImage, AvatarFallback } from "@chakra-ui/react";

interface UserProfileHeaderProps {
    imageUrl?: string;
    fullName: string;
    email: string;
    nameColor?: string;
    emailColor?: string;
}

export const UserProfileHeader = ({
    imageUrl,
    fullName,
    email,
    nameColor = "#042E63",
    emailColor = "gray.500",
}: UserProfileHeaderProps) => {
    return (
        <VStack gap={2}>
            <AvatarRoot boxSize="150px">
                <AvatarImage src={imageUrl} />
                <AvatarFallback>
                    {fullName?.charAt(0) ?? "U"}
                </AvatarFallback>
            </AvatarRoot>
            <Heading size="lg" color={nameColor}>
                {fullName}
            </Heading>
            <Text color={emailColor}>
                {email}
            </Text>
        </VStack>
    );
};
