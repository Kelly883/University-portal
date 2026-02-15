"use client";

import { useSession } from "next-auth/react";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { useEffect, useState } from "react";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [role, setRole] = useState<"ADMIN" | "FACULTY" | "STUDENT" | null>(null);

  useEffect(() => {
    if (session?.user?.role) {
      setRole(session.user.role as "ADMIN" | "FACULTY" | "STUDENT");
    }
  }, [session]);

  if (status === "loading") return <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-accent animate-pulse font-heading text-xl">Loading Portal...</div>;

  if (!role) return null; // Or redirect to login

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-display">
      {/* Sidebar - Fixed Left */}
      <div className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1117] relative z-20">
        <Sidebar role={role} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Navbar />
        
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
