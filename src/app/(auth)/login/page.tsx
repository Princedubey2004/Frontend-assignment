"use client";

import { LoginForm } from "@/features/auth/components/login-form";

/**
 * Guest Login page.
 * Renders the mock authentication form.
 */
export default function LoginPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-950 px-4">
      <LoginForm />
    </div>
  );
}
