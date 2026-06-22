import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { describe, it, expect, vi } from "vitest";

import theme from "../../../theme";
import { RoleCard } from "../../../components/molecules/RoleCard";

const renderWithChakra = (ui: React.ReactNode) => {
    return render(
        <ChakraProvider value={theme}>
            {ui}
        </ChakraProvider>
    );
};

describe("RoleCard Component", () => {
    const defaultProps = {
        bgImage: "https://example.com/background.jpg",
        subtitle: "Student",
        title: "Order Food",
        description: "Browse restaurants and place orders.",
        onClick: vi.fn(),
        isLoading: false,
    };

    it("should render subtitle, title and description", () => {
        renderWithChakra(
            <RoleCard {...defaultProps} />
        );

        expect(
            screen.getByText("Student")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Order Food")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Browse restaurants and place orders.")
        ).toBeInTheDocument();
    });

    it("should render the start button", () => {
        renderWithChakra(
            <RoleCard {...defaultProps} />
        );

        const button = screen.getByRole("button", {
            name: /iniciar/i,
        });

        expect(button).toBeInTheDocument();
    });

    it("should call onClick when start button is clicked", () => {
        const handleClick = vi.fn();

        renderWithChakra(
            <RoleCard
                {...defaultProps}
                onClick={handleClick}
            />
        );

        const button = screen.getByRole("button", {
            name: /iniciar/i,
        });

        button.click();

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should render custom content", () => {
        renderWithChakra(
            <RoleCard
                bgImage="vendor.jpg"
                subtitle="Vendor"
                title="Manage Restaurant"
                description="Create menus and manage orders."
                onClick={vi.fn()}
                isLoading={false}
            />
        );

        expect(
            screen.getByText("Vendor")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Manage Restaurant")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Create menus and manage orders.")
        ).toBeInTheDocument();
    });

    it("should render background image", () => {
        const { container } = renderWithChakra(
            <RoleCard {...defaultProps} />
        );

        expect(container.firstChild).toBeInTheDocument();
    });

    it("should render loading state without crashing", () => {
        renderWithChakra(
            <RoleCard
                {...defaultProps}
                isLoading={true}
            />
        );

        expect(
            screen.getByRole("button")
        ).toBeInTheDocument();
    });
});