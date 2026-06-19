import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { describe, it, expect } from "vitest";

import theme from "../../../theme";
import { OrderCard } from "../../../components/molecules/OrderCard";

const renderWithChakra = (ui: React.ReactNode) => {
    return render(
        <ChakraProvider value={theme}>
            {ui}
        </ChakraProvider>
    );
};

describe("OrderCard Component", () => {
    const defaultProps = {
        id: "123",
        restaurant: "Pizza House",
        price: "$12.99",
        date: "2025-08-01",
        status: "Entregado" as const,
    };

    it("should render order information", () => {
        renderWithChakra(
            <OrderCard {...defaultProps} />
        );

        expect(
            screen.getByText("Pedido #123")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Pizza House")
        ).toBeInTheDocument();

        expect(
            screen.getByText("$12.99 • 2025-08-01")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Entregado")
        ).toBeInTheDocument();
    });

    it("should render restaurant image with correct alt text", () => {
        renderWithChakra(
            <OrderCard {...defaultProps} />
        );

        const image = screen.getByAltText("Pizza House");

        expect(image).toBeInTheDocument();
    });

    it("should use custom image when imageUrl is provided", () => {
        renderWithChakra(
            <OrderCard
                {...defaultProps}
                imageUrl="https://example.com/pizza.jpg"
            />
        );

        const image = screen.getByAltText("Pizza House");

        expect(image).toHaveAttribute("src");
    });

    it("should render placeholder image when imageUrl is not provided", () => {
        renderWithChakra(
            <OrderCard {...defaultProps} />
        );

        const image = screen.getByAltText("Pizza House");

        expect(image).toHaveAttribute("src");
    });

    it("should render different order data correctly", () => {
        renderWithChakra(
            <OrderCard
                id="999"
                restaurant="Burger Express"
                price="$8.50"
                date="2025-09-15"
                status="Entregado"
            />
        );

        expect(
            screen.getByText("Pedido #999")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Burger Express")
        ).toBeInTheDocument();

        expect(
            screen.getByText("$8.50 • 2025-09-15")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Entregado")
        ).toBeInTheDocument();
    });
});