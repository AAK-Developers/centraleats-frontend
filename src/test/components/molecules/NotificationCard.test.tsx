import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { describe, it, expect } from "vitest";

import theme from "../../../theme";
import { NotificationCard } from "../../../components/molecules/NotificationCard";

const renderWithChakra = (ui: React.ReactNode) => {
    return render(
        <ChakraProvider value={theme}>
            {ui}
        </ChakraProvider>
    );
};

describe("NotificationCard Component", () => {
    it("should render the title and restaurant", () => {
        renderWithChakra(
            <NotificationCard
                title="Pedido Listo"
                restaurant="Pizza House"
                status="Completado"
            />
        );

        expect(
            screen.getByText("Pedido Listo • Pizza House")
        ).toBeInTheDocument();
    });

    it("should render the status", () => {
        renderWithChakra(
            <NotificationCard
                title="Pedido Listo"
                restaurant="Pizza House"
                status="Completado"
            />
        );

        expect(
            screen.getByText("Completado")
        ).toBeInTheDocument();
    });

    it("should render different notification data", () => {
        renderWithChakra(
            <NotificationCard
                title="Nuevo Pedido"
                restaurant="Burger Express"
                status="Pendiente"
            />
        );

        expect(
            screen.getByText("Nuevo Pedido • Burger Express")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Pendiente")
        ).toBeInTheDocument();
    });

    it("should render correctly when status is empty", () => {
        renderWithChakra(
            <NotificationCard
                title="Pedido"
                restaurant="Restaurant"
                status=""
            />
        );

        expect(
            screen.getByText("Pedido • Restaurant")
        ).toBeInTheDocument();
    });
});