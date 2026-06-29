import { Flex, Box, Text, Icon } from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginationControlsProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const buildPageList = (current: number, total: number): (number | "...")[] => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: (number | "...")[] = [1];

    if (current > 3) pages.push("...");

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - 2) pages.push("...");

    pages.push(total);
    return pages;
};

export const PaginationControls = ({ page, totalPages, onPageChange }: PaginationControlsProps) => {
    if (totalPages <= 1) return null;

    const pageList = buildPageList(page, totalPages);

    const PageButton = ({ active, disabled, onClick, children }: {
        active?: boolean;
        disabled?: boolean;
        onClick?: () => void;
        children: React.ReactNode;
    }) => (
        <Box
            as="button"
            onClick={disabled ? undefined : onClick}
            minW="38px"
            h="38px"
            px={2}
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="lg"
            border="1.5px solid"
            borderColor={active ? "#042E63" : "gray.200"}
            bg={active ? "#042E63" : "white"}
            color={active ? "white" : disabled ? "gray.300" : "gray.600"}
            fontWeight={active ? "bold" : "medium"}
            fontSize="sm"
            cursor={disabled ? "not-allowed" : "pointer"}
            transition="all 0.15s"
            _hover={!active && !disabled ? { borderColor: "#2DC6B8", color: "#2DC6B8" } : {}}
        >
            {children}
        </Box>
    );

    return (
        <Flex justify="center" align="center" gap={1.5} flexWrap="wrap" py={6}>
            <PageButton disabled={page === 1} onClick={() => onPageChange(page - 1)}>
                <Flex align="center" gap={1}>
                    <Icon as={FaChevronLeft} boxSize={2.5} />
                    <Text display={{ base: "none", sm: "block" }} fontSize="xs">Anterior</Text>
                </Flex>
            </PageButton>

            {pageList.map((p, idx) =>
                p === "..." ? (
                    <Text key={`dots-${idx}`} color="gray.400" px={1} fontSize="sm">
                        …
                    </Text>
                ) : (
                    <PageButton key={p} active={p === page} onClick={() => onPageChange(p)}>
                        {p}
                    </PageButton>
                )
            )}

            <PageButton disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
                <Flex align="center" gap={1}>
                    <Text display={{ base: "none", sm: "block" }} fontSize="xs">Siguiente</Text>
                    <Icon as={FaChevronRight} boxSize={2.5} />
                </Flex>
            </PageButton>
        </Flex>
    );
};
