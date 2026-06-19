import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { describe, it, expect } from "vitest";

import theme from "../../../theme";
import { RestaurantCard } from "../../../components/molecules/RestaurantCard";

const renderWithChakra = (ui: React.ReactNode) => {
    return render(
        <ChakraProvider value={theme}>
            {ui}
        </ChakraProvider>
    );
};

describe("RestaurantCard Component", () => {
    const defaultProps = {
        name: "Pizza House",
        category: "Italian",
        time: "25-30 min",
        rating: 4.8,
        image: "https://example.com/pizza.jpg",
    };

    it("should render restaurant information", () => {
        renderWithChakra(
            <RestaurantCard {...defaultProps} />
        );

        expect(
            screen.getByText("Pizza House")
        ).toBeInTheDocument();

        expect(
            screen.getByText("• Italian")
        ).toBeInTheDocument();

        expect(
            screen.getByText("25-30 min")
        ).toBeInTheDocument();

        expect(
            screen.getByText("4.8")
        ).toBeInTheDocument();
    });

    it("should render restaurant image", () => {
        renderWithChakra(
            <RestaurantCard {...defaultProps} />
        );

        const image = screen.getByAltText("Pizza House");

        expect(image).toBeInTheDocument();
    });

    it("should render custom restaurant data", () => {
        renderWithChakra(
            <RestaurantCard
                name="Burger Express"
                category="Fast Food"
                time="15-20 min"
                rating={4.5}
                image="https://example.com/burger.jpg"
            />
        );

        expect(
            screen.getByText("Burger Express")
        ).toBeInTheDocument();

        expect(
            screen.getByText("• Fast Food")
        ).toBeInTheDocument();

        expect(
            screen.getByText("15-20 min")
        ).toBeInTheDocument();

        expect(
            screen.getByText("4.5")
        ).toBeInTheDocument();
    });

    it("should render clock and star icons", () => {
        const { container } = renderWithChakra(
            <RestaurantCard {...defaultProps} />
        );

        const icons = container.querySelectorAll("svg");

        expect(icons.length).toBeGreaterThanOrEqual(2);
    });

    it("should render rating as a number", () => {
        renderWithChakra(
            <RestaurantCard
                {...defaultProps}
                rating={5}
            />
        );

        expect(
            screen.getByText("5")
        ).toBeInTheDocument();
    });
});