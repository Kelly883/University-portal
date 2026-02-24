import { auth } from "@/auth";
import { DepartmentManagement } from "@/components/superadmin/department-management";
import { redirect } from "next/navigation";

export default async function DepartmentsPage() {
  const session = await auth();
  if (session?.user?.role !== "SUPERADMIN") redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Departments</h1>
        <p className="text-muted-foreground">
          Create departments and assign them to faculties.
        </p>
      </div>
      <DepartmentManagement />
    </div>
  );
}
