import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";

import { useAuthMe } from "../../hooks/useAuthMe";
import { apiClient } from "../../api/axiosConfig";
import { useAuthStore } from "../../store/authStore";

vi.mock("../../api/axiosConfig", () => ({
    apiClient: {
        get: vi.fn(),
    },
}));

vi.mock("../../store/authStore", () => ({
    useAuthStore: vi.fn(),
}));

describe("useAuthMe", () => {
    const mockSetProfile = vi.fn();
    const mockSetIsLoadingProfile = vi.fn();
    const mockSetError = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(useAuthStore).mockReturnValue({
            profile: null,
            isLoadingProfile: false,
            error: null,
            setProfile: mockSetProfile,
            setIsLoadingProfile: mockSetIsLoadingProfile,
            setError: mockSetError,
        } as any);
    });

    it("should fetch profile successfully when backend returns wrapped data", async () => {
        const profile = {
            id: "1",
            email: "test@test.com",
            role: "STUDENT",
        };

        vi.mocked(apiClient.get).mockResolvedValue({
            data: {
                success: true,
                data: profile,
            },
        });

        const { result } = renderHook(() => useAuthMe());

        await act(async () => {
            await result.current.fetchProfile();
        });

        expect(mockSetProfile).toHaveBeenCalledWith(profile);
        expect(mockSetError).toHaveBeenCalledWith(null);
        expect(mockSetIsLoadingProfile).toHaveBeenCalledWith(true);
        expect(mockSetIsLoadingProfile).toHaveBeenLastCalledWith(false);
    });

    it("should fetch profile successfully when backend returns profile directly", async () => {
        const profile = {
            id: "1",
            email: "test@test.com",
            role: "VENDOR",
        };

        vi.mocked(apiClient.get).mockResolvedValue({
            data: profile,
        });

        const { result } = renderHook(() => useAuthMe());

        await act(async () => {
            await result.current.fetchProfile();
        });

        expect(mockSetProfile).toHaveBeenCalledWith(profile);
    });

    it("should handle normal Error", async () => {
        const error = new Error("Network Error");

        vi.mocked(apiClient.get).mockRejectedValue(error);

        const { result } = renderHook(() => useAuthMe());

        await expect(
            result.current.fetchProfile()
        ).rejects.toThrow("Network Error");

        expect(mockSetError).toHaveBeenCalledWith(
            "Network Error"
        );
    });

    it("should handle axios error with backend message", async () => {
        const axiosError = {
            response: {
                status: 500,
                data: {
                    message: "Backend error",
                },
            },
        };

        vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

        vi.mocked(apiClient.get).mockRejectedValue(
            axiosError
        );

        const { result } = renderHook(() => useAuthMe());

        await expect(
            result.current.fetchProfile()
        ).rejects.toEqual(axiosError);

        expect(mockSetError).toHaveBeenCalledWith(
            "Backend error"
        );
    });

    it("should clear profile on 404", async () => {
        const axiosError = {
            response: {
                status: 404,
                data: {
                    message: "User not found",
                },
            },
        };

        vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

        vi.mocked(apiClient.get).mockRejectedValue(
            axiosError
        );

        const { result } = renderHook(() => useAuthMe());

        await expect(
            result.current.fetchProfile()
        ).rejects.toEqual(axiosError);

        expect(mockSetProfile).toHaveBeenCalledWith(null);
    });

    it("should clear profile on 403", async () => {
        const axiosError = {
            response: {
                status: 403,
                data: {
                    message: "Forbidden",
                },
            },
        };

        vi.spyOn(axios, "isAxiosError").mockReturnValue(true);

        vi.mocked(apiClient.get).mockRejectedValue(
            axiosError
        );

        const { result } = renderHook(() => useAuthMe());

        await expect(
            result.current.fetchProfile()
        ).rejects.toEqual(axiosError);

        expect(mockSetProfile).toHaveBeenCalledWith(null);
    });

    it("should expose current store state", () => {
        vi.mocked(useAuthStore).mockReturnValue({
            profile: { id: "1" },
            isLoadingProfile: true,
            error: "Some error",
            setProfile: mockSetProfile,
            setIsLoadingProfile: mockSetIsLoadingProfile,
            setError: mockSetError,
        } as any);

        const { result } = renderHook(() => useAuthMe());

        expect(result.current.profile).toEqual({
            id: "1",
        });

        expect(
            result.current.isLoadingProfile
        ).toBe(true);

        expect(result.current.error).toBe(
            "Some error"
        );
    });
});