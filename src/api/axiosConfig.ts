import axios from 'axios';
import { VITE_API_BASE_URL } from '../config/env';

const baseURL = VITE_API_BASE_URL;

export const apiClient = axios.create({
    baseURL,
    withCredentials: true,
});

// console.log('API apiClient initialized with baseURL:', baseURL);

import type { ApiResponse } from '../types/api';

apiClient.interceptors.response.use(
    (response) => {
        // Normalize response to JSend format if it's not already
        if (response.data && typeof response.data === 'object' && !('status' in response.data && 'data' in response.data)) {
            const normalizedData: ApiResponse<any> = {
                status: 'success',
                data: response.data.data ? response.data.data : response.data,
            };
            response.data = normalizedData;
        }
        return response;
    },
    (error) => {
        if (error.response) {
            const { status } = error.response;
            if (status === 401) {
                console.error('Sesión expirada o no autorizada');
            } else if (status === 403) {
                console.error('Acceso denegado: permisos insuficientes o cuenta inactiva');
            }
            
            // Normalize error response
            if (error.response.data && typeof error.response.data === 'object' && !('status' in error.response.data)) {
                 error.response.data = {
                     status: 'error',
                     message: error.response.data.message || 'Ocurrió un error en la solicitud',
                     data: null
                 };
            }
        }
        return Promise.reject(error);
    }
);

export const setupAxiosInterceptor = (getToken: () => Promise<string | null>) => {
    const interceptor = apiClient.interceptors.request.use(
        async (config) => {
            const token = await getToken();

            if (token) {
                config.headers.set('Authorization', `Bearer ${token}`);
            }

            return config;
        },
        (error) => Promise.reject(error)
    );

    return () => {
        apiClient.interceptors.request.eject(interceptor);
    };
};