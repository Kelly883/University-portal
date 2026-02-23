import { auth } from "@/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, FileText, Shield, LogOut } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "SUPERADMIN") {
    redirect("/login");
  }

  const superAdminLinks = [
    { name: "Dashboard", href: "/superadmin", icon: LayoutDashboard },
    { name: "Manage Admins", href: "/superadmin/admins", icon: Users },
    { name: "Audit Logs", href: "/superadmin/audit", icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
       {/* Simple Sidebar for Superadmin */}
       <div className="w-64 bg-slate-900 text-white flex flex-col">
          <div className="p-4 text-2xl font-bold border-b border-slate-700">
             Titan SuperAdmin
          </div>
          <nav className="flex-1 p-4 space-y-2">
             {superAdminLinks.map((link) => {
               const Icon = link.icon;
               return (
                 <Link
                   key={link.href}
                   href={link.href}
                   className="flex items-center space-x-3 px-4 py-3 rounded hover:bg-slate-800 transition-colors"
                 >
                   <Icon size={20} />
                   <span>{link.name}</span>
                 </Link>
               );
             })}
          </nav>
          <div className="p-4 border-t border-slate-700">
             <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                   <Shield size={16} />
                </div>
                <div>
                   <p className="text-sm font-medium">{session.user.name}</p>
                   <p className="text-xs text-slate-400">Super Admin</p>
                </div>
             </div>
             <SignOutButton />
          </div>
       </div>

       {/* Main Content */}
       <div className="flex-1 overflow-auto">
          <main className="p-8">
             {children}
          </main>
       </div>
    </div>
  );
}
