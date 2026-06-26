import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import StudentDashboardPage from "../../../pages/student/StudentDashboardPage";

let mockUseUser = vi.fn();
let mockUseAllProducts = vi.fn();
let mockUseStudentOrders = vi.fn();
let mockUseCartStore = vi.fn();

vi.mock("@chakra-ui/react", () => ({
    Box: ({ children }: any) => <div>{children}</div>,
    Flex: ({ children }: any) => <div>{children}</div>,
    Text: ({ children }: any) => <div>{children}</div>,
    Input: (props: any) => <input {...props} />,
    SimpleGrid: ({ children }: any) => <div>{children}</div>,
    Dialog: {
        Root: ({ children, open }: any) => open ? <div>{children}</div> : null,
        Backdrop: () => <div>Backdrop</div>,
        Positioner: ({ children }: any) => <div>{children}</div>,
        Content: ({ children }: any) => <div>{children}</div>,
        Header: ({ children }: any) => <div>{children}</div>,
        Body: ({ children }: any) => <div>{children}</div>,
        Footer: ({ children }: any) => <div>{children}</div>,
        CloseTrigger: () => <button>Close</button>,
    },
    Portal: ({ children }: any) => <div>{children}</div>,
    Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
    useDisclosure: () => ({ isOpen: false, onOpen: vi.fn(), onClose: vi.fn() }),
    Spinner: () => <div>Loading...</div>,
    Image: (props: any) => <img {...props} />,
    Badge: ({ children }: any) => <span>{children}</span>,
    Stack: ({ children }: any) => <div>{children}</div>,
    HStack: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@clerk/clerk-react", () => ({
    useUser: () => mockUseUser(),
}));

vi.mock("../../../hooks/useAllProducts", () => ({
    useAllProducts: () => mockUseAllProducts(),
}));

vi.mock("../../../hooks/useStudentOrders", () => ({
    useStudentOrders: () => mockUseStudentOrders(),
    STATUS_LABELS: {
        PENDING_PAYMENT: 'Pendiente de pago',
        PAID: 'Pagado',
        RECEIVED: 'Recibido por local',
        PREPARING: 'En preparación',
        READY: 'Listo para retirar',
        PICKED_UP: 'Retirado',
        COMPLETED: 'Completado',
        CANCELLED: 'Cancelado',
    },
    STATUS_COLORS: {
        PENDING_PAYMENT: 'orange',
        PAID: 'green',
        RECEIVED: 'blue',
        PREPARING: 'yellow',
        READY: 'teal',
        PICKED_UP: 'gray',
        COMPLETED: 'gray',
        CANCELLED: 'red',
    }
}));

vi.mock("../../../store/cartStore", () => ({
    useCartStore: (selector: any) => mockUseCartStore(selector),
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

vi.mock("../../../components/organisms/DashboardHeader", () => ({
    DashboardHeader: ({ userName }: any) => (
        <div data-testid="dashboard-header">{userName}</div>
    ),
}));

describe("StudentDashboardPage", () => {

    beforeEach(() => {
        vi.clearAllMocks();

        mockUseUser.mockReturnValue({
            user: { firstName: "Kevin" },
        });

        mockUseAllProducts.mockReturnValue({
            isLoading: false,
            products: [
                {
                    id: "p1",
                    name: "Plato 1",
                    description: "Desc 1",
                    price: 250,
                    stock: 10,
                    imageUrl: "image1.jpg",
                    isAvailable: true,
                    vendorId: "v1",
                    vendorName: "Restaurant 1",
                },
                {
                    id: "p2",
                    name: "Plato 2",
                    description: "Desc 2",
                    price: 500,
                    stock: 5,
                    imageUrl: "image2.jpg",
                    isAvailable: true,
                    vendorId: "v2",
                    vendorName: "Restaurant 2",
                },
            ],
        });

        mockUseStudentOrders.mockReturnValue({
            isLoading: false,
            activeOrders: [],
            orders: [],
        });

        mockUseCartStore.mockReturnValue([]);
    });

    it("should render layouts", () => {
        render(<StudentDashboardPage />);

        expect(screen.getByTestId("wave-layout")).toBeInTheDocument();
        expect(screen.getByTestId("app-container")).toBeInTheDocument();
    });

    it("should render DashboardHeader with user name", () => {
        render(<StudentDashboardPage />);

        expect(screen.getByTestId("dashboard-header"))
            .toHaveTextContent("Kevin");
    });

    it("should render main title", () => {
        render(<StudentDashboardPage />);

        expect(
            screen.getByText(/¿Qué vas a pedir hoy?/i)
        ).toBeInTheDocument();
    });

    it("should render search input", () => {
        render(<StudentDashboardPage />);

        expect(
            screen.getByPlaceholderText(/Buscar por plato, descripción o restaurante/i)
        ).toBeInTheDocument();
    });

    it("should render all products", () => {
        render(<StudentDashboardPage />);

        expect(screen.getByText("Plato 1")).toBeInTheDocument();
        expect(screen.getByText("Plato 2")).toBeInTheDocument();
        expect(screen.getByText("Restaurant 1")).toBeInTheDocument();
        expect(screen.getByText("Restaurant 2")).toBeInTheDocument();
    });

    it("should render default user name if no user", () => {
        mockUseUser.mockReturnValue({
            user: null,
        });

        render(<StudentDashboardPage />);

        expect(screen.getByTestId("dashboard-header"))
            .toHaveTextContent("Usuario");
    });
});