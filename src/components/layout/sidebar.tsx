"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  GraduationCap, 
  CreditCard, 
  Settings, 
  LogOut,
  ShieldCheck,
  FileText
} from "lucide-react";
import { signOut } from "next-auth/react";

interface SidebarProps {
  role: "ADMIN" | "FACULTY" | "STUDENT";
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const links = {
    ADMIN: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/users", label: "Users", icon: Users },
      { href: "/admin/courses", label: "Courses", icon: BookOpen },
      { href: "/admin/finance", label: "Finance", icon: CreditCard },
      { href: "/admin/reports", label: "Reports", icon: FileText },
    ],
    FACULTY: [
      { href: "/faculty", label: "Dashboard", icon: LayoutDashboard },
      { href: "/faculty/courses", label: "My Courses", icon: BookOpen },
      { href: "/faculty/students", label: "Students", icon: Users },
      { href: "/faculty/grading", label: "Grading", icon: ShieldCheck },
    ],
    STUDENT: [
      { href: "/student", label: "Dashboard", icon: LayoutDashboard },
      { href: "/student/courses", label: "My Courses", icon: BookOpen },
      { href: "/student/grades", label: "Grades", icon: GraduationCap },
      { href: "/student/payments", label: "Payments", icon: CreditCard },
    ],
  };

  const currentLinks = links[role] || [];

  return (
    <aside className="w-64 bg-accent text-white flex flex-col h-screen fixed left-0 top-0 border-r border-university-gold/20">
      <div className="p-6 flex items-center justify-center border-b border-university-gold/10">
        <div className="w-10 h-10 bg-university-gold rounded-full flex items-center justify-center mr-3 text-accent font-bold">
          TU
        </div>
        <span className="font-heading text-xl uppercase tracking-widest text-university-gold">Titan Univ</span>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {currentLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-md transition-all font-display text-sm",
                isActive
                  ? "bg-university-gold text-accent font-bold shadow-md"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-university-gold/10">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-md transition-colors text-sm"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
