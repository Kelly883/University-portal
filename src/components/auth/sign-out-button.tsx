"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="flex items-center space-x-3 w-full px-4 py-2 text-red-400 hover:bg-slate-800 rounded transition-colors"
    >
      <LogOut size={20} />
      <span>Sign Out</span>
    </button>
  );
}
