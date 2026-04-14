"use client";

import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user ?? null,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    role: session?.user?.role ?? null,
    isTeacher: session?.user?.role === "TEACHER",
    isStudent: session?.user?.role === "STUDENT",
    isParent: session?.user?.role === "PARENT",
  };
}
