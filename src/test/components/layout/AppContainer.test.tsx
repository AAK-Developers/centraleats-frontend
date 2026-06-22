import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { describe, it, expect } from "vitest";

import theme from "../../../theme";
import { AppContainer } from "../../../components/layout/AppContainer";

const renderWithChakra = (ui: React.ReactNode) => {
    return render(
        <ChakraProvider value={theme}>
            {ui}
        </ChakraProvider>
    );
};

describe("AppContainer Component", () => {
    it("should render its children", () => {
        renderWithChakra(
            <AppContainer>
                <div>Container Content</div>
            </AppContainer>
        );

        expect(
            screen.getByText("Container Content")
        ).toBeInTheDocument();
    });

    it("should render multiple children", () => {
        renderWithChakra(
            <AppContainer>
                <div>First Child</div>
                <div>Second Child</div>
            </AppContainer>
        );

        expect(
            screen.getByText("First Child")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Second Child")
        ).toBeInTheDocument();
    });

    it("should render nested components", () => {
        renderWithChakra(
            <AppContainer>
                <button>Click Me</button>
            </AppContainer>
        );

        expect(
            screen.getByRole("button", {
                name: /click me/i,
            })
        ).toBeInTheDocument();
    });

    it("should render without crashing when empty", () => {
        const { container } = renderWithChakra(
            <AppContainer>
                {null}
            </AppContainer>
        );

        expect(container).toBeInTheDocument();
    });
});