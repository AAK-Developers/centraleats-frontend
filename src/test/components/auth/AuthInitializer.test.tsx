import { render } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { AuthInitializer } from "../../../components/auth/AuthInitializer";
import { setupAxiosInterceptor } from "../../../api/axiosConfig";

const mockGetToken = vi.fn();
const mockEjectInterceptor = vi.fn();

vi.mock("@clerk/clerk-react", () => ({
    useAuth: () => ({
        getToken: mockGetToken,
    }),
}));

vi.mock("../../../api/axiosConfig", () => ({
    setupAxiosInterceptor: vi.fn(),
}));

describe("AuthInitializer Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(setupAxiosInterceptor).mockReturnValue(
            mockEjectInterceptor
        );
    });

    it("should render its children", () => {
        const { getByText } = render(
            <AuthInitializer>
                <div>Test Child</div>
            </AuthInitializer>
        );

        expect(
            getByText("Test Child")
        ).toBeInTheDocument();
    });

    it("should setup axios interceptor on mount", () => {
        render(
            <AuthInitializer>
                <div>Test Child</div>
            </AuthInitializer>
        );

        expect(
            setupAxiosInterceptor
        ).toHaveBeenCalledTimes(1);

        expect(
            setupAxiosInterceptor
        ).toHaveBeenCalledWith(mockGetToken);
    });

    it("should eject interceptor on unmount", () => {
        const { unmount } = render(
            <AuthInitializer>
                <div>Test Child</div>
            </AuthInitializer>
        );

        unmount();

        expect(
            mockEjectInterceptor
        ).toHaveBeenCalledTimes(1);
    });
});