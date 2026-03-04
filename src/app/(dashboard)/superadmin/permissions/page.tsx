
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { toggleAdmissionPermission } from "@/actions/permissions";
import { PermissionToggle } from "@/components/superadmin/permission-toggle";

export default async function PermissionsPage() {
  const session = await auth();
  if (session?.user?.role !== "SUPERADMIN") redirect("/");

  // Fetch all Admins
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    include: {
      assignedPermissions: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Admin Permissions</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Access Control</CardTitle>
          <CardDescription>Grant or revoke specific permissions for administrators.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-center">Manage Admissions</TableHead>
                <TableHead className="text-center">View Dashboard</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => {
                const hasAdmissionAccess = admin.assignedPermissions.some(
                  (p) => p.permission === "MANAGE_ADMISSIONS"
                );
                 const hasDashboardAccess = admin.assignedPermissions.some(
                  (p) => p.permission === "VIEW_ADMISSION_DASHBOARD"
                );

                return (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">{admin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell className="text-center">
                      <PermissionToggle 
                        adminId={admin.id} 
                        initialState={hasAdmissionAccess} 
                        permission="MANAGE_ADMISSIONS"
                      />
                    </TableCell>
                     <TableCell className="text-center">
                      <PermissionToggle 
                        adminId={admin.id} 
                        initialState={hasDashboardAccess} 
                        permission="VIEW_ADMISSION_DASHBOARD"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
              {admins.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No administrators found. Create an admin first.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
