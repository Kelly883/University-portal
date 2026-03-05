import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function StudentDashboard() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Fetch student data concurrently
  const [enrolledCourses, grades, notifications, payments] = await Promise.all([
    prisma.course.findMany({
      where: { students: { some: { id: userId } } }
    }),
    prisma.grade.findMany({
      where: { studentId: userId },
      include: { course: true }
    }),
    prisma.notification.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
      take: 3
    }),
    prisma.payment.findMany({
      where: { studentId: userId, status: 'PENDING' }
    })
  ]);

  // Calculate GPA
  let totalPoints = 0;
  let totalCredits = 0;
  let earnedCredits = 0;

  grades.forEach(g => {
    const credits = g.course.credits || 3;
    let points = 0;
    
    if (g.grade.startsWith('A')) points = 4.0;
    else if (g.grade.startsWith('B')) points = 3.0;
    else if (g.grade.startsWith('C')) points = 2.0;
    else if (g.grade.startsWith('D')) points = 1.0;
    else points = 0.0;

    totalPoints += points * credits;
    totalCredits += credits;
    
    if (!g.grade.startsWith('F')) {
      earnedCredits += credits;
    }
  });

  const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  const pendingFees = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-heading font-bold text-titan-blue dark:text-white uppercase tracking-tight">
          Welcome back, {session.user.name?.split(' ')[0]}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Here's what's happening with your academic progress today.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Current GPA</p>
              <h3 className="text-3xl font-bold text-titan-blue dark:text-white mt-1">{gpa}</h3>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-titan-blue dark:text-blue-400">
              <span className="material-symbols-outlined">analytics</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-titan-blue h-full rounded-full" style={{ width: `${(parseFloat(gpa) / 4) * 100}%` }}></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Credits Earned</p>
              <h3 className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{earnedCredits}</h3>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
              <span className="material-symbols-outlined">school</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Total from passed courses</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Enrolled Courses</p>
              <h3 className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1">{enrolledCourses.length}</h3>
            </div>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
              <span className="material-symbols-outlined">library_books</span>
            </div>
          </div>
          <Link href="/student/courses" className="text-xs font-medium text-purple-600 hover:underline flex items-center gap-1 mt-2">
            View Schedule <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Outstanding Fees</p>
              <h3 className="text-3xl font-bold text-red-500 dark:text-red-400 mt-1">
                ${pendingFees.toFixed(2)}
              </h3>
            </div>
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-500 dark:text-red-400">
              <span className="material-symbols-outlined">payments</span>
            </div>
          </div>
          {pendingFees > 0 ? (
            <Link href="/student/payments" className="text-xs font-medium text-red-500 hover:underline flex items-center gap-1 mt-2">
              Pay Now <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
            </Link>
          ) : (
            <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">check_circle</span> All clear
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Notifications */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <h2 className="font-heading font-bold text-lg text-slate-900 dark:text-white">Recent Notifications</h2>
            <Link href="/student/notifications" className="text-sm font-medium text-titan-blue hover:text-titan-gold transition-colors">
              View All
            </Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-20">notifications_off</span>
                <p>No new notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${!notification.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                  <div className="flex gap-4">
                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notification.read ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                    <div>
                      <h4 className={`text-sm font-semibold ${!notification.read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                        {notification.title}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{notification.message}</p>
                      <span className="text-xs text-slate-400 mt-2 block">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-fit">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700">
            <h2 className="font-heading font-bold text-lg text-slate-900 dark:text-white">Quick Actions</h2>
          </div>
          <div className="p-4 grid gap-3">
            <Link href="/student/course-registration" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <span className="material-symbols-outlined">add_circle</span>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Register Courses</h4>
                <p className="text-xs text-slate-500">Enroll in new classes</p>
              </div>
            </Link>
            
            <Link href="/student/grades" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:bg-green-600 group-hover:text-white transition-all">
                <span className="material-symbols-outlined">grade</span>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Check Grades</h4>
                <p className="text-xs text-slate-500">View academic performance</p>
              </div>
            </Link>

            <Link href="/student/profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white">My Profile</h4>
                <p className="text-xs text-slate-500">View personal details</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
