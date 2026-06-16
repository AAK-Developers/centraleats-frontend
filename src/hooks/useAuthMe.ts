import { useCallback } from 'react';
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
        } catch (err: any) {
            const message = err.response?.data?.message || 'Error al obtener el perfil';
            setError(message);
            // Si el error es 404 o 403 (perfil no encontrado), limpiamos el perfil local
            if (err.response?.status === 404 || err.response?.status === 403) {
                setProfile(null);
            }
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