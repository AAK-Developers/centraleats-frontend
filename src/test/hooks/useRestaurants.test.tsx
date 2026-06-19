import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { useRestaurants } from "../../hooks/useRestaurants";
import { apiClient } from "../../api/axiosConfig";

vi.mock("../../api/axiosConfig", () => ({
    apiClient: {
        get: vi.fn(),
    },
}));

describe("useRestaurants", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should load restaurants from wrapped backend response", async () => {
        const restaurants = [
            {
                name: "Pizza House",
                category: "Pizza",
                time: "20 min",
                rating: 4.8,
                image: "pizza.jpg",
            },
        ];

        vi.mocked(apiClient.get).mockResolvedValue({
            data: {
                data: restaurants,
            },
        });

        const { result } = renderHook(() => useRestaurants());

        await waitFor(() => {
            expect(result.current.restaurants).toEqual(
                restaurants
            );
        });
    });

    it("should load restaurants from direct response", async () => {
        const restaurants = [
            {
                name: "Burger Express",
                category: "Fast Food",
                time: "15 min",
                rating: 4.5,
                image: "burger.jpg",
            },
        ];

        vi.mocked(apiClient.get).mockResolvedValue({
            data: restaurants,
        });

        const { result } = renderHook(() => useRestaurants());

        await waitFor(() => {
            expect(result.current.restaurants).toEqual(
                restaurants
            );
        });
    });

    it("should return empty array when response is not an array", async () => {
        vi.mocked(apiClient.get).mockResolvedValue({
            data: {
                data: {
                    message: "invalid format",
                },
            },
        });

        const { result } = renderHook(() => useRestaurants());

        await waitFor(() => {
            expect(result.current.restaurants).toEqual([]);
        });
    });

    it("should return empty array when api request fails", async () => {
        vi.mocked(apiClient.get).mockRejectedValue(
            new Error("Network Error")
        );

        const consoleSpy = vi
            .spyOn(console, "error")
            .mockImplementation(() => { });

        const { result } = renderHook(() => useRestaurants());

        await waitFor(() => {
            expect(result.current.restaurants).toEqual([]);
        });

        expect(consoleSpy).toHaveBeenCalled();

        consoleSpy.mockRestore();
    });

    it("should call the restaurants endpoint", async () => {
        vi.mocked(apiClient.get).mockResolvedValue({
            data: [],
        });

        renderHook(() => useRestaurants());

        await waitFor(() => {
            expect(apiClient.get).toHaveBeenCalledWith(
                "/api/restaurants"
            );
        });
    });

    it("should initialize with empty array", () => {
        vi.mocked(apiClient.get).mockImplementation(
            () => new Promise(() => { })
        );

        const { result } = renderHook(() => useRestaurants());

        expect(result.current.restaurants).toEqual([]);
    });
});