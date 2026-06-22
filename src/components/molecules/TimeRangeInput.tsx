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
                fontSize="xl"
                size="lg"
            />
            <Text fontWeight="bold" color="gray.500" fontSize="xl">
                -
            </Text>
            <Input
                {...register("closeTime", { required: true })}
                type="time"
                fontSize="xl"
                size="lg"
            />
        </HStack>
    );
};