import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { describe, it, expect, vi } from "vitest";

import theme from "../../../theme";
import { ClearButton } from "../../../components/atoms/ClearButton";

const renderWithChakra = (ui: React.ReactNode) => {
    return render(
        <ChakraProvider value={theme}>
            {ui}
        </ChakraProvider>
    );
};

describe("ClearButton Component", () => {
    it("should render the button with text", () => {
        renderWithChakra(
            <ClearButton>
                Clear
            </ClearButton>
        );

        const button = screen.getByRole("button", {
            name: /clear/i,
        });

        expect(button).toBeInTheDocument();
    });

    it("should call onClick when clicked", () => {
        const handleClick = vi.fn();

        renderWithChakra(
            <ClearButton onClick={handleClick}>
                Clear
            </ClearButton>
        );

        const button = screen.getByRole("button");

        button.click();

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should be disabled when disabled prop is passed", () => {
        renderWithChakra(
            <ClearButton disabled>
                Clear
            </ClearButton>
        );

        const button = screen.getByRole("button");

        expect(button).toBeDisabled();
    });

    it("should accept custom props", () => {
        renderWithChakra(
            <ClearButton data-testid="clear-button">
                Clear
            </ClearButton>
        );

        const button = screen.getByTestId("clear-button");

        expect(button).toBeInTheDocument();
    });

    it("should render custom children", () => {
        renderWithChakra(
            <ClearButton>
                Reset Form
            </ClearButton>
        );

        expect(
            screen.getByText("Reset Form")
        ).toBeInTheDocument();
    });
});