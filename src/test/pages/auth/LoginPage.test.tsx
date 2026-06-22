import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import LoginPage from "../../../pages/auth/LoginPage";

vi.mock("@clerk/clerk-react", () => ({
    SignIn: ({
        forceRedirectUrl,
    }: {
        forceRedirectUrl: string;
    }) => (
        <div data-testid="sign-in">
            {forceRedirectUrl}
        </div>
    ),
}));

vi.mock(
    "../../../components/layout/WaveLayout",
    () => ({
        WaveLayout: ({
            children,
        }: {
            children: React.ReactNode;
        }) => (
            <div data-testid="wave-layout">
                {children}
            </div>
        ),
    })
);

vi.mock(
    "../../../components/layout/AppContainer",
    () => ({
        AppContainer: ({
            children,
        }: {
            children: React.ReactNode;
        }) => (
            <div data-testid="app-container">
                {children}
            </div>
        ),
    })
);

vi.mock(
    "../../../components/organisms/AuthHeader",
    () => ({
        AuthHeader: ({
            children,
            logoSize,
        }: {
            children: React.ReactNode;
            logoSize: string;
        }) => (
            <div
                data-testid="auth-header"
                data-logo-size={logoSize}
            >
                {children}
            </div>
        ),
    })
);

describe("LoginPage", () => {
    it("should render WaveLayout", () => {
        render(<LoginPage />);

        expect(
            screen.getByTestId("wave-layout")
        ).toBeInTheDocument();
    });

    it("should render AppContainer", () => {
        render(<LoginPage />);

        expect(
            screen.getByTestId("app-container")
        ).toBeInTheDocument();
    });

    it("should render AuthHeader", () => {
        render(<LoginPage />);

        expect(
            screen.getByTestId("auth-header")
        ).toBeInTheDocument();
    });

    it("should pass logoSize to AuthHeader", () => {
        render(<LoginPage />);

        expect(
            screen.getByTestId("auth-header")
        ).toHaveAttribute(
            "data-logo-size",
            "350px"
        );
    });

    it("should render Clerk SignIn component", () => {
        render(<LoginPage />);

        expect(
            screen.getByTestId("sign-in")
        ).toBeInTheDocument();
    });

    it("should configure redirect url correctly", () => {
        render(<LoginPage />);

        expect(
            screen.getByTestId("sign-in")
        ).toHaveTextContent(
            "/role-selection"
        );
    });
});