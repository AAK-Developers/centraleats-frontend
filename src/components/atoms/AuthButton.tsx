import { Button, Icon, Flex, type ButtonProps } from '@chakra-ui/react';
import { LuUser } from 'react-icons/lu';

export const AuthButton = (props: ButtonProps) => {
    return (
        <Button
            bg="#E65100"
            color="white"
            size="2xl"
            borderRadius="full"
            _hover={{ bg: "#cc4800" }}
            {...props}
        >
            <Flex align="center" gap={2}>
                <Icon as={LuUser} />
                Login/Signup
            </Flex>
        </Button>
    );
};