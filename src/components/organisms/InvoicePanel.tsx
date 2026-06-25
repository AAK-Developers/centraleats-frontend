import { Box } from "@chakra-ui/react";
import { InvoiceHeader } from "../molecules/invoice/InvoiceHeader";
import { InvoiceCustomerInfo } from "../molecules/invoice/InvoiceCustomerInfo";
import { InvoiceItemsTable, type InvoiceItemData } from "./InvoiceItemsTable";
import { InvoiceTotals } from "../molecules/invoice/InvoiceTotals";
import { InvoiceQR } from "../molecules/invoice/InvoiceQR";
import { InvoiceActions } from "../molecules/invoice/InvoiceActions";

interface InvoicePanelProps {
    invoiceNumber: string;
    date: string;
    restaurant: {
        name: string;
        address: string;
        city: string;
    };
    customer: {
        name: string;
        address: string;
    };
    items: InvoiceItemData[];
    paymentMethod: string;
    amountPaid: number;
    onShare?: () => void;
    onDownload?: () => void;
    onSeguirPedido: () => void;
}

export const MOCK_INVOICE: Omit<InvoicePanelProps, "onSeguirPedido"> = {
    invoiceNumber: "F-001",
    date: new Date().toLocaleDateString("es-EC"),
    restaurant: {
        name: "Mañaz Cafetería",
        address: "Carrera 70 #17a-50",
        city: "Quito, Ecuador",
    },
    customer: {
        name: "Aquiles Parra",
        address: "Carrera 70 #17a-50",
    },
    items: [
        { code: "1", name: "Almuerzo Ejecutivo", quantity: 2, unitPrice: 2.90 },
        { code: "2", name: "Jugo Natural", quantity: 1, unitPrice: 1.50 },
        { code: "3", name: "Empanada", quantity: 3, unitPrice: 1.00 },
    ],
    paymentMethod: "Efectivo",
    amountPaid: 15.00,
};

export const InvoicePanel = ({
    invoiceNumber,
    date,
    restaurant,
    customer,
    items,
    paymentMethod,
    amountPaid,
    onShare,
    onDownload,
    onSeguirPedido,
}: InvoicePanelProps) => {
    const subtotal = items.reduce(
        (acc, item) => acc + item.unitPrice * item.quantity,
        0
    );
    const change = amountPaid - subtotal;
    const qrValue = `Factura:${invoiceNumber}|Total:${subtotal.toFixed(2)}|Restaurante:${restaurant.name}`;

    return (
        <Box flex={1} display="flex" flexDirection="column" overflow="hidden">
            <Box
                flex={1}
                overflowY="auto"
                px={{ base: 4, sm: 6, md: 8 }}
                py={{ base: 4, md: 6 }}
                maxW={{ base: "100%", lg: "680px" }}
                mx="auto"
                w="full"
            >
                <InvoiceHeader
                    restaurantName={restaurant.name}
                    invoiceNumber={invoiceNumber}
                    date={date}
                />

                <InvoiceCustomerInfo
                    customerName={customer.name}
                    customerAddress={customer.address}
                    paymentMethod={paymentMethod}
                />

                <InvoiceItemsTable items={items} />

                <InvoiceTotals
                    subtotal={subtotal}
                    amountPaid={amountPaid}
                    change={change}
                />

                <Box mb={6} />

                <InvoiceQR value={qrValue} />

                <InvoiceActions
                    onShare={onShare}
                    onDownload={onDownload}
                    onSeguirPedido={onSeguirPedido}
                />
            </Box>
        </Box>
    );
};
