import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { describe, it, expect } from "vitest";

import theme from "../../../theme";
import { FormCard } from "../../../components/molecules/FormCard";

const renderWithChakra = (ui: React.ReactNode) => {
    return render(
        <ChakraProvider value={theme}>
            {ui}
        </ChakraProvider>
    );
};

describe("FormCard Component", () => {
    it("should render its children", () => {
        renderWithChakra(
            <FormCard>
                <div>Form Content</div>
            </FormCard>
        );

        expect(
            screen.getByText("Form Content")
        ).toBeInTheDocument();
    });

    it("should render multiple children", () => {
        renderWithChakra(
            <FormCard>
                <div>First Field</div>
                <div>Second Field</div>
            </FormCard>
        );

        expect(
            screen.getByText("First Field")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Second Field")
        ).toBeInTheDocument();
    });

    it("should render nested form elements", () => {
        renderWithChakra(
            <FormCard>
                <input aria-label="name" />
                <button>Submit</button>
            </FormCard>
        );

        expect(
            screen.getByRole("textbox", {
                name: /name/i,
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: /submit/i,
            })
        ).toBeInTheDocument();
    });

    it("should render without crashing when empty", () => {
        const { container } = renderWithChakra(
            <FormCard>
                {null}
            </FormCard>
        );

        expect(container).toBeInTheDocument();
    });
});