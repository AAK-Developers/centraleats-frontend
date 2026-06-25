import { render, screen, fireEvent } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import theme from "../../../theme";
import { ProfilePanel } from "../../../components/organisms/ProfilePanel";

vi.mock("@clerk/clerk-react", () => ({
    useUser: () => ({
        isLoaded: true,
        user: {
            fullName: "Kevin Moyon",
            imageUrl: "avatar.jpg",
            primaryEmailAddress: {
                emailAddress: "kevin@test.com",
            },
        },
    }),
}));

vi.mock("../../../hooks/useStudentOrders", () => ({
    useStudentOrders: () => ({
        isLoading: false,
        activeOrders: [
            {
                id: "active-1",
                status: "PREPARING",
                totalAmount: 1250,
                createdAt: "2025-08-01T12:00:00.000Z",
                vendorName: "Pizza House",
                items: [
                    { id: "item-1", productName: "Pizza", quantity: 1 }
                ]
            }
        ],
        orders: [
            {
                id: "completed-1",
                status: "COMPLETED",
                totalAmount: 800,
                createdAt: "2025-08-02T12:00:00.000Z",
                vendorName: "Burger Express",
                items: [
                    { id: "item-2", productName: "Burger", quantity: 1 }
                ]
            }
        ],
    }),
    STATUS_LABELS: {
        PENDING_PAYMENT: 'Pendiente de pago',
        PAID: 'Pagado',
        RECEIVED: 'Recibido por local',
        PREPARING: 'En preparación',
        READY: 'Listo para retirar',
        PICKED_UP: 'Retirado',
        COMPLETED: 'Completado',
        CANCELLED: 'Cancelado',
    },
    STATUS_COLORS: {
        PENDING_PAYMENT: 'orange',
        PAID: 'green',
        RECEIVED: 'blue',
        PREPARING: 'yellow',
        READY: 'teal',
        PICKED_UP: 'gray',
        COMPLETED: 'gray',
        CANCELLED: 'red',
    }
}));

vi.mock("../../../components/organisms/UserProfileHeader", () => ({
    UserProfileHeader: ({
        fullName,
        email,
    }: {
        fullName: string;
        email: string;
    }) => (
        <div data-testid="user-profile-header">
            {fullName} - {email}
        </div>
    ),
}));

vi.mock("../../../components/atoms/LogoutButton", () => ({
    LogoutButton: () => (
        <button data-testid="logout-button">
            Logout
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

describe("ProfilePanel Component", () => {
    const mockOnClose = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should not render when isOpen is false", () => {
        renderWithChakra(
            <ProfilePanel
                isOpen={false}
                onClose={mockOnClose}
            />
        );

        expect(
            screen.queryByText("Mi Perfil")
        ).not.toBeInTheDocument();
    });

    it("should render when isOpen is true", () => {
        renderWithChakra(
            <ProfilePanel
                isOpen={true}
                onClose={mockOnClose}
            />
        );

        expect(
            screen.getByText("Mi Perfil")
        ).toBeInTheDocument();
    });

    it("should render user profile information", () => {
        renderWithChakra(
            <ProfilePanel
                isOpen={true}
                onClose={mockOnClose}
            />
        );

        expect(
            screen.getByTestId("user-profile-header")
        ).toHaveTextContent("Kevin Moyon");

        expect(
            screen.getByTestId("user-profile-header")
        ).toHaveTextContent("kevin@test.com");
    });

    it("should render order history section", () => {
        renderWithChakra(
            <ProfilePanel
                isOpen={true}
                onClose={mockOnClose}
            />
        );

        expect(
            screen.getByText("Últimos pedidos")
        ).toBeInTheDocument();
    });

    it("should render all orders", () => {
        renderWithChakra(
            <ProfilePanel
                isOpen={true}
                onClose={mockOnClose}
            />
        );

        expect(screen.getByText(/Pedido #TIVE-1/i)).toBeInTheDocument();
        expect(screen.getByText(/#ETED-1/i)).toBeInTheDocument();
    });

    it("should render logout button", () => {
        renderWithChakra(
            <ProfilePanel
                isOpen={true}
                onClose={mockOnClose}
            />
        );

        expect(
            screen.getByTestId("logout-button")
        ).toBeInTheDocument();
    });

    it("should call onClose when close button is clicked", () => {
        renderWithChakra(
            <ProfilePanel
                isOpen={true}
                onClose={mockOnClose}
            />
        );

        fireEvent.click(
            screen.getByTestId("close-button")
        );

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
});