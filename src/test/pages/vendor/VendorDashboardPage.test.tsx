import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import VendorDashboardPage from "../../../pages/vendor/VendorDashboardPage";

describe("VendorDashboardPage", () => {

    it("should render the dashboard title", () => {
        render(<VendorDashboardPage />);

        expect(
            screen.getByText("Dashboard Vendedor")
        ).toBeInTheDocument();
    });

});