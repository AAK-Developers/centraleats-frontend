import { create } from 'zustand';

export interface UserProfile {
    id: string;
    email: string;
    fullName: string;
    role: 'STUDENT' | 'VENDOR' | 'ADMIN';
    isActive: boolean;
    clerkId: string;
    avatarUrl?: string;
}

interface AuthState {
    profile: UserProfile | null;
    isLoadingProfile: boolean;
    error: string | null;
    setProfile: (profile: UserProfile | null) => void;
    setIsLoadingProfile: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    profile: null,
    isLoadingProfile: false,
    error: null,
    setProfile: (profile) => set({ profile, error: null }),
    setIsLoadingProfile: (isLoading) => set({ isLoadingProfile: isLoading }),
    setError: (error) => set({ error }),
    clearAuth: () => set({ profile: null, error: null, isLoadingProfile: false }),
}));