import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import StudentDashboardPage from "../../../pages/student/StudentDashboardPage";

let mockUseUser = vi.fn();
let mockUseRestaurants = vi.fn();

vi.mock("@chakra-ui/react", () => ({
    Box: ({ children }: any) => <div>{children}</div>,
    Flex: ({ children }: any) => <div>{children}</div>,
    Text: ({ children }: any) => <div>{children}</div>,
    Input: (props: any) => <input {...props} />,
    SimpleGrid: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@clerk/clerk-react", () => ({
    useUser: () => mockUseUser(),
}));

vi.mock("../../../hooks/useRestaurants", () => ({
    useRestaurants: () => mockUseRestaurants(),
}));

vi.mock("../../../components/layout/WaveLayout", () => ({
    WaveLayout: ({ children }: any) => (
        <div data-testid="wave-layout">{children}</div>
    ),
}));

vi.mock("../../../components/layout/AppContainer", () => ({
    AppContainer: ({ children }: any) => (
        <div data-testid="app-container">{children}</div>
    ),
}));

vi.mock("../../../components/organisms/DashboardHeader", () => ({
    DashboardHeader: ({ userName }: any) => (
        <div data-testid="dashboard-header">{userName}</div>
    ),
}));

vi.mock("../../../components/molecules/RestaurantCard", () => ({
    RestaurantCard: ({ name }: any) => (
        <div data-testid="restaurant-card">{name}</div>
    ),
}));

describe("StudentDashboardPage", () => {

    beforeEach(() => {
        vi.clearAllMocks();

        mockUseUser.mockReturnValue({
            user: { firstName: "Kevin" },
        });

        mockUseRestaurants.mockReturnValue({
            restaurants: [
                { id: 1, name: "Restaurant 1" },
                { id: 2, name: "Restaurant 2" },
            ],
        });
    });

    it("should render layouts", () => {
        render(<StudentDashboardPage />);

        expect(screen.getByTestId("wave-layout")).toBeInTheDocument();
        expect(screen.getByTestId("app-container")).toBeInTheDocument();
    });

    it("should render DashboardHeader with user name", () => {
        render(<StudentDashboardPage />);

        expect(screen.getByTestId("dashboard-header"))
            .toHaveTextContent("Kevin");
    });

    it("should render main title", () => {
        render(<StudentDashboardPage />);

        expect(
            screen.getByText(/los mejores restaurantes/i)
        ).toBeInTheDocument();
    });

    it("should render search input", () => {
        render(<StudentDashboardPage />);

        expect(
            screen.getByPlaceholderText("Buscar...")
        ).toBeInTheDocument();
    });

    it("should render all restaurants", () => {
        render(<StudentDashboardPage />);

        const cards = screen.getAllByTestId("restaurant-card");

        expect(cards).toHaveLength(2);
        expect(screen.getByText("Restaurant 1")).toBeInTheDocument();
        expect(screen.getByText("Restaurant 2")).toBeInTheDocument();
    });

    it("should render default user name if no user", () => {
        mockUseUser.mockReturnValue({
            user: null,
        });

        render(<StudentDashboardPage />);

        expect(screen.getByTestId("dashboard-header"))
            .toHaveTextContent("Usuario");
    });
});