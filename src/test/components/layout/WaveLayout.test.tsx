import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { describe, it, expect } from "vitest";

import theme from "../../../theme";
import { WaveLayout } from "../../../components/layout/WaveLayout";

const renderWithChakra = (ui: React.ReactNode) => {
    return render(
        <ChakraProvider value={theme}>
            {ui}
        </ChakraProvider>
    );
};

describe("WaveLayout Component", () => {
    it("should render its children", () => {
        renderWithChakra(
            <WaveLayout>
                <div>Wave Content</div>
            </WaveLayout>
        );

        expect(
            screen.getByText("Wave Content")
        ).toBeInTheDocument();
    });

    it("should render multiple children", () => {
        renderWithChakra(
            <WaveLayout>
                <div>First Child</div>
                <div>Second Child</div>
            </WaveLayout>
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
            <WaveLayout>
                <button>Click Me</button>
            </WaveLayout>
        );

        expect(
            screen.getByRole("button", {
                name: /click me/i,
            })
        ).toBeInTheDocument();
    });

    it("should render the decorative wave svgs", () => {
        const { container } = renderWithChakra(
            <WaveLayout>
                <div>Content</div>
            </WaveLayout>
        );

        const svgs = container.querySelectorAll("svg");

        expect(svgs).toHaveLength(2);
    });

    it("should render without crashing when empty", () => {
        const { container } = renderWithChakra(
            <WaveLayout>
                {null}
            </WaveLayout>
        );

        expect(container).toBeInTheDocument();
    });
});