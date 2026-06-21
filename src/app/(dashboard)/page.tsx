"use client";

import { useWorkspaces } from "@/features/workspaces/api/use-workspaces";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Dashboard Entry page.
 * Detects workspace list and performs redirects to the first available workspace,
 * or displays onboarding states.
 */
export default function DashboardHomePage() {
  const { data: workspaces, isLoading } = useWorkspaces();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && workspaces && workspaces.length > 0) {
      // Direct user to default loaded workspace
      router.replace(`/w/${workspaces[0].id}`);
    }
  }, [workspaces, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-950 p-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center p-8 max-w-md mx-auto text-center gap-4">
      <h2 className="text-xl font-semibold text-slate-100">Welcome to TaskBoard!</h2>
      <p className="text-sm text-slate-400">
        To get started, create your first project workspace or select an existing one from the sidebar selector.
      </p>
    </div>
  );
}
