import { useCallback } from 'react';
import axios from 'axios';
import { apiClient } from '../api/axiosConfig';
import { useAuthStore } from '../store/authStore';
import type { UserProfile } from '../store/authStore';

export const useAuthMe = () => {
    const { setProfile, setIsLoadingProfile, setError, profile, isLoadingProfile } = useAuthStore();

    const fetchProfile = useCallback(async () => {
        setIsLoadingProfile(true);
        setError(null);
        try {
            const response = await apiClient.get<UserProfile>('/api/auth/me');
            setProfile(response.data);
            return response.data;
        } catch (err: unknown) {
            let message = 'Error al obtener el perfil';
            
            if (axios.isAxiosError(err)) {
                message = err.response?.data?.message || message;
                // Si el error es 404 o 403 (perfil no encontrado), limpiamos el perfil local
                if (err.response?.status === 404 || err.response?.status === 403) {
                    setProfile(null);
                }
            } else if (err instanceof Error) {
                message = err.message;
            }

            setError(message);
            throw err;
        } finally {
            setIsLoadingProfile(false);
        }
    }, [setProfile, setIsLoadingProfile, setError]);

    return {
        profile,
        isLoadingProfile,
        fetchProfile,
    };
};