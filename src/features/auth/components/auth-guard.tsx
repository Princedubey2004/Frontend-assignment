"use client";

import React, { useEffect, useState } from "react";
import { useCurrentUser } from "../hooks/use-auth";
import { useRouter } from "next/navigation";
import { isSessionExpired, clearSession } from "@/lib/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, isError, error } = useCurrentUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const token = localStorage.getItem("auth_token");
    const expired = isSessionExpired();

    if (token && expired) {
      clearSession();
      localStorage.setItem("session_expired", "true");
    }

    const isExpiredError = error?.message === "SESSION_EXPIRED" || expired;

    if (isExpiredError || (!isLoading && (!user || isError))) {
      router.replace("/login");
    }
  }, [user, isLoading, isError, error, router, mounted]);

  if (!mounted || isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="text-sm font-medium text-slate-400">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  const hasValidSession = user && !isSessionExpired();
  return hasValidSession ? <>{children}</> : null;
}
