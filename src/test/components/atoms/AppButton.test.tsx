import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { describe, it, expect, vi } from "vitest";

import theme from "../../../theme";
import { AppButton } from "../../../components/atoms/AppButton";

const renderWithChakra = (ui: React.ReactNode) => {
    return render(
        <ChakraProvider value={theme}>
            {ui}
        </ChakraProvider>
    );
};

describe("AppButton Component", () => {
    it("should render the button with the correct text", () => {
        renderWithChakra(
            <AppButton text="Continuar" />
        );

        const button = screen.getByRole("button", {
            name: /continuar/i,
        });

        expect(button).toBeInTheDocument();
    });

    it("should call onClick when clicked", () => {
        const handleClick = vi.fn();

        renderWithChakra(
            <AppButton
                text="Continuar"
                onClick={handleClick}
            />
        );

        const button = screen.getByRole("button", {
            name: /continuar/i,
        });

        button.click();

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should have submit type by default", () => {
        renderWithChakra(
            <AppButton text="Enviar" />
        );

        const button = screen.getByRole("button", {
            name: /enviar/i,
        });

        expect(button).toHaveAttribute("type", "submit");
    });

    it("should be disabled when disabled prop is passed", () => {
        renderWithChakra(
            <AppButton
                text="Disabled"
                disabled
            />
        );

        const button = screen.getByRole("button");

        expect(button).toBeDisabled();
    });

    it("should render loading state when isLoading is true", () => {
        renderWithChakra(
            <AppButton
                text="Loading"
                isLoading
            />
        );

        const button = screen.getByRole("button");

        expect(button).toBeInTheDocument();
    });

    it("should render the arrow icon", () => {
        const { container } = renderWithChakra(
            <AppButton text="Continuar" />
        );

        const svg = container.querySelector("svg");

        expect(svg).toBeInTheDocument();
    });
}); 