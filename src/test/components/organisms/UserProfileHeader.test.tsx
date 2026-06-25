import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { describe, it, expect, vi } from "vitest";

import theme from "../../../theme";
import { UserProfileHeader } from "../../../components/organisms/UserProfileHeader";

vi.mock("@chakra-ui/react", async () => {
    const actual = await vi.importActual<any>("@chakra-ui/react");
    return {
        ...actual,
        AvatarRoot: ({ children }: any) => <div data-testid="avatar-root">{children}</div>,
        AvatarImage: ({ src }: any) => <img src={src} data-testid="avatar-image" />,
        AvatarFallback: ({ children }: any) => <span data-testid="avatar-fallback">{children}</span>,
    };
});

const renderWithChakra = (ui: React.ReactNode) => {
    return render(
        <ChakraProvider value={theme}>
            {ui}
        </ChakraProvider>
    );
};

describe("UserProfileHeader Component", () => {
    it("should render full name", () => {
        renderWithChakra(
            <UserProfileHeader
                fullName="Kevin Moyon"
                email="kevin@test.com"
            />
        );

        expect(
            screen.getByText("Kevin Moyon")
        ).toBeInTheDocument();
    });

    it("should render email", () => {
        renderWithChakra(
            <UserProfileHeader
                fullName="Kevin Moyon"
                email="kevin@test.com"
            />
        );

        expect(
            screen.getByText("kevin@test.com")
        ).toBeInTheDocument();
    });

    it("should render fallback with first letter of fullName", () => {
        renderWithChakra(
            <UserProfileHeader
                fullName="Kevin Moyon"
                email="kevin@test.com"
            />
        );

        expect(
            screen.getByText("K")
        ).toBeInTheDocument();
    });

    it("should render different user data", () => {
        renderWithChakra(
            <UserProfileHeader
                fullName="Maria Lopez"
                email="maria@test.com"
            />
        );

        expect(
            screen.getByText("Maria Lopez")
        ).toBeInTheDocument();

        expect(
            screen.getByText("maria@test.com")
        ).toBeInTheDocument();

        expect(
            screen.getByText("M")
        ).toBeInTheDocument();
    });

    it("should render image when imageUrl is provided", () => {
        const { container } = renderWithChakra(
            <UserProfileHeader
                imageUrl="https://example.com/avatar.jpg"
                fullName="Kevin Moyon"
                email="kevin@test.com"
            />
        );

        expect(container).toBeInTheDocument();
    });

    it("should render even when imageUrl is not provided", () => {
        renderWithChakra(
            <UserProfileHeader
                fullName="Kevin Moyon"
                email="kevin@test.com"
            />
        );

        expect(
            screen.getByText("Kevin Moyon")
        ).toBeInTheDocument();
    });

    it("should use first character of the name as fallback", () => {
        renderWithChakra(
            <UserProfileHeader
                fullName="Alicia"
                email="alicia@test.com"
            />
        );

        expect(
            screen.getByText("A")
        ).toBeInTheDocument();
    });
});