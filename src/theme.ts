import { createSystem, defaultConfig } from "@chakra-ui/react"

const theme = createSystem(defaultConfig, {
    theme: {
        tokens: {
            colors: {
                primary: {
                    blue: { value: '#042E63' },
                    cyan: { value: '#30B2BC' },
                    orange: { value: '#E65100' },
                    red: { value: '#FF0000' },
                },
            },
        },
    },
})

export default theme


