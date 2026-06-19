import { describe, it, expect } from "vitest";

import theme from "../theme";

describe("Chakra theme configuration", () => {

    it("should create theme correctly", () => {
        expect(theme).toBeDefined();
    });

    it("should contain primary colors tokens", () => {

        const colors = theme._config?.theme?.tokens?.colors;

        expect(colors).toBeDefined();

        expect(colors?.primaryBlue?.value)
            .toBe("#042E63");

        expect(colors?.primaryCyan?.value)
            .toBe("#30B2BC");

        expect(colors?.primaryOrange?.value)
            .toBe("#E65100");

        expect(colors?.primaryRed?.value)
            .toBe("#FF0000");

    });

});