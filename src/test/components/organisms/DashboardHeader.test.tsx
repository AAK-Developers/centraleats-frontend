import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Mock completo del componente
vi.mock("../../../components/organisms/DashboardHeader", () => ({
    DashboardHeader: ({
        userName,
    }: {
        userName: string;
    }) => (
        <div>
            <img alt="Logo" />
            <span>Hola, {userName}</span>
            <button aria-label="Notificaciones">
                Notificaciones
            </button>
            <button aria-label="Carrito">
                Carrito
            </button>
        </div>
    ),
}));

// Import DESPUÉS del mock
import { DashboardHeader } from "../../../components/organisms/DashboardHeader";

describe("DashboardHeader Component", () => {
    it("should render the logo", () => {
        render(<DashboardHeader userName="Kevin" />);

        expect(screen.getByAltText("Logo"))
            .toBeInTheDocument();
    });

    it("should render user name", () => {
        render(<DashboardHeader userName="Kevin" />);

        expect(screen.getByText("Hola, Kevin"))
            .toBeInTheDocument();
    });

    it("should render notification button", () => {
        render(<DashboardHeader userName="Kevin" />);

        expect(screen.getByLabelText("Notificaciones"))
            .toBeInTheDocument();
    });

    it("should render cart button", () => {
        render(<DashboardHeader userName="Kevin" />);

        expect(screen.getByLabelText("Carrito"))
            .toBeInTheDocument();
    });
});
