"use client";

import { Bell, Search, User } from "lucide-react";
import { useSession } from "next-auth/react";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="h-16 bg-white dark:bg-[#161B22] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-heading uppercase tracking-wide text-accent dark:text-university-gold">
          {session?.user?.role || "Dashboard"}
        </h1>
      </div>

      <div className="flex items-center gap-4">
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

        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-accent dark:text-white leading-none">{session?.user?.name || "User"}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wider">{session?.user?.role || "Guest"}</p>
          </div>
          <div className="w-10 h-10 bg-accent text-university-gold rounded-full flex items-center justify-center font-bold border-2 border-university-gold/30">
            {session?.user?.image ? (
              <img src={session.user.image} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User size={20} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
