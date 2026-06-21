"use client";

import React, { useState, useEffect } from "react";
import { useLogin } from "../hooks/use-auth";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sessionExpired, setSessionExpired] = useState(false);

  const login = useLogin();

  useEffect(() => {
    const expired = localStorage.getItem("session_expired") === "true";
    if (expired) {
      localStorage.removeItem("session_expired");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSessionExpired(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSessionExpired(false);

    login.mutate(
      { email, password },
      {
        onError: (err) => {
          setError(err.message || "Login failed");
        },
      }
    );
  };

  return (
    <div className="w-full max-w-md rounded-lg border border-slate-800 bg-slate-900/40 p-8 shadow-xl backdrop-blur-sm">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-slate-100">Welcome Back</h3>
        <p className="text-xs text-slate-500 mt-1">Sign in to access your workspaces</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {sessionExpired && (
          <div className="rounded bg-amber-950/20 border border-amber-900/50 p-3 text-xs text-amber-400 font-medium">
            Your session has expired. Please sign in again.
          </div>
        )}

        {error && (
          <div className="rounded bg-rose-950/20 border border-rose-900/50 p-3 text-xs text-rose-400 font-medium">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-slate-200 outline-none focus:border-blue-500 transition-colors"
            placeholder="name@company.com"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-slate-200 outline-none focus:border-blue-500 transition-colors"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={login.isPending}
          className="w-full rounded bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
        >
          {login.isPending ? "Logging in..." : "Continue"}
        </button>
      </form>
    </div>
  );
}
