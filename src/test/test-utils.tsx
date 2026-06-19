import { render } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import type { ReactNode } from "react";

import theme from "../theme";

export function renderWithProviders(ui: ReactNode) {
    return render(
        <ChakraProvider value={theme}>
            {ui}
        </ChakraProvider>
    );
}