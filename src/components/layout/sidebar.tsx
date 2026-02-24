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

export function Sidebar({ role, permissions = [] }: SidebarProps) {
  const pathname = usePathname();

  const adminLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/finance", label: "Finance", icon: CreditCard },
    { href: "/admin/reports", label: "Reports", icon: FileText },
  ];

  // Conditionally add Courses link based on permission
  if (permissions.includes("courses:create") || permissions.includes("courses:manage") || role === "SUPERADMIN") {
    // Insert after Users (index 2)
    adminLinks.splice(2, 0, { href: "/admin/courses", label: "Courses", icon: BookOpen });
  }

  const links = {
    SUPERADMIN: [
      { href: "/superadmin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/superadmin/admins", label: "Admins", icon: Users },
      { href: "/superadmin/faculties", label: "Faculties", icon: GraduationCap },
      { href: "/superadmin/departments", label: "Departments", icon: BookOpen },
      { href: "/superadmin/audit", label: "Audit Logs", icon: FileText },
    ],
    ADMIN: adminLinks,
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
    <aside className="w-full h-full bg-transparent flex flex-col">
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {currentLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-md transition-all font-display text-sm",
                isActive
                  ? "bg-university-gold text-accent font-bold shadow-md"
                  : "text-slate-700 dark:text-slate-300 hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
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
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-500/10 hover:text-red-600 rounded-md transition-colors text-sm"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
