import { auth } from "@/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, FileText, Shield, LogOut } from "lucide-react";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "SUPERADMIN") {
    redirect("/login");
  }

  // Use the same consistent sidebar as the rest of the dashboard
  const role = session.user.role as "ADMIN" | "FACULTY" | "STUDENT" | "SUPERADMIN";
  const permissions = (session.user as any).permissions || [];

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-accent text-white flex flex-col border-r border-university-gold/20 flex-shrink-0 z-20 shadow-xl">
        <div className="h-16 flex items-center px-6 border-b border-white/10 bg-accent/50 backdrop-blur-sm">
          <div className="w-8 h-8 bg-university-gold rounded-full flex items-center justify-center mr-3 text-accent font-bold shadow-lg shadow-university-gold/20">
            TU
          </div>
          <span className="font-heading text-xl uppercase tracking-widest text-university-gold drop-shadow-sm">Titan Univ</span>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <Sidebar role={role} permissions={permissions} />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-zinc-900/50 border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-6 backdrop-blur-sm z-10">
          <div className="flex items-center text-slate-500">
             <Shield className="mr-2 h-5 w-5 text-university-gold" />
             <span className="font-medium text-slate-900 dark:text-white">Superadmin Console</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{session.user.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{session.user.role.toLowerCase()}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-university-gold/20 flex items-center justify-center text-university-gold font-bold border border-university-gold/30">
                  {session.user.name?.charAt(0) || "U"}
                </div>
             </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
