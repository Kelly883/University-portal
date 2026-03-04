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
  LogOut,
  ShieldCheck,
  FileText
} from "lucide-react";
import { signOut } from "next-auth/react";

interface SidebarProps {
  role: "ADMIN" | "FACULTY" | "STUDENT" | "SUPERADMIN";
  permissions?: string[];
}

export function Sidebar({ role, permissions = [], onClose }: SidebarProps & { onClose?: () => void }) {
  const pathname = usePathname();

  const adminLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/finance", label: "Finance", icon: CreditCard },
    { href: "/admin/reports", label: "Reports", icon: FileText },
  ];

  // Conditionally add Courses link based on permission
  if (permissions.includes("CREATE_COURSE") || permissions.includes("EDIT_COURSE") || permissions.includes("DELETE_COURSE") || role === "SUPERADMIN") {
    // Insert after Users (index 2)
    adminLinks.splice(2, 0, { href: "/admin/courses", label: "Courses", icon: BookOpen });
  }

  // Add Admissions Link
  if (permissions.includes("MANAGE_ADMISSIONS") || role === "SUPERADMIN") {
    adminLinks.push({ href: "/admin/admissions", label: "Admissions", icon: FileText });
  }

  // Add Superadmin Access Link (for authorized admins)
  if (permissions.includes("VIEW_ADMISSION_DASHBOARD")) {
    adminLinks.push({ href: "/superadmin", label: "Superadmin Access", icon: ShieldCheck });
  }

  const links = {
    SUPERADMIN: [
      { href: "/superadmin", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/superadmin/admins", label: "Admins", icon: Users },
      { href: "/superadmin/faculties", label: "Academics", icon: GraduationCap },
      { href: "/admin/courses", label: "Courses", icon: BookOpen },
      { href: "/superadmin/audit", label: "Audit Logs", icon: FileText },
    ],
    ADMIN: adminLinks,
    FACULTY: [
      { href: "/faculty", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/faculty/courses", label: "My Courses", icon: BookOpen },
      { href: "/faculty/students", label: "Students", icon: Users },
      { href: "/faculty/grading", label: "Grading", icon: ShieldCheck },
    ],
    STUDENT: [
      { href: "/student", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/student/courses", label: "My Courses", icon: BookOpen },
      { href: "/student/grades", label: "Grades", icon: GraduationCap },
      { href: "/student/payments", label: "Payments", icon: CreditCard },
    ],
  };

  const currentLinks = links[role] || [];

  return (
    <aside className="w-full h-full bg-white dark:bg-[#0D1117] flex flex-col border-r border-slate-200 dark:border-slate-800">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-titan-gold rounded-lg flex items-center justify-center text-titan-blue font-bold">
          T
        </div>
        <span className="font-heading font-bold text-lg text-titan-blue dark:text-white uppercase tracking-wider">
          Titan Univ
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {currentLinks.map((link) => {
          const Icon = link.icon;
          // Improved active state logic
          const isActive = link.exact 
            ? pathname === link.href
            : pathname.startsWith(link.href);
            
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-display text-sm relative group",
                isActive
                  ? "bg-titan-blue/5 dark:bg-white/10 text-titan-blue dark:text-titan-gold font-bold shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-titan-blue dark:bg-titan-gold rounded-r-full"></div>
              )}
              <Icon size={20} className={cn(isActive ? "text-titan-blue dark:text-titan-gold" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300")} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 rounded-lg transition-colors text-sm font-medium"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
