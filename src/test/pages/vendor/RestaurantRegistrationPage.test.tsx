import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import RestaurantRegistrationPage from "../../../pages/vendor/RestaurantRegistrationPage";

let mockNavigate = vi.fn();
let mockUseUser = vi.fn();
let mockPost = vi.fn();

vi.mock("@chakra-ui/react", () => ({
    VStack: ({ children }: any) => <div>{children}</div>,
    Text: ({ children }: any) => <div>{children}</div>,
    Input: (props: any) => <input {...props} />,
    Box: ({ children }: any) => <div>{children}</div>,
    SimpleGrid: ({ children }: any) => <div>{children}</div>,
    Flex: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock("@clerk/clerk-react", () => ({
    useUser: () => mockUseUser(),
}));

vi.mock("../../../api/axiosConfig", () => ({
    apiClient: {
        post: (...args: any[]) => mockPost(...args),
    },
}));

vi.mock("react-hot-toast", () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

vi.mock("../../../components/layout/WaveLayout", () => ({
    WaveLayout: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("../../../components/layout/AppContainer", () => ({
    AppContainer: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("../../../components/organisms/AuthHeader", () => ({
    AuthHeader: () => <div data-testid="auth-header" />,
}));

vi.mock("../../../components/atoms/ImageUploadBox", () => ({
    ImageUploadBox: () => <div data-testid="image-upload" />,
}));

vi.mock("../../../components/molecules/TimeRangeInput", () => ({
    TimeRangeInput: () => <div data-testid="time-range" />,
}));

vi.mock("../../../components/atoms/AppButton", () => ({
    AppButton: ({ text }: any) => <button type="submit">{text}</button>,
}));

vi.mock("../../../components/molecules/FormCard", () => ({
    FormCard: ({ children }: any) => <div>{children}</div>,
}));

describe("RestaurantRegistrationPage", () => {

    beforeEach(() => {
        vi.clearAllMocks();

        mockUseUser.mockReturnValue({
            user: { id: "user_123" },
        });

        mockPost.mockResolvedValue({});
    });

    it("should render form inputs", () => {
        render(<RestaurantRegistrationPage />);

        expect(screen.getByTestId("auth-header")).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/nombre del restaurante/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/tipo de cocina/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/dirección completa/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/teléfono/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/tiempo estimado/i)).toBeInTheDocument();
    });

    it("should submit form and call API", async () => {
        render(<RestaurantRegistrationPage />);

        fireEvent.change(screen.getByPlaceholderText(/nombre del restaurante/i), { target: { value: "Mi Restaurante" } });
        fireEvent.change(screen.getByPlaceholderText(/tipo de cocina/i), { target: { value: "Pizza" } });
        fireEvent.change(screen.getByPlaceholderText(/dirección completa/i), { target: { value: "Av. Siempre Viva" } });
        fireEvent.change(screen.getByPlaceholderText(/teléfono/i), { target: { value: "123456789" } });
        fireEvent.change(screen.getByPlaceholderText(/tiempo estimado/i), { target: { value: "30" } });

        fireEvent.click(screen.getByRole("button", { name: /registrar resturante/i }));

        await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith(
                "/api/vendors/register ",
                expect.any(FormData),
                expect.objectContaining({
                    headers: { "Content-Type": "multipart/form-data" },
                })
            );
        });
    });

    it("should navigate on success", async () => {
        render(<RestaurantRegistrationPage />);

        fireEvent.change(screen.getByPlaceholderText(/nombre del restaurante/i), { target: { value: "Test" } });
        fireEvent.change(screen.getByPlaceholderText(/tipo de cocina/i), { target: { value: "Test" } });
        fireEvent.change(screen.getByPlaceholderText(/dirección completa/i), { target: { value: "Test" } });
        fireEvent.change(screen.getByPlaceholderText(/teléfono/i), { target: { value: "123" } });
        fireEvent.change(screen.getByPlaceholderText(/tiempo estimado/i), { target: { value: "10" } });

        fireEvent.click(screen.getByRole("button", { name: /registrar resturante/i }));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/register-menu");
        });
    });

    it("should show success toast", async () => {
        const toast = await import("react-hot-toast");

        render(<RestaurantRegistrationPage />);

        fireEvent.change(screen.getByPlaceholderText(/nombre del restaurante/i), { target: { value: "Test" } });
        fireEvent.change(screen.getByPlaceholderText(/tipo de cocina/i), { target: { value: "Test" } });
        fireEvent.change(screen.getByPlaceholderText(/dirección completa/i), { target: { value: "Test" } });
        fireEvent.change(screen.getByPlaceholderText(/teléfono/i), { target: { value: "123" } });
        fireEvent.change(screen.getByPlaceholderText(/tiempo estimado/i), { target: { value: "10" } });

        fireEvent.click(screen.getByRole("button", { name: /registrar resturante/i }));

        await waitFor(() => {
            expect(toast.default.success).toHaveBeenCalled();
        });
    });

    it("should show error toast if API fails", async () => {
        const toast = await import("react-hot-toast");

        mockPost.mockRejectedValueOnce(new Error("API error"));

        render(<RestaurantRegistrationPage />);

        fireEvent.change(screen.getByPlaceholderText(/nombre del restaurante/i), { target: { value: "Test" } });
        fireEvent.change(screen.getByPlaceholderText(/tipo de cocina/i), { target: { value: "Test" } });
        fireEvent.change(screen.getByPlaceholderText(/dirección completa/i), { target: { value: "Test" } });
        fireEvent.change(screen.getByPlaceholderText(/teléfono/i), { target: { value: "123" } });
        fireEvent.change(screen.getByPlaceholderText(/tiempo estimado/i), { target: { value: "10" } });

        fireEvent.click(screen.getByRole("button", { name: /registrar resturante/i }));

        await waitFor(() => {
            expect(toast.default.error).toHaveBeenCalled();
        });
    });
});