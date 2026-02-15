import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import prisma from "@/lib/prisma";

export default async function FacultyCoursesPage() {
  const session = await auth();
  const courses = await prisma.course.findMany({
    where: { facultyId: session?.user?.id },
    include: { _count: { select: { students: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading text-accent dark:text-university-gold">My Courses</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.code}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold mb-2">{course.name}</p>
              <p className="text-sm text-slate-500">Enrolled Students: {course._count.students}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
