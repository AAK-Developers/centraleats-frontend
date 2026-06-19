import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { describe, it, expect } from "vitest";

import theme from "../../../theme";
import { AuthHeader } from "../../../components/organisms/AuthHeader";

const renderWithChakra = (ui: React.ReactNode) => {
    return render(
        <ChakraProvider value={theme}>
            {ui}
        </ChakraProvider>
    );
};

describe("AuthHeader Component", () => {
    it("should render the logo", () => {
        renderWithChakra(
            <AuthHeader />
        );

        expect(
            screen.getByAltText("Logo")
        ).toBeInTheDocument();
    });

    it("should render title when provided", () => {
        renderWithChakra(
            <AuthHeader
                title="Welcome Back"
            />
        );

        expect(
            screen.getByText("Welcome Back")
        ).toBeInTheDocument();
    });

    it("should render subtitle when provided", () => {
        renderWithChakra(
            <AuthHeader
                subtitle="Sign in to continue"
            />
        );

        expect(
            screen.getByText("Sign in to continue")
        ).toBeInTheDocument();
    });

    it("should render title and subtitle together", () => {
        renderWithChakra(
            <AuthHeader
                title="Login"
                subtitle="Access your account"
            />
        );

        expect(
            screen.getByText("Login")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Access your account")
        ).toBeInTheDocument();
    });

    it("should render children", () => {
        renderWithChakra(
            <AuthHeader>
                <button>Custom Button</button>
            </AuthHeader>
        );

        expect(
            screen.getByRole("button", {
                name: /custom button/i,
            })
        ).toBeInTheDocument();
    });

    it("should render custom logo image", () => {
        renderWithChakra(
            <AuthHeader
                logoImage="https://example.com/logo.png"
            />
        );

        const logo = screen.getByAltText("Logo");

        expect(logo).toBeInTheDocument();
    });

    it("should not render title section when title and subtitle are missing", () => {
        renderWithChakra(
            <AuthHeader />
        );

        expect(
            screen.queryByText(/welcome/i)
        ).not.toBeInTheDocument();
    });

    it("should render title without subtitle", () => {
        renderWithChakra(
            <AuthHeader title="Register" />
        );

        expect(
            screen.getByText("Register")
        ).toBeInTheDocument();
    });

    it("should render subtitle without title", () => {
        renderWithChakra(
            <AuthHeader subtitle="Create your account" />
        );

        expect(
            screen.getByText("Create your account")
        ).toBeInTheDocument();
    });
});