import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { describe, it, expect, vi } from "vitest";

import theme from "../../../theme";
import { CloseButton } from "../../../components/atoms/CloseButton";

const renderWithChakra = (ui: React.ReactNode) => {
    return render(
        <ChakraProvider value={theme}>
            {ui}
        </ChakraProvider>
    );
};

describe("CloseButton Component", () => {
    it("should render the button", () => {
        renderWithChakra(
            <CloseButton onClick={() => { }} />
        );

        const button = screen.getByRole("button", {
            name: /cerrar panel/i,
        });

        expect(button).toBeInTheDocument();
    });

    it("should call onClick when clicked", () => {
        const handleClick = vi.fn();

        renderWithChakra(
            <CloseButton onClick={handleClick} />
        );

        const button = screen.getByRole("button", {
            name: /cerrar panel/i,
        });

        button.click();

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should be disabled when disabled prop is passed", () => {
        renderWithChakra(
            <CloseButton
                onClick={() => { }}
                disabled
            />
        );

        const button = screen.getByRole("button", {
            name: /cerrar panel/i,
        });

        expect(button).toBeDisabled();
    });

    it("should render the close icon", () => {
        const { container } = renderWithChakra(
            <CloseButton onClick={() => { }} />
        );

        const svg = container.querySelector("svg");

        expect(svg).toBeInTheDocument();
    });

    it("should accept custom props", () => {
        renderWithChakra(
            <CloseButton
                onClick={() => { }}
                data-testid="close-button"
            />
        );

        const button = screen.getByTestId("close-button");

        expect(button).toBeInTheDocument();
    });
});