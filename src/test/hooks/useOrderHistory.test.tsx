import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { useOrderHistory } from "../../hooks/useOrderHistory";
import { apiClient } from "../../api/axiosConfig";

vi.mock("../../api/axiosConfig", () => ({
    apiClient: {
        get: vi.fn(),
    },
}));

describe("useOrderHistory", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should load orders from wrapped backend response", async () => {
        const orders = [
            {
                id: "1",
                restaurant: "Pizza House",
                price: "$10",
                date: "2025-08-01",
                status: "Entregado",
            },
        ];

        vi.mocked(apiClient.get).mockResolvedValue({
            data: {
                data: orders,
            },
        });

        const { result } = renderHook(() => useOrderHistory());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.orders).toEqual(orders);
        expect(result.current.error).toBeNull();
    });

    it("should load orders from direct response", async () => {
        const orders = [
            {
                id: "2",
                restaurant: "Burger Express",
                price: "$15",
                date: "2025-08-02",
                status: "Entregado",
            },
        ];

        vi.mocked(apiClient.get).mockResolvedValue({
            data: orders,
        });

        const { result } = renderHook(() => useOrderHistory());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.orders).toEqual(orders);
    });

    it("should return empty array when response is not an array", async () => {
        vi.mocked(apiClient.get).mockResolvedValue({
            data: {
                data: {
                    message: "invalid",
                },
            },
        });

        const { result } = renderHook(() => useOrderHistory());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.orders).toEqual([]);
        expect(result.current.error).toBeNull();
    });

    it("should handle Error instance correctly", async () => {
        vi.mocked(apiClient.get).mockRejectedValue(
            new Error("Network Error")
        );

        const { result } = renderHook(() => useOrderHistory());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.orders).toEqual([]);
        expect(result.current.error).toBe("Network Error");
    });

    it("should handle unknown errors", async () => {
        vi.mocked(apiClient.get).mockRejectedValue("Unknown");

        const { result } = renderHook(() => useOrderHistory());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.orders).toEqual([]);
        expect(result.current.error).toBe(
            "Unknown error occurred"
        );
    });

    it("should call the correct endpoint", async () => {
        vi.mocked(apiClient.get).mockResolvedValue({
            data: [],
        });

        renderHook(() => useOrderHistory());

        await waitFor(() => {
            expect(apiClient.get).toHaveBeenCalledWith(
                "/api/student/order-history"
            );
        });
    });

    it("should start in loading state", () => {
        vi.mocked(apiClient.get).mockImplementation(
            () => new Promise(() => { })
        );

        const { result } = renderHook(() => useOrderHistory());

        expect(result.current.isLoading).toBe(true);
        expect(result.current.orders).toEqual([]);
        expect(result.current.error).toBeNull();
    });

    it("should allow manual refetch", async () => {
        const orders = [
            {
                id: "1",
                restaurant: "Pizza House",
                price: "$10",
                date: "2025-08-01",
                status: "Entregado",
            },
        ];

        vi.mocked(apiClient.get).mockResolvedValue({
            data: orders,
        });

        const { result } = renderHook(() => useOrderHistory());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(apiClient.get).toHaveBeenCalledTimes(1);

        await act(async () => {
            await result.current.refetch();
        });

        expect(apiClient.get).toHaveBeenCalledTimes(2);
    });

    it("should clear previous error when refetch succeeds", async () => {
        vi.mocked(apiClient.get)
            .mockRejectedValueOnce(new Error("Error"))
            .mockResolvedValueOnce({
                data: [],
            });

        const { result } = renderHook(() => useOrderHistory());

        await waitFor(() => {
            expect(result.current.error).toBe("Error");
        });

        await act(async () => {
            await result.current.refetch();
        });

        await waitFor(() => {
            expect(result.current.error).toBeNull();
        });
    });
});