import { auth } from "@/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { User, Bell, Search, LogOut } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/auth";

// This layout is a server component that wraps all dashboard pages
export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role as "ADMIN" | "FACULTY" | "STUDENT";

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
          <Sidebar role={role} />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Top Navbar */}
        <header className="h-16 bg-white dark:bg-[#161B22] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm/50 backdrop-blur-md bg-opacity-90">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-heading uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {role} Portal
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-university-gold transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800/50 rounded-full text-sm border border-transparent focus:border-university-gold/50 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-university-gold/10 w-64 transition-all duration-300 placeholder:text-slate-400"
              />
            </div>

            <button className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-accent dark:hover:text-university-gold transition-all duration-300">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#161B22] animate-pulse"></span>
            </button>

            <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-700/50">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-accent dark:text-white leading-tight">{session.user.name}</p>
                <p className="text-[10px] font-medium text-university-gold uppercase tracking-wider">{session.user.email}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-slate-800 text-university-gold rounded-full flex items-center justify-center font-bold border-2 border-university-gold/30 shadow-lg shadow-accent/20">
                {session.user.image ? (
                  <img src={session.user.image} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User size={20} />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-[#0D1117] p-8 relative">
          <div className="absolute inset-0 academic-pattern opacity-[0.03] pointer-events-none fixed"></div>
          <div className="max-w-7xl mx-auto relative z-0 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
