import { VStack, Heading, Text } from "@chakra-ui/react";
import { AvatarRoot, AvatarImage, AvatarFallback } from "@chakra-ui/react";

interface UserProfileHeaderProps {
    imageUrl?: string;
    fullName: string;
    email: string;
}

export const UserProfileHeader = ({ imageUrl, fullName, email }: UserProfileHeaderProps) => {
    return (
        <VStack gap={2}>
            <AvatarRoot boxSize="150px">
                <AvatarImage src={imageUrl} />
                <AvatarFallback>
                    {fullName?.charAt(0) ?? "U"}
                </AvatarFallback>
            </AvatarRoot>
            <Heading size="lg" color="#042E63">
                {fullName}
            </Heading>
            <Text color="gray.500">
                {email}
            </Text>
        </VStack>
    );
};