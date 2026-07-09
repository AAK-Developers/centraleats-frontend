/**
 * Demo de integración de WebAssembly (WASM).
 * En un entorno real, aquí importaríamos un módulo Rust o Go compilado a WASM
 * usando vite-plugin-wasm.
 * Ejemplo real:
 * import { sort_products } from 'my-rust-wasm-package';
 * 
 * Por ahora, simulamos la interfaz para que el equipo entienda cómo
 * WebAssembly se conecta con el JamStack.
 */

export interface WasmProduct {
    id: string;
    price: number;
    name: string;
}

export const wasmSortProducts = async (products: WasmProduct[], sortBy: 'price_asc' | 'price_desc' | 'name_az'): Promise<WasmProduct[]> => {
    // Aquí invocaríamos a WebAssembly:
    // return sort_products(products, sortBy);
    
    // Simulación JS:
    return new Promise((resolve) => {
        const sorted = [...products].sort((a, b) => {
            if (sortBy === 'price_asc') return a.price - b.price;
            if (sortBy === 'price_desc') return b.price - a.price;
            if (sortBy === 'name_az') return a.name.localeCompare(b.name);
            return 0;
        });
        resolve(sorted);
    });
};
