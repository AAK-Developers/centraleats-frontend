import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const apiClient = axios.create({
    baseURL,
    withCredentials: true,
});

// Debug log to verify the URL being used
console.log('API apiClient initialized with baseURL:', baseURL);

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