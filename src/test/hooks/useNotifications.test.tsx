import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { useNotifications } from "../../hooks/useNotifications";
import { apiClient } from "../../api/axiosConfig";

vi.mock("../../api/axiosConfig", () => ({
    apiClient: {
        get: vi.fn(),
    },
}));

describe("useNotifications", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should load notifications successfully from wrapped response", async () => {
        const mockResponseData = [
            {
                id: "1",
                vendorName: "Pizza House",
                status: "READY",
            },
        ];

        vi.mocked(apiClient.get).mockResolvedValue({
            data: {
                data: mockResponseData,
            },
        });

        const { result } = renderHook(() => useNotifications());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.notifications).toEqual([
            {
                id: "1",
                title: "¡Tu pedido está listo para retirar!",
                restaurant: "Pizza House",
                status: "READY",
            },
        ]);
    });

    it("should load notifications successfully from direct response", async () => {
        const mockResponseData = [
            {
                id: "1",
                vendorName: "Burger Express",
                status: "READY",
            },
        ];

        vi.mocked(apiClient.get).mockResolvedValue({
            data: mockResponseData,
        });

        const { result } = renderHook(() => useNotifications());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.notifications).toEqual([
            {
                id: "1",
                title: "¡Tu pedido está listo para retirar!",
                restaurant: "Burger Express",
                status: "READY",
            },
        ]);
    });

    it("should return empty array when response is not an array", async () => {
        vi.mocked(apiClient.get).mockResolvedValue({
            data: {
                data: {
                    message: "invalid format",
                },
            },
        });

        const { result } = renderHook(() => useNotifications());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.notifications).toEqual([]);
    });

    it("should return empty array when api request fails", async () => {
        vi.mocked(apiClient.get).mockRejectedValue(
            new Error("Network Error")
        );

        const consoleSpy = vi
            .spyOn(console, "error")
            .mockImplementation(() => { });

        const { result } = renderHook(() => useNotifications());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.notifications).toEqual([]);

        consoleSpy.mockRestore();
    });

    it("should call student orders endpoint", async () => {
        vi.mocked(apiClient.get).mockResolvedValue({
            data: [],
        });

        renderHook(() => useNotifications());

        await waitFor(() => {
            expect(apiClient.get).toHaveBeenCalledWith(
                "/api/orders/student"
            );
        });
    });

    it("should start in loading state", () => {
        vi.mocked(apiClient.get).mockImplementation(
            () => new Promise(() => { })
        );

        const { result } = renderHook(() => useNotifications());

        expect(result.current.isLoading).toBe(true);
        expect(result.current.notifications).toEqual([]);
    });

    it("should clear all notifications", async () => {
        const mockResponseData = [
            {
                id: "1",
                vendorName: "Pizza House",
                status: "READY",
            },
        ];

        vi.mocked(apiClient.get).mockResolvedValue({
            data: mockResponseData,
        });

        const { result } = renderHook(() => useNotifications());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.notifications).toHaveLength(1);

        act(() => {
            result.current.clearAll();
        });

        expect(result.current.notifications).toEqual([]);
    });
});