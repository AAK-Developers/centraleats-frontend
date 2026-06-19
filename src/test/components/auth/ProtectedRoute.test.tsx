import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { ProtectedRoute } from "../../../components/auth/ProtectedRoute";

const mockFetchProfile = vi.fn();
const mockClearAuth = vi.fn();

vi.mock("@clerk/clerk-react", () => ({
    useUser: vi.fn(),
}));

vi.mock("../../../hooks/useAuthMe", () => ({
    useAuthMe: vi.fn(),
}));

vi.mock("../../../store/authStore", () => ({
    useAuthStore: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
    Navigate: ({ to }: { to: string }) => (
        <div data-testid="navigate">{to}</div>
    ),
    useLocation: () => ({
        pathname: "/student-dashboard",
    }),
}));

vi.mock("../../../pages/landing/PresentationPage", () => ({
    default: () => <div>Presentation Page</div>,
}));

import { useUser } from "@clerk/clerk-react";
import { useAuthMe } from "../../../hooks/useAuthMe";
import { useAuthStore } from "../../../store/authStore";

describe("ProtectedRoute", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        (useAuthStore as any).mockImplementation((selector: any) =>
            selector({
                clearAuth: mockClearAuth,
            })
        );
    });

    it("should render loading page while clerk is loading", () => {
        (useUser as any).mockReturnValue({
            isLoaded: false,
            isSignedIn: false,
            user: null,
        });

        (useAuthMe as any).mockReturnValue({
            profile: null,
            isLoadingProfile: false,
            fetchProfile: mockFetchProfile,
            error: null,
        });

        render(
            <ProtectedRoute>
                <div>Protected Content</div>
            </ProtectedRoute>
        );

        expect(
            screen.getByText("Presentation Page")
        ).toBeInTheDocument();
    });

    it("should redirect to login when user is not signed in", () => {
        (useUser as any).mockReturnValue({
            isLoaded: true,
            isSignedIn: false,
            user: null,
        });

        (useAuthMe as any).mockReturnValue({
            profile: null,
            isLoadingProfile: false,
            fetchProfile: mockFetchProfile,
            error: null,
        });

        render(
            <ProtectedRoute>
                <div>Protected Content</div>
            </ProtectedRoute>
        );

        expect(
            screen.getByTestId("navigate")
        ).toHaveTextContent("/login");
    });

    it("should render protected content when authenticated", () => {
        (useUser as any).mockReturnValue({
            isLoaded: true,
            isSignedIn: true,
            user: {
                publicMetadata: {
                    role: "STUDENT",
                },
            },
        });

        (useAuthMe as any).mockReturnValue({
            profile: {
                role: "STUDENT",
                isActive: true,
            },
            isLoadingProfile: false,
            fetchProfile: mockFetchProfile,
            error: null,
        });

        render(
            <ProtectedRoute>
                <div>Protected Content</div>
            </ProtectedRoute>
        );

        expect(
            screen.getByText("Protected Content")
        ).toBeInTheDocument();
    });

    it("should redirect to role-selection when role is missing", () => {
        (useUser as any).mockReturnValue({
            isLoaded: true,
            isSignedIn: true,
            user: {
                publicMetadata: {},
            },
        });

        (useAuthMe as any).mockReturnValue({
            profile: {
                role: undefined,
                isActive: true,
            },
            isLoadingProfile: false,
            fetchProfile: mockFetchProfile,
            error: null,
        });

        render(
            <ProtectedRoute>
                <div>Protected Content</div>
            </ProtectedRoute>
        );

        expect(
            screen.getByTestId("navigate")
        ).toHaveTextContent("/role-selection");
    });

    it("should show deactivated account message", () => {
        (useUser as any).mockReturnValue({
            isLoaded: true,
            isSignedIn: true,
            user: null,
        });

        (useAuthMe as any).mockReturnValue({
            profile: {
                role: "STUDENT",
                isActive: false,
            },
            isLoadingProfile: false,
            fetchProfile: mockFetchProfile,
            error: null,
        });

        render(
            <ProtectedRoute>
                <div>Protected Content</div>
            </ProtectedRoute>
        );

        expect(
            screen.getByText("Account Deactivated")
        ).toBeInTheDocument();
    });

    it("should clear auth when session is invalid", () => {
        (useUser as any).mockReturnValue({
            isLoaded: true,
            isSignedIn: false,
            user: null,
        });

        (useAuthMe as any).mockReturnValue({
            profile: null,
            isLoadingProfile: false,
            fetchProfile: mockFetchProfile,
            error: null,
        });

        render(
            <ProtectedRoute>
                <div>Protected Content</div>
            </ProtectedRoute>
        );

        expect(mockClearAuth).toHaveBeenCalled();
    });
});