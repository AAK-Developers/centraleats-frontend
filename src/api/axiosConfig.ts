import axios from 'axios';

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://98.81.131.47:3001',
});

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