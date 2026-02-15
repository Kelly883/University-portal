import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import prisma from "@/lib/prisma";

export default async function StudentGradesPage() {
  const session = await auth();
  
  const grades = await prisma.grade.findMany({
    where: { studentId: session?.user?.id },
    include: {
      course: { select: { code: true, name: true } }
    }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading text-accent dark:text-university-gold">Academic Record</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>My Grades</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Code</TableHead>
                <TableHead>Course Name</TableHead>
                <TableHead>Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell className="font-bold">{grade.course.code}</TableCell>
                  <TableCell>{grade.course.name}</TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded font-bold ${
                      grade.grade.startsWith('A') ? 'bg-green-100 text-green-800' :
                      grade.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                      grade.grade.startsWith('C') ? 'bg-yellow-100 text-yellow-800' :
                      grade.grade.startsWith('F') ? 'bg-red-100 text-red-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {grade.grade}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {grades.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-slate-500">
                    No grades recorded yet.
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
