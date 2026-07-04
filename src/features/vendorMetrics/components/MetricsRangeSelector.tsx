import { ButtonGroup, Button } from "@chakra-ui/react";
import type { MetricsRange } from "../types/vendorMetrics.types";

interface Props {
  value: MetricsRange;
  onChange: (range: MetricsRange) => void;
}

export function MetricsRangeSelector({ value, onChange }: Props) {
  return (
    <ButtonGroup size="sm" attached variant="outline">
      <Button 
        onClick={() => onChange("today")} 
        bg={value === "today" ? "primaryOrange" : "white"}
        color={value === "today" ? "white" : "gray.600"}
        _hover={{ bg: value === "today" ? "primaryOrange" : "gray.50" }}
      >
        Hoy
      </Button>
      <Button 
        onClick={() => onChange("7d")} 
        bg={value === "7d" ? "primaryOrange" : "white"}
        color={value === "7d" ? "white" : "gray.600"}
        _hover={{ bg: value === "7d" ? "primaryOrange" : "gray.50" }}
      >
        7 días
      </Button>
      <Button 
        onClick={() => onChange("30d")} 
        bg={value === "30d" ? "primaryOrange" : "white"}
        color={value === "30d" ? "white" : "gray.600"}
        _hover={{ bg: value === "30d" ? "primaryOrange" : "gray.50" }}
      >
        30 días
      </Button>
    </ButtonGroup>
  );
}
