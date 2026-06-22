import { describe, it, expect, } from 'vitest';
import { apiClient } from '../../api/axiosConfig';

describe('Configuración de Axios (apiClient)', () => {
    it('debería tener la configuración base correcta', () => {
        expect(apiClient).toBeDefined();
        expect(apiClient.defaults.withCredentials).toBe(true);
    });

    it('debería usar la URL base desde las variables de entorno', () => {
        expect(apiClient.defaults.baseURL).toBe(import.meta.env.VITE_API_BASE_URL);
    });
});