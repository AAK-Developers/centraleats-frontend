import { HStack, Input, Text } from "@chakra-ui/react";
import type { UseFormRegister, FieldValues } from "react-hook-form";

interface TimeRangeInputProps<T extends FieldValues> {
    register: UseFormRegister<T>;
}

export const TimeRangeInput = <T extends FieldValues>({ register }: TimeRangeInputProps<T>) => {
    return (
        <HStack w="full" gap={2}>
            <Input
                {...register("openingTime" as Parameters<UseFormRegister<T>>[0], { required: true })}
                type="time"
                fontSize="xl"
                size="lg"
            />
            <Text fontWeight="bold" color="gray.500" fontSize="xl">
                -
            </Text>
            <Input
                {...register("closingTime" as Parameters<UseFormRegister<T>>[0], { required: true })}
                type="time"
                fontSize="xl"
                size="lg"
            />
        </HStack>
    );
};