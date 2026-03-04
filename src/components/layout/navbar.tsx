"use client";

import { Bell, Search, User, Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Sidebar } from "./sidebar";

export function Navbar({ role }: { role?: string }) {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="h-16 bg-white dark:bg-[#161B22] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>

          <h1 className="text-xl font-heading uppercase tracking-wide text-titan-blue dark:text-university-gold">
            {role || "Dashboard"}
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-full text-sm border-none focus:ring-2 focus:ring-university-gold/50 w-64 transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          </div>

          <button className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#161B22]"></span>
          </button>

          <div className="flex items-center gap-3 pl-2 sm:pl-4 sm:border-l border-slate-200 dark:border-slate-800">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-titan-blue dark:text-white leading-none">{session?.user?.name || "User"}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider">{role || "Guest"}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-titan-gold text-titan-blue rounded-full flex items-center justify-center font-bold border-2 border-university-gold/30">
              {session?.user?.image ? (
                <img src={session.user.image} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User size={20} />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sidebar Panel */}
          <div className="relative w-[280px] h-full bg-[#0D1117] shadow-2xl animate-in slide-in-from-left duration-300">
            <Sidebar 
              role={role as any} 
              onClose={() => setIsMobileMenuOpen(false)} 
            />
          </div>
        </div>
      )}
    </>
  );
}
