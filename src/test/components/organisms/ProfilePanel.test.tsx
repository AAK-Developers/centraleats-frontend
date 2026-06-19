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

vi.mock("../../../hooks/useOrderHistory", () => ({
    useOrderHistory: () => ({
        isLoading: false,
        orders: [
            {
                id: "1",
                restaurant: "Pizza House",
                price: "$12.50",
                date: "2025-08-01",
                status: "Entregado",
            },
            {
                id: "2",
                restaurant: "Burger Express",
                price: "$8.00",
                date: "2025-08-02",
                status: "Entregado",
            },
        ],
    }),
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

vi.mock("../../../components/molecules/OrderCard", () => ({
    OrderCard: ({ id }: { id: string }) => (
        <div data-testid="order-card">
            Order {id}
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
            screen.getByText("Historial de Pedidos")
        ).toBeInTheDocument();
    });

    it("should render all orders", () => {
        renderWithChakra(
            <ProfilePanel
                isOpen={true}
                onClose={mockOnClose}
            />
        );

        const orders = screen.getAllByTestId("order-card");

        expect(orders).toHaveLength(2);
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