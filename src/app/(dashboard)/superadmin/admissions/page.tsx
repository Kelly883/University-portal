import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdmissionsTable from "@/components/superadmin/admissions-table";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function SuperAdminAdmissionsPage({
  searchParams,
}: {
  searchParams: { status?: string; search?: string };
}) {
  const session = await auth();

  if (session?.user?.role !== "SUPERADMIN") {
    redirect("/login");
  }

  const status = searchParams.status?.toUpperCase() || undefined;
  const search = searchParams.search || "";

  const whereClause: any = {};
  
  if (status && ['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
    whereClause.status = status;
  }

  if (search) {
    whereClause.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { trackingId: { contains: search, mode: 'insensitive' } },
    ];
  }

  const admissions = await prisma.admission.findMany({
    where: whereClause,
    orderBy: { submittedAt: "desc" },
    take: 50, // Pagination could be added later
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-titan-blue dark:text-white uppercase tracking-tight">
            Admission Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Review and manage student applications.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 justify-between items-center">
        <form className="flex-grow flex gap-2 w-full md:w-auto">
          <input 
            name="search" 
            placeholder="Search by name, email, or tracking ID..." 
            className="flex-grow px-4 py-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue={search}
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Search
          </button>
        </form>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
           <Link href="/superadmin/admissions" className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${!status ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}>All</Link>
           <Link href="/superadmin/admissions?status=pending" className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}>Pending</Link>
           <Link href="/superadmin/admissions?status=approved" className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${status === 'APPROVED' ? 'bg-green-100 text-green-800 border border-green-200' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}>Approved</Link>
           <Link href="/superadmin/admissions?status=rejected" className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${status === 'REJECTED' ? 'bg-red-100 text-red-800 border border-red-200' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}>Rejected</Link>
        </div>
      </div>

      <AdmissionsTable admissions={admissions} />
    </div>
  );
}
