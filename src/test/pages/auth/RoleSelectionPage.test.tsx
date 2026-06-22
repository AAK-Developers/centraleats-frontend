import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";

import RoleSelectionPage from "../../../pages/auth/RoleSelectionPage";
import { apiClient } from "../../../api/axiosConfig";

const mockNavigate = vi.fn();
const mockFetchProfile = vi.fn();
const mockReload = vi.fn();

vi.mock("@chakra-ui/react", async () => {

    return {
        VStack: ({ children }: any) => <div>{children}</div>,
        Text: ({ children }: any) => <div>{children}</div>,
        SimpleGrid: ({ children }: any) => <div>{children}</div>,
    };
});

vi.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock("@clerk/clerk-react", () => ({
    useUser: () => ({
        user: {
            id: "clerk_123",
            reload: mockReload,
        },
    }),
}));

vi.mock("react-hot-toast", () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

vi.mock("../../../hooks/useAuthMe", () => ({
    useAuthMe: () => ({
        fetchProfile: mockFetchProfile,
    }),
}));

vi.mock("../../../api/axiosConfig", () => ({
    apiClient: {
        post: vi.fn(),
    },
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

vi.mock("../../../components/organisms/AuthHeader", () => ({
    AuthHeader: ({ children }: any) => (
        <div data-testid="auth-header">{children}</div>
    ),
}));

vi.mock("../../../components/molecules/RoleCard", () => ({
    RoleCard: ({ title, onClick }: any) => (
        <button onClick={onClick}>{title}</button>
    ),
}));

describe("RoleSelectionPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockReload.mockResolvedValue(undefined);
        mockFetchProfile.mockResolvedValue(undefined);
    });

    it("should render page content", () => {
        render(<RoleSelectionPage />);

        expect(screen.getByTestId("wave-layout")).toBeInTheDocument();
        expect(screen.getByTestId("app-container")).toBeInTheDocument();
        expect(screen.getByTestId("auth-header")).toBeInTheDocument();

        expect(screen.getByText("Pide con Nosotros")).toBeInTheDocument();
        expect(screen.getByText("Trabaja con Nosotros")).toBeInTheDocument();
    });

    it("should assign student role successfully", async () => {
        vi.mocked(apiClient.post).mockResolvedValue({ data: {} });

        render(<RoleSelectionPage />);

        fireEvent.click(screen.getByText("Pide con Nosotros"));

        await waitFor(() => {
            expect(apiClient.post).toHaveBeenCalledWith("/api/users", {
                role: "student",
                clerkId: "clerk_123",
            });
        });

        await waitFor(() => {
            expect(mockReload).toHaveBeenCalled();
            expect(mockFetchProfile).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith("/student-dashboard");
        });
    });

    it("should assign vendor role successfully", async () => {
        vi.mocked(apiClient.post).mockResolvedValue({ data: {} });

        render(<RoleSelectionPage />);

        fireEvent.click(screen.getByText("Trabaja con Nosotros"));

        await waitFor(() => {
            expect(apiClient.post).toHaveBeenCalledWith("/api/users", {
                role: "vendor",
                clerkId: "clerk_123",
            });
        });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/register-restaurant");
        });
    });

    it("should handle api errors", async () => {
        vi.mocked(apiClient.post).mockRejectedValue(
            new Error("Backend Error")
        );

        const consoleSpy = vi
            .spyOn(console, "error")
            .mockImplementation(() => { });

        render(<RoleSelectionPage />);

        fireEvent.click(screen.getByText("Pide con Nosotros"));

        await waitFor(() => {
            expect(apiClient.post).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalled();
        });

        consoleSpy.mockRestore();
    });

    it("should handle axios response errors", async () => {
        const axiosError = {
            isAxiosError: true,
            response: {
                status: 500,
                data: {
                    message: "Server Error",
                },
                headers: {},
            },
        };

        vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

        vi.mocked(apiClient.post).mockRejectedValue(axiosError);

        render(<RoleSelectionPage />);

        fireEvent.click(screen.getByText("Pide con Nosotros"));

        await waitFor(() => {
            expect(apiClient.post).toHaveBeenCalled();
        });
    });

    it("should handle fetchProfile failure gracefully", async () => {
        vi.mocked(apiClient.post).mockResolvedValue({ data: {} });

        mockFetchProfile.mockRejectedValue(
            new Error("sync error")
        );

        render(<RoleSelectionPage />);

        fireEvent.click(screen.getByText("Pide con Nosotros"));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalled();
        });
    });
});