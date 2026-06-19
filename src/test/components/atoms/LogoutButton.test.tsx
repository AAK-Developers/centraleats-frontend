import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import theme from "../../../theme";
import { LogoutButton } from "../../../components/atoms/LogoutButton";

const mockNavigate = vi.fn();
const mockSignOut = vi.fn();

vi.mock("@clerk/clerk-react", () => ({
    useClerk: () => ({
        signOut: mockSignOut,
    }),
}));

vi.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

const renderWithChakra = (ui: React.ReactNode) => {
    return render(
        <ChakraProvider value={theme}>
            {ui}
        </ChakraProvider>
    );
};

describe("LogoutButton Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should render the logout button", () => {
        renderWithChakra(
            <LogoutButton />
        );

        const button = screen.getByRole("button", {
            name: /cerrar sesión/i,
        });

        expect(button).toBeInTheDocument();
    });

    it("should render the logout icon", () => {
        const { container } = renderWithChakra(
            <LogoutButton />
        );

        const svg = container.querySelector("svg");

        expect(svg).toBeInTheDocument();
    });

    it("should call signOut and navigate when clicked", async () => {
        mockSignOut.mockResolvedValue(undefined);

        renderWithChakra(
            <LogoutButton />
        );

        const button = screen.getByRole("button", {
            name: /cerrar sesión/i,
        });

        button.click();

        await Promise.resolve();

        expect(mockSignOut).toHaveBeenCalledTimes(1);

        expect(mockNavigate).toHaveBeenCalledWith("/");
    });
});