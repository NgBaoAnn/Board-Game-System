import { create } from "zustand";

export const useAuth = create((set) => ({
  user: null,
  authenticated: false,
  isAppLoading: true, 

  setUser: (user) => set({ user, authenticated: true }),

  setAuthenticated: (authenticated) => set({ authenticated }),

  setAppLoading: (isAppLoading) => set({ isAppLoading }),

  clearUser: () =>
    set({
      user: null,
      authenticated: false,
    }),
}));