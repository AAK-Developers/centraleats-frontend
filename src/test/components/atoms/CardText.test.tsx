import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { describe, it, expect } from "vitest";

import theme from "../../../theme";
import { CardText } from "../../../components/atoms/CardText";

const renderWithChakra = (ui: React.ReactNode) => {
    return render(
        <ChakraProvider value={theme}>
            {ui}
        </ChakraProvider>
    );
};

describe("CardText Component", () => {
    it("should render the provided text", () => {
        renderWithChakra(
            <CardText>Test Content</CardText>
        );

        expect(
            screen.getByText("Test Content")
        ).toBeInTheDocument();
    });

    it("should render description variant by default", () => {
        renderWithChakra(
            <CardText>Description Text</CardText>
        );

        const text = screen.getByText("Description Text");

        expect(text).toBeInTheDocument();
    });

    it("should render title variant", () => {
        renderWithChakra(
            <CardText variant="title">
                Title Text
            </CardText>
        );

        const text = screen.getByText("Title Text");

        expect(text).toBeInTheDocument();
    });

    it("should accept custom props", () => {
        renderWithChakra(
            <CardText data-testid="card-text">
                Custom Props
            </CardText>
        );

        const text = screen.getByTestId("card-text");

        expect(text).toBeInTheDocument();
    });

    it("should render complex children", () => {
        renderWithChakra(
            <CardText>
                <span>Nested Content</span>
            </CardText>
        );

        expect(
            screen.getByText("Nested Content")
        ).toBeInTheDocument();
    });
});