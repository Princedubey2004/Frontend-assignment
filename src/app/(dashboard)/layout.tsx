"use client";

import React from "react";
import { AuthGuard } from "@/features/auth/components/auth-guard";
import { Sidebar } from "./components/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
