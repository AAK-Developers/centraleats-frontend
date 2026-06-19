import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import App from "../App";

vi.mock("../components/auth/AuthInitializer", () => ({
    AuthInitializer: ({ children }: any) => <>{children}</>,
}));

vi.mock("../components/auth/ProtectedRoute", () => ({
    ProtectedRoute: ({ children }: any) => <>{children}</>,
}));

vi.mock("../pages/landing/PresentationPage", () => ({
    default: () => <div>Presentation Page</div>,
}));

vi.mock("../pages/auth/LoginPage", () => ({
    default: () => <div>Login Page</div>,
}));

vi.mock("../pages/auth/RoleSelectionPage", () => ({
    default: () => <div>Role Selection Page</div>,
}));

vi.mock("../pages/student/StudentDashboardPage", () => ({
    default: () => <div>Student Dashboard</div>,
}));

vi.mock("../pages/vendor/VendorDashboardPage", () => ({
    default: () => <div>Vendor Dashboard</div>,
}));

vi.mock("../pages/vendor/RestaurantRegistrationPage", () => ({
    default: () => <div>Register Restaurant</div>,
}));

vi.mock("../pages/vendor/RegisterMenuPage", () => ({
    default: () => <div>Register Menu</div>,
}));

describe("App Routing", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should render PresentationPage on '/'", () => {
        window.history.pushState({}, "", "/");

        render(<App />);

        expect(screen.getByText("Presentation Page")).toBeInTheDocument();
    });

    it("should render LoginPage on '/login'", () => {
        window.history.pushState({}, "", "/login");

        render(<App />);

        expect(screen.getByText("Login Page")).toBeInTheDocument();
    });

    it("should render RoleSelectionPage on '/role-selection'", () => {
        window.history.pushState({}, "", "/role-selection");

        render(<App />);

        expect(screen.getByText("Role Selection Page")).toBeInTheDocument();
    });

    it("should render StudentDashboardPage on '/student-dashboard'", () => {
        window.history.pushState({}, "", "/student-dashboard");

        render(<App />);

        expect(screen.getByText("Student Dashboard")).toBeInTheDocument();
    });

    it("should render VendorDashboardPage on '/vendor-dashboard'", () => {
        window.history.pushState({}, "", "/vendor-dashboard");

        render(<App />);

        expect(screen.getByText("Vendor Dashboard")).toBeInTheDocument();
    });

    it("should render RestaurantRegistrationPage on '/register-restaurant'", () => {
        window.history.pushState({}, "", "/register-restaurant");

        render(<App />);

        expect(screen.getByText("Register Restaurant")).toBeInTheDocument();
    });

    it("should render RegisterMenuPage on '/register-menu'", () => {
        window.history.pushState({}, "", "/register-menu");

        render(<App />);

        expect(screen.getByText("Register Menu")).toBeInTheDocument();
    });
});