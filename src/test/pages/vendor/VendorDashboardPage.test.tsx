import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import VendorDashboardPage from "../../../pages/vendor/VendorDashboardPage";

vi.mock("@clerk/clerk-react", () => ({
    useUser: () => ({ user: { firstName: "Juan" }, isLoaded: true }),
}));

vi.mock("react-router-dom", () => ({
    useNavigate: () => vi.fn(),
}));

vi.mock("@chakra-ui/react", () => ({
    Box: ({ children }: any) => <div>{children}</div>,
    SimpleGrid: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("../../../components/layout/WaveLayout", () => ({
    WaveLayout: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("../../../components/layout/AppContainer", () => ({
    AppContainer: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("../../../components/organisms/DashboardHeaderVendor", () => ({
    DashboardHeaderVendor: ({ userName }: any) => (
        <div data-testid="dashboard-header">{userName}</div>
    ),
}));

vi.mock("../../../components/molecules/RestaurantSelectorVendor", () => ({
    RestaurantSelectorVendor: ({ name }: any) => (
        <div data-testid="restaurant-selector">{name}</div>
    ),
}));

vi.mock("../../../components/organisms/PanelHeaderVendor", () => ({
    PanelHeaderVendor: ({ isOpen, onToggle }: any) => (
        <button data-testid="panel-toggle" onClick={onToggle}>
            {isOpen ? "Abierto" : "Cerrado"}
        </button>
    ),
}));

vi.mock("../../../components/molecules/OrderTabsVendor", () => ({
    OrderTabsVendor: ({ tabs, onTabChange }: any) => (
        <div data-testid="order-tabs">
            {tabs.map((t: any) => (
                <button key={t.key} onClick={() => onTabChange(t.key)}>
                    {t.label}
                </button>
            ))}
        </div>
    ),
}));

vi.mock("../../../components/molecules/EmptyOrdersVendor", () => ({
    EmptyOrdersVendor: () => <div data-testid="empty-orders" />,
}));

vi.mock("../../../components/molecules/ClosedStateVendor", () => ({
    ClosedStateVendor: () => <div data-testid="closed-state" />,
}));

describe("VendorDashboardPage", () => {

    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it("should render the dashboard header", () => {
        render(<VendorDashboardPage />);
        expect(screen.getByTestId("dashboard-header")).toBeInTheDocument();
    });

    it("should render the restaurant name", () => {
        render(<VendorDashboardPage />);
        expect(screen.getByTestId("restaurant-selector")).toBeInTheDocument();
        expect(screen.getByText("Restaurante Central 1")).toBeInTheDocument();
    });

    it("should render closed state by default", () => {
        render(<VendorDashboardPage />);
        expect(screen.getByTestId("closed-state")).toBeInTheDocument();
    });

    it("should render order tabs when open", () => {
        localStorage.setItem("vendorIsOpen", "true");
        render(<VendorDashboardPage />);
        expect(screen.getByTestId("order-tabs")).toBeInTheDocument();
    });

    it("should render empty orders when open and no orders", () => {
        localStorage.setItem("vendorIsOpen", "true");
        render(<VendorDashboardPage />);
        expect(screen.getByTestId("empty-orders")).toBeInTheDocument();
    });

    it("should toggle open state on button click", () => {
        render(<VendorDashboardPage />);
        expect(screen.getByTestId("closed-state")).toBeInTheDocument();
        fireEvent.click(screen.getByTestId("panel-toggle"));
        expect(screen.getByTestId("order-tabs")).toBeInTheDocument();
    });

    it("should render user first name in header", () => {
        render(<VendorDashboardPage />);
        expect(screen.getByText("Juan")).toBeInTheDocument();
    });
});