import { render, screen, fireEvent } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { describe, it, expect, vi } from "vitest";

import theme from "../../../theme";
import { NotificationPanel } from "../../../components/organisms/NotificationPanel";

vi.mock("../../../components/molecules/NotificationCard", () => ({
    NotificationCard: ({ title }: { title: string }) => (
        <div data-testid="notification-card">{title}</div>
    ),
}));

vi.mock("../../../components/organisms/EmptyState", () => ({
    EmptyState: ({ message }: { message: string }) => (
        <div data-testid="empty-state">{message}</div>
    ),
}));

vi.mock("../../../components/atoms/ClearButton", () => ({
    ClearButton: ({
        children,
        onClick,
        disabled,
    }: {
        children: React.ReactNode;
        onClick: () => void;
        disabled?: boolean;
    }) => (
        <button
            data-testid="clear-button"
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    ),
}));

vi.mock("../../../components/atoms/CloseButton", () => ({
    CloseButton: ({ onClick }: { onClick: () => void }) => (
        <button
            data-testid="close-button"
            onClick={onClick}
        >
            Close
        </button>
    ),
}));

const renderWithChakra = (ui: React.ReactNode) => {
    return render(
        <ChakraProvider value={theme}>
            {ui}
        </ChakraProvider>
    );
};

describe("NotificationPanel Component", () => {
    const mockOnClose = vi.fn();
    const mockOnClearAll = vi.fn();

    const notifications = [
        {
            id: "1",
            title: "Pedido listo",
            restaurant: "Pizza House",
            status: "Completado",
        },
        {
            id: "2",
            title: "Nuevo pedido",
            restaurant: "Burger Express",
            status: "Pendiente",
        },
    ];

    it("should not render when isOpen is false", () => {
        renderWithChakra(
            <NotificationPanel
                isOpen={false}
                onClose={mockOnClose}
                notifications={notifications}
                onClearAll={mockOnClearAll}
            />
        );

        expect(
            screen.queryByText("Notificaciones")
        ).not.toBeInTheDocument();
    });

    it("should render panel when isOpen is true", () => {
        renderWithChakra(
            <NotificationPanel
                isOpen={true}
                onClose={mockOnClose}
                notifications={notifications}
                onClearAll={mockOnClearAll}
            />
        );

        expect(
            screen.getByText("Notificaciones")
        ).toBeInTheDocument();
    });

    it("should render notification cards", () => {
        renderWithChakra(
            <NotificationPanel
                isOpen={true}
                onClose={mockOnClose}
                notifications={notifications}
                onClearAll={mockOnClearAll}
            />
        );

        const cards = screen.getAllByTestId(
            "notification-card"
        );

        expect(cards).toHaveLength(2);
    });

    it("should show empty state when there are no notifications", () => {
        renderWithChakra(
            <NotificationPanel
                isOpen={true}
                onClose={mockOnClose}
                notifications={[]}
                onClearAll={mockOnClearAll}
            />
        );

        expect(
            screen.getByTestId("empty-state")
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "¡Felicidades, te encuentras al día!"
            )
        ).toBeInTheDocument();
    });

    it("should call onClearAll when clear button is clicked", () => {
        renderWithChakra(
            <NotificationPanel
                isOpen={true}
                onClose={mockOnClose}
                notifications={notifications}
                onClearAll={mockOnClearAll}
            />
        );

        fireEvent.click(
            screen.getByTestId("clear-button")
        );

        expect(mockOnClearAll).toHaveBeenCalledTimes(1);
    });

    it("should call onClose when close button is clicked", () => {
        renderWithChakra(
            <NotificationPanel
                isOpen={true}
                onClose={mockOnClose}
                notifications={notifications}
                onClearAll={mockOnClearAll}
            />
        );

        fireEvent.click(
            screen.getByTestId("close-button")
        );

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should disable clear button when notifications are empty", () => {
        renderWithChakra(
            <NotificationPanel
                isOpen={true}
                onClose={mockOnClose}
                notifications={[]}
                onClearAll={mockOnClearAll}
            />
        );

        expect(
            screen.getByTestId("clear-button")
        ).toBeDisabled();
    });

    it("should enable clear button when notifications exist", () => {
        renderWithChakra(
            <NotificationPanel
                isOpen={true}
                onClose={mockOnClose}
                notifications={notifications}
                onClearAll={mockOnClearAll}
            />
        );

        expect(
            screen.getByTestId("clear-button")
        ).not.toBeDisabled();
    });
});