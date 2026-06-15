// src/components/molecules/TimeRangeInput.tsx
import { HStack, Input, Text } from "@chakra-ui/react";
import type { UseFormRegister, FieldValues } from "react-hook-form";

interface TimeRangeInputProps {
    register: UseFormRegister<FieldValues>;
}

export const TimeRangeInput = ({ register }: TimeRangeInputProps) => {
    return (
        <HStack w="full" gap={2}>
            <Input
                {...register("openTime", { required: true })}
                type="time"
                size="md"
            />
            <Text fontWeight="bold" color="gray.500">
                -
            </Text>
            <Input
                {...register("closeTime", { required: true })}
                type="time"
                size="md"
            />
        </HStack>
    );
};