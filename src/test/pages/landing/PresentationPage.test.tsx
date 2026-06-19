import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import PresentationPage from "../../../pages/landing/PresentationPage";

const mockNavigate = vi.fn();

vi.mock("@chakra-ui/react", async () => {

    return {
        Box: ({ children }: any) => <div>{children}</div>,
        Flex: ({ children }: any) => <div>{children}</div>,
        VStack: ({ children }: any) => <div>{children}</div>,
        Text: ({ children }: any) => <div>{children}</div>,
    };
});

vi.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock(
    "../../../components/layout/WaveLayout",
    () => ({
        WaveLayout: ({ children }: any) => (
            <div data-testid="wave-layout">{children}</div>
        ),
    })
);

vi.mock(
    "../../../components/layout/AppContainer",
    () => ({
        AppContainer: ({ children }: any) => (
            <div data-testid="app-container">{children}</div>
        ),
    })
);

vi.mock(
    "../../../components/organisms/AuthHeader",
    () => ({
        AuthHeader: ({ logoSize }: any) => (
            <div
                data-testid="auth-header"
                data-logo-size={logoSize}
            />
        ),
    })
);

vi.mock(
    "../../../components/atoms/AuthButton",
    () => ({
        AuthButton: ({ onClick }: any) => (
            <button
                data-testid="auth-button"
                onClick={onClick}
            >
                Login
            </button>
        ),
    })
);

describe("PresentationPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should render WaveLayout", () => {
        render(<PresentationPage />);
        expect(screen.getByTestId("wave-layout")).toBeInTheDocument();
    });

    it("should render AppContainer", () => {
        render(<PresentationPage />);
        expect(screen.getByTestId("app-container")).toBeInTheDocument();
    });

    it("should render AuthHeader", () => {
        render(<PresentationPage />);
        expect(screen.getByTestId("auth-header")).toBeInTheDocument();
    });

    it("should pass correct logoSize to AuthHeader", () => {
        render(<PresentationPage />);
        expect(screen.getByTestId("auth-header"))
            .toHaveAttribute("data-logo-size", "500px");
    });

    it("should render AuthButton", () => {
        render(<PresentationPage />);
        expect(screen.getByTestId("auth-button")).toBeInTheDocument();
    });

    it("should navigate to login when AuthButton is clicked", () => {
        render(<PresentationPage />);

        fireEvent.click(screen.getByTestId("auth-button"));

        expect(mockNavigate).toHaveBeenCalledWith("/login");
    });

    it("should render main slogan", () => {
        render(<PresentationPage />);

        expect(
            screen.getByText(/your order, your time/i)
        ).toBeInTheDocument();

        expect(
            screen.getByText(/your pace/i)
        ).toBeInTheDocument();
    });

    it("should render footer text", () => {
        render(<PresentationPage />);

        expect(
            screen.getByText(/© 2026 centraleats uce/i)
        ).toBeInTheDocument();
    });
});