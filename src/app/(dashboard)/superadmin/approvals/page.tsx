'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, AlertCircle } from "lucide-react";

interface ApprovalRequest {
  id: string;
  type: string;
  status: string;
  createdBy: {
    name: string;
    email: string;
  };
  data: string;
  createdAt: string;
  rejectionReason?: string;
}

const APPROVAL_TYPE_LABELS: Record<string, string> = {
  COURSE_CREATE: 'Create Course',
  COURSE_EDIT: 'Edit Course',
  COURSE_DELETE: 'Delete Course',
  STUDENT_REGISTER: 'Register Student',
  STUDENT_REMOVE: 'Remove Student',
  FEES_CREATE: 'Create Fees',
  FEES_EDIT: 'Edit Fees',
  FEES_DELETE: 'Delete Fees',
};

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [filter, setFilter] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'>('PENDING');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadApprovals();
  }, [filter]);

  const loadApprovals = async () => {
    setIsLoading(true);
    try {
      const query = filter === 'ALL' ? '' : `?status=${filter}`;
      const response = await fetch(`/api/superadmin/approvals${query}`);
      const data = await response.json();
      if (response.ok) {
        setApprovals(data.approvals);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load approvals' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setIsProcessing(id);
    setMessage(null);

    try {
      const response = await fetch('/api/superadmin/approve-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to approve');
      }

      setMessage({ type: 'success', text: 'Request approved successfully' });
      loadApprovals();
      setSelectedRequest(null);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'An error occurred',
      });
    } finally {
      setIsProcessing(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectionReason.trim()) {
      setMessage({ type: 'error', text: 'Please provide a rejection reason' });
      return;
    }

    setIsProcessing(id);
    setMessage(null);

    try {
      const response = await fetch('/api/superadmin/reject-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: id, reason: rejectionReason }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reject');
      }

      setMessage({ type: 'success', text: 'Request rejected successfully' });
      loadApprovals();
      setSelectedRequest(null);
      setRejectionReason('');
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'An error occurred',
      });
    } finally {
      setIsProcessing(null);
    }
  };

  const pendingCount = approvals.filter(a => a.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading text-accent dark:text-university-gold mb-2">
          Approval Workflows
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Review and approve admin actions before they become visible
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
        {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
              filter === status
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {status}
            {status === 'PENDING' && pendingCount > 0 && (
              <span className="ml-2 px-2 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {message && (
        <div
          className={`px-4 py-3 rounded border ${
            message.type === 'success'
              ? 'bg-green-100 border-green-400 text-green-700'
              : 'bg-red-100 border-red-400 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Approval Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>{filter} Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : approvals.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No {filter.toLowerCase()} requests found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvals.map((approval) => (
                  <TableRow key={approval.id}>
                    <TableCell className="font-medium">
                      {APPROVAL_TYPE_LABELS[approval.type] || approval.type}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{approval.createdBy.name}</div>
                        <div className="text-xs text-slate-500">{approval.createdBy.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(approval.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          approval.status === 'PENDING'
                            ? 'bg-orange-100 text-orange-800'
                            : approval.status === 'APPROVED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {approval.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => setSelectedRequest(approval)}
                        className="text-blue-600 hover:underline text-sm font-medium"
                      >
                        View Details
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-start">
                <CardTitle>
                  {APPROVAL_TYPE_LABELS[selectedRequest.type] || selectedRequest.type}
                </CardTitle>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <X size={24} />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded space-y-2">
                <div>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Admin:</span>
                  <div>{selectedRequest.createdBy.name} ({selectedRequest.createdBy.email})</div>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Submitted:</span>
                  <div>{new Date(selectedRequest.createdAt).toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Status:</span>
                  <div>{selectedRequest.status}</div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Request Details:</h3>
                <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded text-sm overflow-auto max-h-64">
                  {JSON.stringify(JSON.parse(selectedRequest.data), null, 2)}
                </pre>
              </div>

              {selectedRequest.status === 'REJECTED' && selectedRequest.rejectionReason && (
                <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-4 rounded">
                  <div className="flex gap-2">
                    <AlertCircle className="text-red-600 flex-shrink-0" size={18} />
                    <div>
                      <h4 className="font-medium text-red-900 dark:text-red-100">Rejection Reason:</h4>
                      <p className="text-red-800 dark:text-red-200 text-sm mt-1">
                        {selectedRequest.rejectionReason}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedRequest.status === 'PENDING' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Rejection Reason (if rejecting):
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Explain why this request is being rejected (optional)"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(selectedRequest.id)}
                      disabled={isProcessing === selectedRequest.id}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white px-4 py-2 rounded-md font-medium transition-colors"
                    >
                      <Check size={18} />
                      {isProcessing === selectedRequest.id ? 'Processing...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleReject(selectedRequest.id)}
                      disabled={isProcessing === selectedRequest.id || !rejectionReason.trim()}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white px-4 py-2 rounded-md font-medium transition-colors"
                    >
                      <X size={18} />
                      {isProcessing === selectedRequest.id ? 'Processing...' : 'Reject'}
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedRequest(null)}
                className="w-full bg-slate-300 hover:bg-slate-400 text-slate-900 px-4 py-2 rounded-md font-medium transition-colors"
              >
                Close
              </button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
