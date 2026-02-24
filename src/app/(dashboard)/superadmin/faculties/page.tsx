import { auth } from "@/auth";
import { FacultyManagement } from "@/components/superadmin/faculty-management";
import { redirect } from "next/navigation";

export default async function FacultiesPage() {
  const session = await auth();
  if (session?.user?.role !== "SUPERADMIN") redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Faculties</h1>
        <p className="text-muted-foreground">
          Create and manage university faculties.
        </p>
      </div>
      <FacultyManagement />
    </div>
  );
}
