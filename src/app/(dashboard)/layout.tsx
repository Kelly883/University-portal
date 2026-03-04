
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { redirect } from "next/navigation";
import { NotificationToast } from "@/components/ui/notification-toast";

// This layout is a server component that wraps all dashboard pages
export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role as "ADMIN" | "FACULTY" | "STUDENT" | "SUPERADMIN";
  let permissions = ((session.user as any).permissions || []) as string[];

  // Fetch AdminPermissions if role is ADMIN
  if (role === "ADMIN") {
    const adminPermissions = await prisma.adminPermission.findMany({
      where: { adminId: session.user.id },
      select: { permission: true },
    });
    const extraPermissions = adminPermissions.map(p => p.permission);
    permissions = [...permissions, ...extraPermissions];
  }

  return (
    <div className="flex h-screen bg-[#0D1117] overflow-hidden font-display">
      {/* Desktop Sidebar - Hidden on mobile, fixed on desktop */}
      <div className="hidden md:block w-64 flex-shrink-0 border-r border-slate-800 h-full">
        <Sidebar role={role} permissions={permissions} />
      </div>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-[#0D1117] h-full overflow-hidden">
        {/* Navbar - Visible on all screens, handles mobile menu */}
        <Navbar role={role} permissions={permissions} />
        
        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto relative scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
           <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
             {children}
           </div>
        </main>
        
        <NotificationToast />
      </div>
    </div>
  );
}
