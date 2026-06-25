import { describe, it, expect, vi } from "vitest";
import { waitFor, act } from "@testing-library/react";


vi.mock("@clerk/clerk-react", () => ({
    ClerkProvider: ({ children }: any) => (
        <div data-testid="clerk-provider">
            {children}
        </div>
    ),
}));


vi.mock("@chakra-ui/react", async () => {

    const actual = await vi.importActual<any>(
        "@chakra-ui/react"
    );

    return {
        ...actual,

        ChakraProvider: ({ children }: any) => (
            <div data-testid="chakra-provider">
                {children}
            </div>
        ),

    };

});


vi.mock("../App", () => ({
    default: () => (
        <div data-testid="app-component">
            Main App
        </div>
    ),
}));


describe("main.tsx entry point", () => {

    it("should mount App with providers", async () => {
        import.meta.env.VITE_CLERK_PUBLISHABLE_KEY = "pk_test_mock_key";
        import.meta.env.VITE_API_BASE_URL = "http://localhost:3000";

        document.body.innerHTML = `
            <div id="root"></div>
        `;


        await act(async () => {
            await import("../main");
        });


        await waitFor(() => {

            expect(
                document.querySelector(
                    "[data-testid='clerk-provider']"
                )
            ).toBeTruthy();


            expect(
                document.querySelector(
                    "[data-testid='chakra-provider']"
                )
            ).toBeTruthy();


            expect(
                document.querySelector(
                    "[data-testid='app-component']"
                )
            ).toBeTruthy();

        });

    }, 90000);

});