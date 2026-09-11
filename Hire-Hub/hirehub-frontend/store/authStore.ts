import { create } from "zustand";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  firebaseUid: string | null;
  email: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setFirebaseState: (uid: string | null, email: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  firebaseUid: null,
  email: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),

  setFirebaseState: (uid, email) =>
    set({
      firebaseUid: uid,
      email: email,
      isAuthenticated: !!uid,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  logout: () =>
    set({
      user: null,
      firebaseUid: null,
      email: null,
      isAuthenticated: false,
      isLoading: false,
    }),
}));
