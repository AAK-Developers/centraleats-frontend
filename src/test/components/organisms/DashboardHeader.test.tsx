import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChakraProvider } from "@chakra-ui/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { DashboardHeader } from "../../../components/organisms/DashboardHeader";

const mockClearAll = vi.fn();

vi.mock("../../../hooks/useNotifications", () => ({
    useNotifications: () => ({
        notifications: [
            {
                title: "Pedido listo",
                restaurant: "Pizza House",
                status: "Completado",
            },
        ],
        clearAll: mockClearAll,
    }),
}));

vi.mock("../../../components/organisms/NotificationPanel", () => ({
    NotificationPanel: ({ isOpen }: { isOpen: boolean }) => (
        <div data-testid="notification-panel">
            {isOpen ? "OPEN" : "CLOSED"}
        </div>
    ),
}));

vi.mock("../../../components/organisms/ProfilePanel", () => ({
    ProfilePanel: ({ isOpen }: { isOpen: boolean }) => (
        <div data-testid="profile-panel">
            {isOpen ? "OPEN" : "CLOSED"}
        </div>
    ),
}));

const renderWithChakra = (ui: React.ReactNode) => {
    return render(
        <ChakraProvider>
            {ui}
        </ChakraProvider>
    );
};

describe("DashboardHeader Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should render the logo", () => {
        renderWithChakra(
            <DashboardHeader userName="Kevin" />
        );

        expect(
            screen.getByAltText("Logo")
        ).toBeInTheDocument();
    });

    it("should render user name", () => {
        renderWithChakra(
            <DashboardHeader userName="Kevin" />
        );

        expect(
            screen.getByText("Hola, Kevin")
        ).toBeInTheDocument();
    });

    it("should render notification button", () => {
        renderWithChakra(
            <DashboardHeader userName="Kevin" />
        );

        expect(
            screen.getByLabelText("Notificaciones")
        ).toBeInTheDocument();
    });

    it("should render cart button", () => {
        renderWithChakra(
            <DashboardHeader userName="Kevin" />
        );

        expect(
            screen.getByLabelText("Carrito")
        ).toBeInTheDocument();
    });

    it("should open notification panel when notification button is clicked", async () => {
        const user = userEvent.setup();
        renderWithChakra(
            <DashboardHeader userName="Kevin" />
        );

        const button = screen.getByLabelText("Notificaciones");

        await user.click(button);

        expect(
            screen.getByTestId("notification-panel")
        ).toHaveTextContent("OPEN");
    });

    it("should open profile panel when profile button is clicked", async () => {
        const user = userEvent.setup();
        renderWithChakra(
            <DashboardHeader userName="Kevin" />
        );

        const profileButton = screen.getByText("Hola, Kevin");

        await user.click(profileButton);

        expect(
            screen.getByTestId("profile-panel")
        ).toHaveTextContent("OPEN");
    });

    it("should call onCartClick when cart button is clicked", async () => {
        const user = userEvent.setup();
        const handleCartClick = vi.fn();

        renderWithChakra(
            <DashboardHeader
                userName="Kevin"
                onCartClick={handleCartClick}
            />
        );

        const cartButton = screen.getByLabelText("Carrito");

        await user.click(cartButton);

        expect(handleCartClick).toHaveBeenCalledTimes(1);
    });

    it("should render panels initially closed", () => {
        renderWithChakra(
            <DashboardHeader userName="Kevin" />
        );

        expect(
            screen.getByTestId("notification-panel")
        ).toHaveTextContent("CLOSED");

        expect(
            screen.getByTestId("profile-panel")
        ).toHaveTextContent("CLOSED");
    });
});
