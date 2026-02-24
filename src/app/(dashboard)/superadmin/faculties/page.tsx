import { auth } from "@/auth";
import { FacultyManagement } from "@/components/superadmin/faculty-management";
import { DepartmentManagement } from "@/components/superadmin/department-management";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function FacultiesPage() {
  const session = await auth();
  if (session?.user?.role !== "SUPERADMIN") redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Academic Structure</h1>
        <p className="text-muted-foreground">
          Manage faculties and departments for the university.
        </p>
      </div>

      <Tabs defaultValue="faculties" className="space-y-4">
        <TabsList>
          <TabsTrigger value="faculties">Faculties</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="faculties">
          <Card>
            <CardHeader>
              <CardTitle>Faculties</CardTitle>
              <CardDescription>
                Create and manage university faculties.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FacultyManagement />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <CardTitle>Departments</CardTitle>
              <CardDescription>
                Create departments and assign them to faculties.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DepartmentManagement />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
