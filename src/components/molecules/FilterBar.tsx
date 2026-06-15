import { HStack, Button } from "@chakra-ui/react";

interface FilterBarProps {
    filters: string[];
    activeFilter: string;
    onFilterChange: (filter: string) => void;
}

export const FilterBar = ({ filters, activeFilter, onFilterChange }: FilterBarProps) => {
    return (
        <HStack overflowX="auto" mb={6} gap={2} pb={2} css={{ '&::-webkit-scrollbar': { display: 'none' } }}>
            {filters.map((filter) => {
                const isActive = activeFilter === filter;
                return (
                    <Button
                        px={6}
                        h="40px"
                        key={filter}
                        borderRadius="full"
                        size="sm"
                        bg={isActive ? "#30B2BC" : "#D1D1D1"}
                        color={isActive ? "white" : "#042E63"}
                        _hover={{ bg: isActive ? "#299ca4" : "#c0c0c0" }}
                        onClick={() => onFilterChange(filter)}
                    >
                        {filter}
                    </Button>
                );
            })}
        </HStack>
    );
};