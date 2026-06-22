import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { describe, it, expect, vi } from "vitest";

import theme from "../../../theme";
import { AuthButton } from "../../../components/atoms/AuthButton";

const renderWithChakra = (ui: React.ReactNode) => {
    return render(
        <ChakraProvider value={theme}>
            {ui}
        </ChakraProvider>
    );
};

describe("AuthButton Component", () => {
    it("should render the Login/Signup text", () => {
        renderWithChakra(
            <AuthButton />
        );

        const button = screen.getByRole("button", {
            name: /login\/signup/i,
        });

        expect(button).toBeInTheDocument();
    });

    it("should call onClick when clicked", () => {
        const handleClick = vi.fn();

        renderWithChakra(
            <AuthButton onClick={handleClick} />
        );

        const button = screen.getByRole("button");

        button.click();

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should be disabled when disabled prop is passed", () => {
        renderWithChakra(
            <AuthButton disabled />
        );

        const button = screen.getByRole("button");

        expect(button).toBeDisabled();
    });

    it("should render the user icon", () => {
        const { container } = renderWithChakra(
            <AuthButton />
        );

        const svg = container.querySelector("svg");

        expect(svg).toBeInTheDocument();
    });

    it("should accept custom button props", () => {
        renderWithChakra(
            <AuthButton data-testid="auth-button" />
        );

        const button = screen.getByTestId("auth-button");

        expect(button).toBeInTheDocument();
    });
});