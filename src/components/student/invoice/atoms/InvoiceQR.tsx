import { Flex, Box } from "@chakra-ui/react";
import QRCode from "react-qr-code";

interface InvoiceQRProps {
    value: string;
}

export const InvoiceQR = ({ value }: InvoiceQRProps) => {
    return (
        <Flex justify="center" mb={6}>
            <Box
                p={{ base: 3, md: 4 }}
                bg="white"
                borderRadius="2xl"
                boxShadow="md"
                border="1px solid"
                borderColor="gray.100"
            >
                <QRCode
                    value={value}
                    size={undefined}
                    style={{
                        width: "100%",
                        maxWidth: "160px",
                        minWidth: "120px",
                        height: "auto",
                    }}
                />
            </Box>
        </Flex>
    );
};
