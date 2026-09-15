import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const STORAGE_KEY = 'auth-storage';

const scrubTokens = (user) => {
    if (!user) return null;
    const { token, refreshToken, accessToken, ...safeUser } = user;
    return safeUser;
};

const ensureArray = (value) => (Array.isArray(value) ? value : []);

// One-time cleanup of older persisted shapes that might contain tokens
try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.state) {
            if (parsed.state.accessToken) delete parsed.state.accessToken;
            if (parsed.state.user) parsed.state.user = scrubTokens(parsed.state.user);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }
    }
} catch (e) {
}

const useAuthStore = create(
    persist(
        (set, get) => ({
            // Ephemeral access token; never persisted
            accessToken: null,
            setAccessToken: (token) => set({ accessToken: token }),
            clearAccessToken: () => set({ accessToken: null }),

            // User profile without tokens; persisted
            user: null,
            setUser: (user) => set({ user: scrubTokens(user) }),
            clearUser: () => set({ user: null }),

            // Role/permission helpers
            hasRole: (role) => {
                const user = get().user;
                if (!user) return false;
                if (user.mainRole === role) return true;
                return ensureArray(user.roles).includes(role);
            },
            hasPermission: (perm) => {
                const user = get().user;
                if (!user) return false;
                return ensureArray(user.permissions).includes(perm);
            },

            // Full reset
            clearAuth: () => set({ accessToken: null, user: null }),
        }),
        {
            name: STORAGE_KEY,
            getStorage: () => localStorage,
            // Persist only the token-free user shape
            partialize: (state) => {
                const u = scrubTokens(state.user);
                if (!u) return { user: null };
                return {
                    user: {
                        id: u.id,
                        firstName: u.firstName,
                        lastName: u.lastName,
                        login: u.login,
                        mainRole: u.mainRole,
                        roles: ensureArray(u.roles),
                        permissions: ensureArray(u.permissions),
                    },
                };
            },
            // On hydration, drop any lingering tokens just in case
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.accessToken = null;
                    state.user = scrubTokens(state.user);
                }
            },
        }
    )
);

export default useAuthStore;
