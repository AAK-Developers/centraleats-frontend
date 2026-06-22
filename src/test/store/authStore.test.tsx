import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "../../store/authStore";

describe("authStore", () => {
    beforeEach(() => {
        useAuthStore.setState({
            profile: null,
            isLoadingProfile: false,
            error: null,
        });
    });

    it("should initialize with default state", () => {
        const state = useAuthStore.getState();

        expect(state.profile).toBeNull();
        expect(state.isLoadingProfile).toBe(false);
        expect(state.error).toBeNull();
    });

    it("should set profile and clear error", () => {
        const profile = {
            id: "1",
            email: "test@test.com",
            fullName: "Kevin Moyon",
            role: "STUDENT" as const,
            isActive: true,
            clerkId: "clerk_123",
            avatarUrl: "avatar.jpg",
        };

        useAuthStore.getState().setProfile(profile);

        const state = useAuthStore.getState();

        expect(state.profile).toEqual(profile);
        expect(state.error).toBeNull();
    });

    it("should set profile to null", () => {
        useAuthStore.getState().setProfile(null);

        expect(
            useAuthStore.getState().profile
        ).toBeNull();
    });

    it("should set loading state to true", () => {
        useAuthStore
            .getState()
            .setIsLoadingProfile(true);

        expect(
            useAuthStore.getState().isLoadingProfile
        ).toBe(true);
    });

    it("should set loading state to false", () => {
        useAuthStore
            .getState()
            .setIsLoadingProfile(false);

        expect(
            useAuthStore.getState().isLoadingProfile
        ).toBe(false);
    });

    it("should set error message", () => {
        useAuthStore
            .getState()
            .setError("Something went wrong");

        expect(
            useAuthStore.getState().error
        ).toBe("Something went wrong");
    });

    it("should clear error", () => {
        useAuthStore
            .getState()
            .setError("Error");

        useAuthStore
            .getState()
            .setError(null);

        expect(
            useAuthStore.getState().error
        ).toBeNull();
    });

    it("should clear authentication state", () => {
        const profile = {
            id: "1",
            email: "test@test.com",
            fullName: "Kevin Moyon",
            role: "STUDENT" as const,
            isActive: true,
            clerkId: "clerk_123",
        };

        useAuthStore.setState({
            profile,
            isLoadingProfile: true,
            error: "Some error",
        });

        useAuthStore.getState().clearAuth();

        const state = useAuthStore.getState();

        expect(state.profile).toBeNull();
        expect(state.error).toBeNull();
        expect(state.isLoadingProfile).toBe(false);
    });

    it("should replace previous profile", () => {
        const profile1 = {
            id: "1",
            email: "user1@test.com",
            fullName: "User One",
            role: "STUDENT" as const,
            isActive: true,
            clerkId: "clerk1",
        };

        const profile2 = {
            id: "2",
            email: "user2@test.com",
            fullName: "User Two",
            role: "VENDOR" as const,
            isActive: true,
            clerkId: "clerk2",
        };

        useAuthStore.getState().setProfile(profile1);
        useAuthStore.getState().setProfile(profile2);

        expect(
            useAuthStore.getState().profile
        ).toEqual(profile2);
    });

    it("should clear error when setting a profile", () => {
        useAuthStore.getState().setError("Error");

        const profile = {
            id: "1",
            email: "test@test.com",
            fullName: "Kevin Moyon",
            role: "STUDENT" as const,
            isActive: true,
            clerkId: "clerk123",
        };

        useAuthStore.getState().setProfile(profile);

        expect(
            useAuthStore.getState().error
        ).toBeNull();
    });
});