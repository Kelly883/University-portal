import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function StudentCoursesPage() {
  const session = await auth();
  
  // Find courses where the student is enrolled
  const courses = await prisma.course.findMany({
    where: {
      students: {
        some: { id: session?.user?.id }
      }
    },
    include: { faculty: { select: { name: true, email: true } } }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading text-accent dark:text-university-gold">My Enrolled Courses</h1>
      
      {courses.length === 0 ? (
        <p className="text-slate-500">You are not enrolled in any courses yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle>{course.code}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold mb-2">{course.name}</p>
                <p className="text-sm text-slate-500">Instructor: {course.faculty.name || course.faculty.email}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
