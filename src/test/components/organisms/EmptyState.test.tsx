import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { describe, it, expect } from "vitest";
import { FaInbox } from "react-icons/fa";

import theme from "../../../theme";
import { EmptyState } from "../../../components/organisms/EmptyState";

const renderWithChakra = (ui: React.ReactNode) => {
    return render(
        <ChakraProvider value={theme}>
            {ui}
        </ChakraProvider>
    );
};

describe("EmptyState Component", () => {
    it("should render the provided message", () => {
        renderWithChakra(
            <EmptyState
                icon={FaInbox}
                message="No data available"
            />
        );

        expect(
            screen.getByText("No data available")
        ).toBeInTheDocument();
    });

    it("should render different messages", () => {
        renderWithChakra(
            <EmptyState
                icon={FaInbox}
                message="No notifications found"
            />
        );

        expect(
            screen.getByText("No notifications found")
        ).toBeInTheDocument();
    });

    it("should render the icon", () => {
        const { container } = renderWithChakra(
            <EmptyState
                icon={FaInbox}
                message="Empty"
            />
        );

        const svg = container.querySelector("svg");

        expect(svg).toBeInTheDocument();
    });

    it("should render icon and message together", () => {
        const { container } = renderWithChakra(
            <EmptyState
                icon={FaInbox}
                message="Nothing here"
            />
        );

        expect(
            screen.getByText("Nothing here")
        ).toBeInTheDocument();

        expect(
            container.querySelector("svg")
        ).toBeInTheDocument();
    });

    it("should render long messages correctly", () => {
        renderWithChakra(
            <EmptyState
                icon={FaInbox}
                message="There are currently no notifications available for this user."
            />
        );

        expect(
            screen.getByText(
                "There are currently no notifications available for this user."
            )
        ).toBeInTheDocument();
    });
});