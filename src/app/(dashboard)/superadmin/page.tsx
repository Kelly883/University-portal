import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, FileText, Activity, Lock, TrendingUp, FileCheck } from "lucide-react";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function SuperAdminDashboard() {
  const session = await auth();
  
  // Fetch stats (combined from HEAD and my Update)
  const [adminCount, totalUsers, totalPermissions, totalPendingApprovals] = await Promise.all([
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.user.count(),
    prisma.adminPermission.count(),
    prisma.approvalRequest.count({ where: { status: "PENDING" } }),
  ]);
  
  return (
    <div className="space-y-6 md:space-y-8 p-4 md:p-0">
      <div>
        <h1 className="text-2xl md:text-3xl font-heading text-accent dark:text-university-gold mb-2">
          Superadmin Dashboard
        </h1>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
          Welcome back, {session?.user?.name}. System oversight and administrative control.
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-slate-500 mt-1">All registered accounts</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Admin Accounts</CardTitle>
            <Lock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminCount}</div>
            <p className="text-xs text-slate-500 mt-1">Active administrators</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Pending Approvals</CardTitle>
            <FileCheck className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPendingApprovals}</div>
            <p className="text-xs text-slate-500 mt-1">Requests awaiting review</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">System Status</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Secure</div>
            <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Admin Management */}
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-blue-600" />
              Admin Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Create and manage admin accounts, assign roles, and configure access permissions.
            </p>
            <Link
              href="/superadmin/admins"
              className="inline-flex items-center justify-center w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-md text-sm font-medium transition-colors touch-manipulation min-h-[44px]"
            >
              Manage Admins
            </Link>
          </CardContent>
        </Card>

        {/* Audit Logs Link */}
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-indigo-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5 text-indigo-600" />
              System Audit
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Monitor system activities, track user actions, and review security logs.
            </p>
            <Link
              href="/superadmin/audit"
              className="inline-flex items-center justify-center w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-md text-sm font-medium transition-colors touch-manipulation min-h-[44px]"
            >
              View Audit Logs
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
