import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { VITE_API_BASE_URL } from '../config/env';

const baseURL = VITE_API_BASE_URL;

export const apiClient = axios.create({
    baseURL,
    withCredentials: true,
});

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
    _retryCount?: number;
}

const MAX_RETRIES = 3;
const BACKOFF_MS = 1000;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
    async (error) => {
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

            if (status === 429 && error.config) {
                const config = error.config as RetryableRequestConfig;
                const retryCount = config._retryCount ?? 0;
                if (retryCount < MAX_RETRIES) {
                    config._retryCount = retryCount + 1;
                    const delay = BACKOFF_MS * 2 ** retryCount;
                    await wait(delay);
                    return apiClient(config);
                }
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