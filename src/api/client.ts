// src/api/client.ts
import axios from 'axios';

// Definimos una interfaz para el objeto window si es necesario
declare global {
    interface Window {
        Clerk: any;
    }
}

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://api.tu-backend-ejemplo.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(async (config) => {
    try {
        // Ahora TS reconoce window.Clerk
        const token = await window.Clerk?.session?.getToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.error('Error al obtener el token de Clerk:', error);
    }
    return config;
});

export default apiClient;