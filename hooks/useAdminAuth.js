"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

export function useAdminAuth() {
  const [authState, setAuthState] = useState({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  const router = useRouter();
  const pathname = usePathname();

  const verifyToken = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/auth/me", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setAuthState({
          user: data,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
        return { ok: true, data };
      } else {
        const err = await safeJson(response);
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: err?.error || err?.message || "Unauthorized",
        });
        // Auto-redirect on unauthorized for admin routes
        if (
          (response.status === 401 || response.status === 403) &&
          pathname?.startsWith("/admin") &&
          pathname !== "/admin/auth/login"
        ) {
          router.push("/admin/auth/login");
        }
        return { ok: false, error: err };
      }
    } catch (error) {
      setAuthState((s) => ({
        ...s,
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: error?.message || "Failed to verify session",
      }));
      // Auto-redirect on verification failure for admin routes
      if (pathname?.startsWith("/admin") && pathname !== "/admin/auth/login") {
        router.push("/admin/auth/login");
      }
      return { ok: false, error };
    }
  }, [pathname, router]);

  const login = useCallback(
    async (email, password) => {
      try {
        const res = await fetch("/api/admin/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
          const err = await safeJson(res);
          throw new Error(err?.error || err?.message || "Login failed");
        }
        await verifyToken();
        if (pathname === "/admin/auth/login") {
          router.push("/admin/dashboard");
        }
        return { ok: true };
      } catch (error) {
        setAuthState((s) => ({ ...s, error: error.message }));
        return { ok: false, error };
      }
    },
    [verifyToken, pathname, router]
  );

  const logout = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const err = await safeJson(res);
        throw new Error(err?.error || err?.message || "Logout failed");
      }
    } catch (error) {
      // swallow error but still clear local state
    } finally {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
      router.push("/admin/auth/login");
    }
  }, [router]);

  const changePassword = useCallback(
    async ({ email, password, confirmPassword }) => {
      const res = await fetch("/api/admin/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, confirmPassword }),
      });
      if (!res.ok) {
        const err = await safeJson(res);
        throw new Error(err?.error || err?.message || "Change password failed");
      }
      return { ok: true };
    },
    []
  );

  const refresh = useCallback(() => verifyToken(), [verifyToken]);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  return {
    ...authState,
    login,
    logout,
    changePassword,
    refresh,
  };
}

async function safeJson(res) {
  try {
    return await res.json();
  } catch (_) {
    return null;
  }
}
