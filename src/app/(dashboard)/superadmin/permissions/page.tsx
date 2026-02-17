'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from 'next/navigation';
import { Check, X } from "lucide-react";

interface AdminWithPermissions {
  id: string;
  name: string;
  email: string;
  permissions: string[];
}

const AVAILABLE_PERMISSIONS = [
  { id: 'CREATE_COURSE', label: 'Create Course', description: 'Allow creation of new courses' },
  { id: 'EDIT_COURSE', label: 'Edit Course', description: 'Allow editing existing courses' },
  { id: 'DELETE_COURSE', label: 'Delete Course', description: 'Allow deletion of courses' },
  { id: 'REGISTER_STUDENT', label: 'Register Student', description: 'Allow student enrollment' },
  { id: 'REMOVE_STUDENT', label: 'Remove Student', description: 'Allow student removal' },
  { id: 'CREATE_FEES', label: 'Create Fees', description: 'Allow fee structure creation' },
  { id: 'EDIT_FEES', label: 'Edit Fees', description: 'Allow fee modification' },
  { id: 'DELETE_FEES', label: 'Delete Fees', description: 'Allow fee deletion' },
  { id: 'MANAGE_GRADES', label: 'Manage Grades', description: 'Allow grade management' },
  { id: 'VIEW_REPORTS', label: 'View Reports', description: 'Allow report viewing' },
];

export default function PermissionsPage() {
  const searchParams = useSearchParams();
  const adminId = searchParams.get('admin');
  
  const [admins, setAdmins] = useState<AdminWithPermissions[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminWithPermissions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadAdmins();
  }, []);

  useEffect(() => {
    if (adminId && admins.length > 0) {
      const admin = admins.find(a => a.id === adminId);
      if (admin) {
        selectAdmin(admin);
      }
    }
  }, [adminId, admins]);

  const loadAdmins = async () => {
    try {
      const response = await fetch('/api/superadmin/admins');
      const data = await response.json();
      if (response.ok) {
        setAdmins(data.admins);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load admins' });
    } finally {
      setIsLoading(false);
    }
  };

  const selectAdmin = (admin: AdminWithPermissions) => {
    setSelectedAdmin(admin);
    setSelectedPermissions(new Set(admin.permissions));
    setMessage(null);
  };

  const togglePermission = (permissionId: string) => {
    const newPermissions = new Set(selectedPermissions);
    if (newPermissions.has(permissionId)) {
      newPermissions.delete(permissionId);
    } else {
      newPermissions.add(permissionId);
    }
    setSelectedPermissions(newPermissions);
  };

  const handleSavePermissions = async () => {
    if (!selectedAdmin) return;

    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/superadmin/update-permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: selectedAdmin.id,
          permissions: Array.from(selectedPermissions),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update permissions');
      }

      setMessage({ type: 'success', text: 'Permissions updated successfully' });
      loadAdmins();
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'An error occurred',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading text-accent dark:text-university-gold">
        Permission Management
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Admin List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Admins</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {admins.length === 0 ? (
                <p className="text-slate-500 text-sm">No admins found</p>
              ) : (
                admins.map((admin) => (
                  <button
                    key={admin.id}
                    onClick={() => selectAdmin(admin)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedAdmin?.id === admin.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className="font-medium text-sm">{admin.name}</div>
                    <div className="text-xs opacity-75">{admin.email}</div>
                  </button>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Permissions Grid */}
        <div className="lg:col-span-2">
          {selectedAdmin ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  Permissions for {selectedAdmin.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {AVAILABLE_PERMISSIONS.map((permission) => (
                    <label
                      key={permission.id}
                      className="flex items-start gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPermissions.has(permission.id)}
                        onChange={() => togglePermission(permission.id)}
                        className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{permission.label}</div>
                        <div className="text-xs text-slate-500">{permission.description}</div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSavePermissions}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    <Check size={18} />
                    {isSaving ? 'Saving...' : 'Save Permissions'}
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <h3 className="font-medium text-sm mb-2">Current Permissions:</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPermissions.size === 0 ? (
                      <span className="text-sm text-slate-500">No permissions granted</span>
                    ) : (
                      Array.from(selectedPermissions).map((perm) => {
                        const permLabel = AVAILABLE_PERMISSIONS.find(p => p.id === perm)?.label;
                        return (
                          <span
                            key={perm}
                            className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          >
                            {permLabel}
                          </span>
                        );
                      })
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-slate-500">
                  Select an admin to manage their permissions
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
