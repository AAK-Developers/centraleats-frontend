import { Box, Text, Icon, Flex } from "@chakra-ui/react";
import { FaSortAmountDown } from "react-icons/fa";
import type { SortOption } from "../../../hooks/useProductFilters";

interface SortDropdownProps {
    value: SortOption;
    onChange: (value: SortOption) => void;
}

const OPTIONS: { value: SortOption; label: string; disabled?: boolean }[] = [
    { value: "relevancia", label: "Relevancia" },
    { value: "precio_asc", label: "Precio: menor a mayor" },
    { value: "precio_desc", label: "Precio: mayor a menor" },
    { value: "nombre_az", label: "Nombre: A-Z" },
    { value: "recientes", label: "Más recientes (próximamente)", disabled: true },
];

export const SortDropdown = ({ value, onChange }: SortDropdownProps) => {
    return (
        <Flex
            align="center"
            gap={2}
            bg="white"
            border="1.5px solid"
            borderColor="gray.200"
            borderRadius="full"
            px={3.5}
            py={2}
            flexShrink={0}
            _hover={{ borderColor: "#2DC6B8" }}
            transition="border-color 0.15s"
        >
            <Icon as={FaSortAmountDown} color="#2DC6B8" boxSize={3.5} />
            <Text fontSize="xs" color="gray.400" fontWeight="medium" display={{ base: "none", sm: "block" }}>
                Ordenar:
            </Text>
            <Box position="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value as SortOption)}
                    style={{
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#042E63",
                        cursor: "pointer",
                        paddingRight: "4px",
                    }}
                >
                    {OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </Box>
        </Flex>
    );
};
