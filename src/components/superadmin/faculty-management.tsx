"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Edit } from "lucide-react";

interface Faculty {
  id: string;
  name: string;
  acronym: string;
  _count: {
    departments: number;
  };
}

export function FacultyManagement() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", acronym: "" });
  const { toast } = useToast();

  const fetchFaculties = async () => {
    try {
      const res = await fetch("/api/superadmin/faculties");
      if (res.ok) {
        const data = await res.json();
        setFaculties(data);
      }
    } catch (error) {
      console.error("Failed to fetch faculties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  const handleCreate = async () => {
    if (!formData.name || !formData.acronym) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }

    try {
      const res = await fetch("/api/superadmin/faculties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      toast({ title: "Success", description: "Faculty created successfully" });
      setIsCreateOpen(false);
      setFormData({ name: "", acronym: "" });
      fetchFaculties();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will delete all associated departments.")) return;

    try {
      const res = await fetch(`/api/superadmin/faculties/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      toast({ title: "Success", description: "Faculty deleted" });
      fetchFaculties();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  if (loading) return <Loader2 className="animate-spin" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Faculties</h2>
        <Button onClick={() => setIsCreateOpen(true)} className="text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Faculty
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Acronym</TableHead>
              <TableHead>Departments</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faculties.map((faculty) => (
              <TableRow key={faculty.id}>
                <TableCell className="font-medium">{faculty.name}</TableCell>
                <TableCell>{faculty.acronym}</TableCell>
                <TableCell>{faculty._count.departments}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(faculty.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {faculties.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No faculties found. Create one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Faculty</DialogTitle>
            <DialogDescription>
              Add a new faculty to the university.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Faculty Name</Label>
              <Input
                id="name"
                placeholder="e.g. Faculty of Science"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="acronym">Acronym</Label>
              <Input
                id="acronym"
                placeholder="e.g. SCI"
                value={formData.acronym}
                onChange={(e) => setFormData({ ...formData, acronym: e.target.value.toUpperCase() })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreate} className="text-white">Create Faculty</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
