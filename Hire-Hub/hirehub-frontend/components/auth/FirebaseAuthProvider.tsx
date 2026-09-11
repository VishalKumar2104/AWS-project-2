"use client";

import { useEffect } from "react";
import { onAuthChange } from "@/lib/firebaseAuth";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import type { User } from "@/types";

export default function FirebaseAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, setFirebaseState, setLoading, logout } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        setFirebaseState(firebaseUser.uid, firebaseUser.email);
        try {
          // Fetch current profile from backend database
          const res = await api.get<User>("/v1/users/me");
          setUser(res.data);
        } catch (error) {
          console.warn("Could not fetch user profile from backend:", error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      } else {
        logout();
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [setUser, setFirebaseState, setLoading, logout]);

  return <>{children}</>;
}
