import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const apiClient = axios.create({
    baseURL,
    withCredentials: true,
});


console.log('API apiClient initialized with baseURL:', baseURL);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status } = error.response;
            if (status === 401) {
                console.error('Sesión expirada o no autorizada');
            } else if (status === 403) {
                console.error('Acceso denegado: permisos insuficientes o cuenta inactiva');
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