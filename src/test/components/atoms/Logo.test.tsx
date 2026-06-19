import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { describe, it, expect } from "vitest";

import theme from "../../../theme";
import { Logo } from "../../../components/atoms/Logo";

const renderWithChakra = (ui: React.ReactNode) => {
    return render(
        <ChakraProvider value={theme}>
            {ui}
        </ChakraProvider>
    );
};

describe("Logo Component", () => {
    it("should render the logo image", () => {
        renderWithChakra(
            <Logo />
        );

        const image = screen.getByAltText("Logo");

        expect(image).toBeInTheDocument();
    });

    it("should use the default alt text", () => {
        renderWithChakra(
            <Logo />
        );

        expect(
            screen.getByAltText("Logo")
        ).toBeInTheDocument();
    });

    it("should render a custom image", () => {
        const customImage = "https://example.com/logo.png";

        renderWithChakra(
            <Logo image={customImage} />
        );

        const image = screen.getByAltText("Logo");

        expect(image).toHaveAttribute("src");
    });

    it("should accept a custom size", () => {
        renderWithChakra(
            <Logo size="100px" />
        );

        const image = screen.getByAltText("Logo");

        expect(image).toBeInTheDocument();
    });

    it("should accept custom props", () => {
        renderWithChakra(
            <Logo data-testid="logo-image" />
        );

        const image = screen.getByTestId("logo-image");

        expect(image).toBeInTheDocument();
    });
});