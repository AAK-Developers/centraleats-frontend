import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { describe, it, expect, vi } from "vitest";

import theme from "../../../theme";
import { TimeRangeInput } from "../../../components/molecules/TimeRangeInput";

const renderWithChakra = (ui: React.ReactNode) => {
    return render(
        <ChakraProvider value={theme}>
            {ui}
        </ChakraProvider>
    );
};

describe("TimeRangeInput Component", () => {
    const mockRegister = vi.fn((name: string) => ({
        name,
        onChange: vi.fn(),
        onBlur: vi.fn(),
        ref: vi.fn(),
    }));

    it("should render two time inputs", () => {
        renderWithChakra(
            <TimeRangeInput register={mockRegister as any} />
        );

        const inputs = screen.getAllByDisplayValue("");
        expect(inputs).toHaveLength(2);
    });

    it("should call register for openingTime and closingTime", () => {
        renderWithChakra(
            <TimeRangeInput register={mockRegister as any} />
        );

        expect(mockRegister).toHaveBeenCalledWith(
            "openingTime",
            { required: true }
        );

        expect(mockRegister).toHaveBeenCalledWith(
            "closingTime",
            { required: true }
        );
    });

    it("should render the separator dash", () => {
        renderWithChakra(
            <TimeRangeInput register={mockRegister as any} />
        );

        expect(screen.getByText("-")).toBeInTheDocument();
    });

    it("should render inputs of type time", () => {
        const { container } = renderWithChakra(
            <TimeRangeInput register={mockRegister as any} />
        );

        const inputs = container.querySelectorAll('input[type="time"]');
        expect(inputs).toHaveLength(2);
    });
});