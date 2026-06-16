import { useCallback } from 'react';
import axios from 'axios';
import { apiClient } from '../api/axiosConfig';
import { useAuthStore } from '../store/authStore';
import type { UserProfile } from '../store/authStore';

interface BackendResponse {
    success: boolean;
    data: UserProfile;
}

export const useAuthMe = () => {
    const { setProfile, setIsLoadingProfile, setError, profile, isLoadingProfile, error } = useAuthStore();

    const fetchProfile = useCallback(async () => {
        setIsLoadingProfile(true);
        setError(null);
        try {
            const response = await apiClient.get<BackendResponse | UserProfile>('/api/auth/me');
            
            // Backend might return the profile directly or wrapped in { data: UserProfile }
            const responseData = response.data;
            const profileData = (responseData as BackendResponse).data || (responseData as UserProfile);
            
            setProfile(profileData);
            return profileData;
        } catch (err: unknown) {
            let message = 'Failed to fetch user profile';
            
            if (axios.isAxiosError(err)) {
                message = err.response?.data?.message || message;
                
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
        error,
        fetchProfile,
    };
};