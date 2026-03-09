'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { approveAdmission, rejectAdmission } from '@/actions/superadmin-admission';

interface Admission {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  program: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: Date;
  trackingId: string;
}

interface Props {
  admissions: Admission[];
}

export default function AdmissionsTable({ admissions }: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const handleApprove = async (id: string) => {
    if (!confirm("Are you sure you want to approve this admission? This will create a student account.")) return;
    
    setLoadingId(id);
    try {
      const res = await approveAdmission(id);
      if (res.error) {
        alert(res.error);
      } else {
        alert(`Admission Approved! Matric No: ${res.matricNo}`);
        router.refresh();
      }
    } catch (err) {
      alert("An error occurred");
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Are you sure you want to reject this admission?")) return;
    
    setLoadingId(id);
    try {
      const res = await rejectAdmission(id);
      if (res.error) {
        alert(res.error);
      } else {
        alert("Admission Rejected");
        router.refresh();
      }
    } catch (err) {
      alert("An error occurred");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-3 font-medium">Tracking ID</th>
              <th className="px-6 py-3 font-medium">Student Name</th>
              <th className="px-6 py-3 font-medium">Program</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {admissions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  No admission requests found.
                </td>
              </tr>
            ) : (
              admissions.map((admission) => (
                <tr key={admission.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">{admission.trackingId}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 dark:text-white">
                      {admission.firstName} {admission.lastName}
                    </div>
                    <div className="text-xs text-slate-500">{admission.email}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {admission.program}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(admission.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${admission.status === 'APPROVED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                        admission.status === 'REJECTED' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                      {admission.status.toLowerCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {admission.status === 'PENDING' && (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleApprove(admission.id)}
                          disabled={loadingId === admission.id}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
                          title="Approve"
                        >
                          <span className="material-symbols-outlined text-lg">check_circle</span>
                        </button>
                        <button
                          onClick={() => handleReject(admission.id)}
                          disabled={loadingId === admission.id}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                          title="Reject"
                        >
                          <span className="material-symbols-outlined text-lg">cancel</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
