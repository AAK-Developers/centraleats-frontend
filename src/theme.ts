import { createSystem, defaultConfig } from "@chakra-ui/react";

const theme = createSystem(defaultConfig, {
    theme: {
        tokens: {
            colors: {
                primaryBlue: { value: "#042E63" },
                primaryCyan: { value: "#30B2BC" },
                primaryOrange: { value: "#E65100" },
                primaryRed: { value: "#FF0000" },
            },
        },
    },
});

export default theme;