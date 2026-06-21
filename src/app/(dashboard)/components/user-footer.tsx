"use client";

import React from "react";
import { useCurrentUser, useLogout } from "@/features/auth/hooks/use-auth";

export function UserFooter() {
  const { data: user } = useCurrentUser();
  const logout = useLogout();

  return (
    <div className="p-4 border-t border-slate-800 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={user?.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"}
          alt="avatar"
          className="h-9 w-9 rounded-full bg-slate-800"
        />
        <div className="overflow-hidden">
          <p className="text-xs font-semibold truncate text-slate-200">{user?.name}</p>
          <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
        </div>
      </div>
      <button
        onClick={logout}
        className="text-xs text-rose-400 hover:text-rose-300 font-semibold px-2 py-1 rounded hover:bg-rose-950/20"
      >
        Exit
      </button>
    </div>
  );
}
