import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";

export const dynamic = 'force-dynamic';

export default async function StudentProfilePage() {
  const session = await auth();
  
  if (!session?.user?.id || !session.user.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      _count: {
        select: { courses: true }
      }
    }
  });

  if (!user) redirect("/login");

  // Try to fetch admission details for extra info
  const admission = user.email ? await prisma.admission.findFirst({
    where: { 
      email: user.email,
      status: 'APPROVED'
    },
    orderBy: { updatedAt: 'desc' }
  }) : null;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-heading font-bold text-titan-blue dark:text-white uppercase tracking-tight">
          My Profile
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          View and manage your personal information.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden text-center p-8">
            <div className="relative w-32 h-32 mx-auto mb-6">
              {user.image ? (
                <Image 
                  src={user.image} 
                  alt={user.name || "Profile"} 
                  fill
                  className="rounded-full object-cover border-4 border-slate-100 dark:border-slate-700"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                  <span className="material-symbols-outlined text-6xl">person</span>
                </div>
              )}
              <button className="absolute bottom-0 right-0 bg-titan-blue text-white p-2 rounded-full hover:bg-titan-gold transition-colors shadow-lg" title="Change Photo">
                <span className="material-symbols-outlined text-sm">edit</span>
              </button>
            </div>
            
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{user.name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{user.email}</p>
            
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Active Student
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700 grid grid-cols-2 gap-4">
              <div>
                <span className="block text-2xl font-bold text-slate-900 dark:text-white">{user._count.courses}</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider">Courses</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-slate-900 dark:text-white">
                  {new Date(user.createdAt).getFullYear()}
                </span>
                <span className="text-xs text-slate-500 uppercase tracking-wider">Year</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">Personal Information</h3>
              <button className="text-sm text-titan-blue hover:underline" disabled title="Contact admin to update">
                Request Update
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                <p className="text-slate-900 dark:text-white font-medium">{user.name}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Matriculation Number</label>
                <p className="text-slate-900 dark:text-white font-medium font-mono">{user.matricNo || "Not Assigned"}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                <p className="text-slate-900 dark:text-white font-medium">{user.email}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Phone Number</label>
                <p className="text-slate-900 dark:text-white font-medium">{admission?.phone || "N/A"}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Date of Birth</label>
                <p className="text-slate-900 dark:text-white font-medium">
                  {admission?.dateOfBirth ? new Date(admission.dateOfBirth).toLocaleDateString() : "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Gender</label>
                <p className="text-slate-900 dark:text-white font-medium capitalize">{admission?.gender || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">Academic Details</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Program</label>
                <p className="text-slate-900 dark:text-white font-medium">{admission?.program || "N/A"}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Department</label>
                <p className="text-slate-900 dark:text-white font-medium">{admission?.program?.split(' ')[0] || "General"}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Address</label>
                <p className="text-slate-900 dark:text-white font-medium">
                  {admission ? `${admission.address}, ${admission.state}, ${admission.country}` : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">Emergency Contact</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Name</label>
                <p className="text-slate-900 dark:text-white font-medium">{admission?.emergencyContactName || "N/A"}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Relationship</label>
                <p className="text-slate-900 dark:text-white font-medium">{admission?.emergencyContactRelation || "N/A"}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Phone</label>
                <p className="text-slate-900 dark:text-white font-medium">{admission?.emergencyContactPhone || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
