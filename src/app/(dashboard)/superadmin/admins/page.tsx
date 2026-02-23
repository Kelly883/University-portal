"use client";

import { AdminManagement } from "@/components/superadmin/admin-management";

export default function AdminsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Administrators</h1>
        <p className="text-muted-foreground">Create admins and assign granular permissions.</p>
      </div>
      <AdminManagement />
    </div>
  );
}
