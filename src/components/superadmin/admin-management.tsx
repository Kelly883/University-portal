"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PERMISSIONS, Permission } from "@/lib/permissions";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  permissions: string[];
  lastLogin?: string;
  createdAt: string;
}

export function AdminManagement() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const { toast } = useToast();

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    permissions: [] as string[],
  });

  const fetchAdmins = async () => {
    try {
      const res = await fetch("/api/superadmin/admins");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setAdmins(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load admins",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreate = async () => {
    try {
      const res = await fetch("/api/superadmin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      toast({ title: "Success", description: "Admin created successfully" });
      setIsCreateOpen(false);
      setFormData({ name: "", email: "", password: "", permissions: [] });
      fetchAdmins();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async () => {
    if (!selectedAdmin) return;
    try {
      const res = await fetch(`/api/superadmin/admins/${selectedAdmin.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          permissions: formData.permissions,
          isActive: selectedAdmin.isActive, // Toggle logic can be separate
        }),
      });

      if (!res.ok) throw new Error("Failed to update");

      toast({ title: "Success", description: "Admin updated successfully" });
      setIsEditOpen(false);
      setSelectedAdmin(null);
      fetchAdmins();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const togglePermission = (permId: string) => {
    setFormData((prev) => {
      const perms = prev.permissions.includes(permId)
        ? prev.permissions.filter((p) => p !== permId)
        : [...prev.permissions, permId];
      return { ...prev, permissions: perms };
    });
  };

  const openEdit = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      password: "", // Don't show password
      permissions: admin.permissions,
    });
    setIsEditOpen(true);
  };

  const toggleStatus = async (admin: AdminUser) => {
    try {
      const res = await fetch(`/api/superadmin/admins/${admin.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !admin.isActive }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      fetchAdmins();
      toast({ title: "Success", description: "Status updated" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  if (loading) return <Loader2 className="animate-spin" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Admin Management</h2>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Admin
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell className="font-medium">{admin.name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>
                  <Badge variant={admin.isActive ? "default" : "destructive"} onClick={() => toggleStatus(admin)} className="cursor-pointer">
                    {admin.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {admin.permissions.length > 0 ? (
                      admin.permissions.slice(0, 3).map((p) => (
                        <Badge key={p} variant="outline" className="text-xs">
                          {PERMISSIONS.find((perm) => perm.id === p)?.label || p}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-xs">None</span>
                    )}
                    {admin.permissions.length > 3 && (
                      <Badge variant="outline" className="text-xs">+{admin.permissions.length - 3}</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(admin)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Admin</DialogTitle>
            <DialogDescription>
              Add a new administrator and assign permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 gap-2 border p-4 rounded-md h-60 overflow-y-auto">
                {PERMISSIONS.map((perm) => (
                  <div key={perm.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`create-${perm.id}`}
                      checked={formData.permissions.includes(perm.id)}
                      onCheckedChange={() => togglePermission(perm.id)}
                    />
                    <Label htmlFor={`create-${perm.id}`} className="text-sm font-normal cursor-pointer">
                      {perm.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreate}>Create Admin</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Admin Permissions</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
             <div className="space-y-2">
              <Label>Permissions for {selectedAdmin?.name}</Label>
              <div className="grid grid-cols-2 gap-2 border p-4 rounded-md h-60 overflow-y-auto">
                {PERMISSIONS.map((perm) => (
                  <div key={perm.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-${perm.id}`}
                      checked={formData.permissions.includes(perm.id)}
                      onCheckedChange={() => togglePermission(perm.id)}
                    />
                    <Label htmlFor={`edit-${perm.id}`} className="text-sm font-normal cursor-pointer">
                      {perm.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
