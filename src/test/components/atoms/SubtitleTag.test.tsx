import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { describe, it, expect } from "vitest";

import theme from "../../../theme";
import { SubtitleTag } from "../../../components/atoms/SubtitleTag";

const renderWithChakra = (ui: React.ReactNode) => {
    return render(
        <ChakraProvider value={theme}>
            {ui}
        </ChakraProvider>
    );
};

describe("SubtitleTag Component", () => {
    it("should render the provided text", () => {
        renderWithChakra(
            <SubtitleTag>
                Featured Restaurant
            </SubtitleTag>
        );

        expect(
            screen.getByText("Featured Restaurant")
        ).toBeInTheDocument();
    });

    it("should render custom children", () => {
        renderWithChakra(
            <SubtitleTag>
                Special Offer
            </SubtitleTag>
        );

        expect(
            screen.getByText("Special Offer")
        ).toBeInTheDocument();
    });

    it("should accept custom props", () => {
        renderWithChakra(
            <SubtitleTag data-testid="subtitle-tag">
                Custom Props
            </SubtitleTag>
        );

        const tag = screen.getByTestId("subtitle-tag");

        expect(tag).toBeInTheDocument();
    });

    it("should render nested elements", () => {
        renderWithChakra(
            <SubtitleTag>
                <span>Nested Content</span>
            </SubtitleTag>
        );

        expect(
            screen.getByText("Nested Content")
        ).toBeInTheDocument();
    });

    it("should render without crashing when empty", () => {
        renderWithChakra(
            <SubtitleTag />
        );

        const textElement = document.querySelector("p");

        expect(textElement).toBeInTheDocument();
    });
});