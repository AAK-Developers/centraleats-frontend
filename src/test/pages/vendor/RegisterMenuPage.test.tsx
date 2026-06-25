import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import RegisterMenuPage from "../../../pages/vendor/RegisterMenuPage";

let mockNavigate = vi.fn();

vi.mock("../../../api/axiosConfig", () => ({
    apiClient: {
        post: vi.fn().mockResolvedValue({ data: {} }),
    },
}));

vi.mock("@chakra-ui/react", () => ({
    VStack: ({ children }: any) => <div>{children}</div>,
    Input: (props: any) => <input {...props} />,
    Textarea: (props: any) => {
        const rest = { ...props };
        delete rest.minH;
        return <textarea {...rest} />;
    },
    Text: ({ children }: any) => <div>{children}</div>,
    Box: ({ children }: any) => <div>{children}</div>,
    SimpleGrid: ({ children }: any) => <div>{children}</div>,
    Flex: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
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

vi.mock("../../../components/atoms/AppButton", () => ({
    AppButton: ({ text }: any) => <button type="submit">{text}</button>,
}));

vi.mock("../../../components/molecules/FormCard", () => ({
    FormCard: ({ children }: any) => <div>{children}</div>,
}));

describe("RegisterMenuPage", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should render form elements", () => {
        render(<RegisterMenuPage />);

        expect(screen.getByTestId("auth-header")).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/nombre del plato/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/descripción/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/precio/i)).toBeInTheDocument();
        expect(screen.getByRole("combobox")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /publicar plato/i })).toBeInTheDocument();
    });

    it("should submit form successfully", async () => {
        render(<RegisterMenuPage />);

        fireEvent.change(screen.getByPlaceholderText(/nombre del plato/i), { target: { value: "Hamburguesa" } });
        fireEvent.change(screen.getByPlaceholderText(/descripción/i), { target: { value: "Deliciosa" } });
        fireEvent.change(screen.getByPlaceholderText(/precio/i), { target: { value: "5" } });
        fireEvent.change(screen.getByRole("combobox"), { target: { value: "06542c60-ad6b-4844-b1b1-3ad6d5baf35a" } });
        fireEvent.click(screen.getByRole("button", { name: /publicar plato/i }));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/vendor-dashboard");
        });
    });

    it("should call toast success on submit", async () => {
        const toast = await import("react-hot-toast");

        render(<RegisterMenuPage />);

        fireEvent.change(screen.getByPlaceholderText(/nombre del plato/i), { target: { value: "Pizza" } });
        fireEvent.change(screen.getByPlaceholderText(/descripción/i), { target: { value: "Italiana" } });
        fireEvent.change(screen.getByPlaceholderText(/precio/i), { target: { value: "10" } });
        fireEvent.change(screen.getByRole("combobox"), { target: { value: "06542c60-ad6b-4844-b1b1-3ad6d5baf35a" } });
        fireEvent.click(screen.getByRole("button", { name: /publicar plato/i }));

        await waitFor(() => {
            expect(toast.default.success).toHaveBeenCalled();
        });
    });
});