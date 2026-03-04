"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface Department {
  id: string;
  name: string;
  acronym: string;
  faculty: {
    id: string;
    name: string;
    acronym: string;
  };
}

interface Faculty {
  id: string;
  name: string;
  acronym: string;
}

export function DepartmentManagement() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", acronym: "", facultyId: "" });
  const [expandedFaculties, setExpandedFaculties] = useState<string[]>([]);
  const { toast } = useToast();

  const toggleFaculty = (facultyId: string) => {
    setExpandedFaculties(prev => 
      prev.includes(facultyId) 
        ? prev.filter(id => id !== facultyId)
        : [...prev, facultyId]
    );
  };

  const fetchData = async () => {
    try {
      const [deptRes, facRes] = await Promise.all([
        fetch("/api/superadmin/departments"),
        fetch("/api/superadmin/faculties"),
      ]);
      
      if (deptRes.ok && facRes.ok) {
        const deptData = await deptRes.json();
        const facData = await facRes.json();
        setDepartments(deptData);
        setFaculties(facData);
      }
    } catch (error) {
      console.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!formData.name || !formData.acronym || !formData.facultyId) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }

    try {
      const res = await fetch("/api/superadmin/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      toast({ title: "Success", description: "Department created successfully" });
      setIsCreateOpen(false);
      setFormData({ name: "", acronym: "", facultyId: "" });
      fetchData();
      // Ensure the newly added department's faculty is expanded
      if (!expandedFaculties.includes(formData.facultyId)) {
        setExpandedFaculties(prev => [...prev, formData.facultyId]);
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This action cannot be undone.")) return;

    try {
      const res = await fetch(`/api/superadmin/departments/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      toast({ title: "Success", description: "Department deleted" });
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <p className="text-muted-foreground">Loading academic structure...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Departments</h2>
          <p className="text-sm text-muted-foreground">
            Manage departments grouped by faculty.
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Department
        </Button>
      </div>

      <div className="grid gap-6">
        {faculties.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/10">
            <h3 className="text-lg font-semibold mb-2">No Faculties Found</h3>
            <p className="text-muted-foreground mb-4">You need to create faculties before adding departments.</p>
            {/* Could link to Faculty tab if possible, or just inform user */}
          </div>
        ) : (
          faculties.map((faculty) => {
            const facultyDepartments = departments.filter(d => d.faculty.id === faculty.id);
            const isExpanded = expandedFaculties.includes(faculty.id);

            return (
              <div key={faculty.id} className="border rounded-lg bg-card text-card-foreground shadow-sm overflow-hidden">
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => toggleFaculty(faculty.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                      {faculty.acronym}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{faculty.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {facultyDepartments.length} {facultyDepartments.length === 1 ? 'Department' : 'Departments'}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <span className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </Button>
                </div>

                {isExpanded && (
                  <div className="border-t bg-muted/5 p-4 animate-in slide-in-from-top-2 duration-200">
                    {facultyDepartments.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground italic">
                        No departments assigned to this faculty yet.
                        <Button 
                          variant="link" 
                          className="pl-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData({ ...formData, facultyId: faculty.id });
                            setIsCreateOpen(true);
                          }}
                        >
                          Add one now
                        </Button>
                      </div>
                    ) : (
                      <div className="rounded-md border bg-white overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Acronym</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {facultyDepartments.map((dept) => (
                              <TableRow key={dept.id}>
                                <TableCell className="font-medium">{dept.name}</TableCell>
                                <TableCell>{dept.acronym}</TableCell>
                                <TableCell className="text-right">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(dept.id);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Department</DialogTitle>
            <DialogDescription>
              Add a new department associated with a faculty.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="faculty">Faculty</Label>
              <Select 
                onValueChange={(val) => setFormData({ ...formData, facultyId: val })}
                value={formData.facultyId} // Ensure value is controlled
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Faculty" />
                </SelectTrigger>
                <SelectContent>
                  {faculties.map((fac) => (
                    <SelectItem key={fac.id} value={fac.id}>
                      {fac.name} ({fac.acronym})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Department Name</Label>
              <Input
                id="name"
                placeholder="e.g. Computer Science"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="acronym">Acronym</Label>
              <Input
                id="acronym"
                placeholder="e.g. CSC"
                value={formData.acronym}
                onChange={(e) => setFormData({ ...formData, acronym: e.target.value.toUpperCase() })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreate} className="text-white">Create Department</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
