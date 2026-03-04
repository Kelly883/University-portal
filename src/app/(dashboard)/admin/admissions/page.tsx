
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function AdmissionDashboard() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  // Check Permission
  const permission = await prisma.adminPermission.findUnique({
    where: {
      adminId_permission: {
        adminId: session.user.id,
        permission: "MANAGE_ADMISSIONS",
      },
    },
  });

  if (!permission) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Access Denied</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-md">
          You do not have permission to view this page. Please contact the Superadmin to request access to Admission Management.
        </p>
      </div>
    );
  }

  // Fetch Admissions
  const admissions = await prisma.admission.findMany({
    orderBy: { submittedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Admission Applications</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>Review and manage student admission requests.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tracking ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Transcript</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admissions.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-mono text-xs">{app.trackingId}</TableCell>
                  <TableCell className="font-medium">{app.firstName} {app.lastName}</TableCell>
                  <TableCell>{app.program}</TableCell>
                  <TableCell>{app.email}</TableCell>
                  <TableCell>
                    <Badge variant={app.status === "PENDING" ? "secondary" : app.status === "APPROVED" ? "default" : "destructive"}>
                      {app.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(app.submittedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    {app.transcriptUrl ? (
                      <a href={app.transcriptUrl} download={`Transcript-${app.trackingId}`} className="text-blue-600 hover:underline text-sm">
                        Download
                      </a>
                    ) : (
                      <span className="text-slate-400 text-sm">N/A</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {admissions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No applications received yet.
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
