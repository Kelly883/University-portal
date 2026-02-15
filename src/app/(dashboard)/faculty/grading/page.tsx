import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import prisma from "@/lib/prisma";

export default async function FacultyGradingPage() {
  const session = await auth();
  
  // Get all courses taught by this faculty
  const courses = await prisma.course.findMany({
    where: { facultyId: session?.user?.id },
    include: {
      students: {
        select: { id: true, name: true, email: true }
      },
      grades: true,
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading text-accent dark:text-university-gold">Grade Submission</h1>
      
      {courses.map((course) => (
        <Card key={course.id} className="mb-6">
          <CardHeader>
            <CardTitle>{course.code} - {course.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Current Grade</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {course.students.map((student) => {
                  const grade = course.grades.find(g => g.studentId === student.id)?.grade || "N/A";
                  return (
                    <TableRow key={student.id}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell className="font-bold">{grade}</TableCell>
                      <TableCell>
                        <button className="text-university-gold hover:underline text-sm font-bold uppercase">Update</button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
