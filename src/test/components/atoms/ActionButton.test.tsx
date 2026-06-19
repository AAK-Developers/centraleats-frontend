import { screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { ActionButton } from "../../../components/atoms/ActionButton";
import { renderWithProviders } from "../../test-utils";

describe("ActionButton Component", () => {
    it("should render the button with the correct label", () => {
        renderWithProviders(
            <ActionButton label="Click aquí" />
        );

        const button = screen.getByRole("button", {
            name: /click aquí/i,
        });

        expect(button).toBeInTheDocument();
    });

    it("should call onClick when clicked", () => {
        const handleClick = vi.fn();

        renderWithProviders(
            <ActionButton
                label="Click"
                onClick={handleClick}
            />
        );

        const button = screen.getByRole("button", {
            name: /click/i,
        });

        button.click();

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should be disabled when disabled prop is passed", () => {
        renderWithProviders(
            <ActionButton
                label="Disabled"
                disabled
            />
        );

        const button = screen.getByRole("button");

        expect(button).toBeDisabled();
    });

    it("should render loading state when isLoading is true", () => {
        renderWithProviders(
            <ActionButton
                label="Loading"
                isLoading
            />
        );

        const button = screen.getByRole("button");

        expect(button).toBeInTheDocument();
    });
});