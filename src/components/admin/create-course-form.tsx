"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, X, Upload, FileText, ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

export default function CreateCourseForm({ facultyList, faculties = [] }: { facultyList: any[], faculties?: any[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("single");
  
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    faculty: "", // This is now the selected faculty ID for department filtering
    department: "",
    level: "",
    price: "",
    facultyId: "", // This is the assigned instructor (user)
    description: "",
    credits: "3", // Default credit unit
  });

  const [availableDepartments, setAvailableDepartments] = useState<any[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (field: string, value: string) => {
    if (field === "faculty") {
      // When faculty changes, update available departments
      const selectedFaculty = faculties?.find(f => f.id === value);
      setAvailableDepartments(selectedFaculty?.departments || []);
      // Reset department selection
      setFormData(prev => ({ ...prev, [field]: value, department: "" }));
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.faculty || !formData.department) {
        toast({ title: "Error", description: "Please select both a Faculty and a Department", variant: "destructive" });
        setLoading(false);
        return;
    }

    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price) || 0,
          credits: parseInt(formData.credits) || 3,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      toast({ title: "Success", description: "Course created successfully" });
      router.push("/admin/courses");
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-0">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sticky top-0 bg-slate-50/95 dark:bg-[#0D1117]/95 backdrop-blur z-20 py-4 -mx-4 px-4 sm:-mx-8 sm:px-8 border-b border-slate-200 dark:border-slate-800 transition-all">
        <div>
          <nav className="flex flex-wrap text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
            <Link href="/admin" className="hover:text-primary transition-colors">Dashboard</Link>
            <span className="mx-2">/</span>
            <Link href="/admin/courses" className="hover:text-primary transition-colors">Courses</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-900 dark:text-slate-100 font-semibold">Create New</span>
          </nav>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-heading">Create New Course</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
           {/* Link to Superadmin (Requested Feature) */}
           <Link href="/superadmin" className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-primary px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mr-2">
             <Shield size={14} />
             <span>Superadmin Access</span>
           </Link>

          <Button variant="outline" onClick={() => router.back()} className="gap-2 h-10 sm:h-11">
            <X size={16} /> <span className="hidden sm:inline">Cancel</span>
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 h-10 sm:h-11 flex-1 sm:flex-none">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Save Course
          </Button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
        <div className="flex gap-8 min-w-max px-1">
          <button
            onClick={() => setActiveTab("single")}
            className={`pb-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === "single"
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <FileText size={20} />
            Single Course
          </button>
          <button
            onClick={() => setActiveTab("bulk")}
            className={`pb-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === "bulk"
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <Upload size={20} />
            Bulk Upload
          </button>
        </div>
      </div>

      {activeTab === "single" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <Card className="border-none shadow-md">
              <CardHeader className="px-4 sm:px-6">
                <CardTitle>Course Information</CardTitle>
                <CardDescription>Enter the basic details about the course.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 px-4 sm:px-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Course Title</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Introduction to Computer Science"
                    value={formData.name}
                    onChange={handleChange}
                    className="max-w-xl h-11 sm:h-10 text-base sm:text-sm"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="code">Course Code</Label>
                    <Input
                      id="code"
                      placeholder="e.g. CS101"
                      value={formData.code}
                      onChange={handleChange}
                      className="h-11 sm:h-10 text-base sm:text-sm"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="level">Level</Label>
                    <Select onValueChange={(val) => handleSelectChange("level", val)}>
                      <SelectTrigger className="h-11 sm:h-10 text-base sm:text-sm">
                        <SelectValue placeholder="Select Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100">100 Level</SelectItem>
                        <SelectItem value="200">200 Level</SelectItem>
                        <SelectItem value="300">300 Level</SelectItem>
                        <SelectItem value="400">400 Level</SelectItem>
                        <SelectItem value="500">500 Level</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="credits">Course Credit Units</Label>
                  <Input
                    id="credits"
                    type="number"
                    min="1"
                    max="6"
                    placeholder="e.g. 3"
                    value={formData.credits}
                    onChange={handleChange}
                    className="h-11 sm:h-10 text-base sm:text-sm"
                  />
                  <p className="text-xs text-muted-foreground">Standard courses are typically 3 credits (Range: 1-6).</p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief summary of the course content..."
                    className="min-h-[120px] text-base sm:text-sm"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader className="px-4 sm:px-6">
                <CardTitle>Academic Details</CardTitle>
                <CardDescription>Assign department and faculty.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 px-4 sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div className="grid gap-2">
                    <Label htmlFor="faculty">Faculty (School)</Label>
                    <Select onValueChange={(val) => handleSelectChange("faculty", val)}>
                      <SelectTrigger className="h-11 sm:h-10 text-base sm:text-sm">
                        <SelectValue placeholder="Select Faculty" />
                      </SelectTrigger>
                      <SelectContent>
                        {faculties && faculties.length > 0 ? (
                          faculties.map((fac) => (
                            <SelectItem key={fac.id} value={fac.id}>
                              {fac.name} ({fac.acronym})
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no_faculties" disabled>No faculties available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                   <div className="grid gap-2">
                    <Label htmlFor="department">Department</Label>
                    <Select 
                        onValueChange={(val) => handleSelectChange("department", val)}
                        disabled={!formData.faculty || availableDepartments.length === 0}
                        value={formData.department}
                    >
                      <SelectTrigger className="h-11 sm:h-10 text-base sm:text-sm">
                        <SelectValue placeholder={!formData.faculty ? "Select Faculty first" : "Select Department"} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDepartments && availableDepartments.length > 0 ? (
                          availableDepartments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.name}>
                              {dept.name} ({dept.acronym})
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no_departments" disabled>No departments available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="facultyId">Assigned Instructor</Label>
                    <Select onValueChange={(val) => handleSelectChange("facultyId", val)}>
                      <SelectTrigger className="h-11 sm:h-10 text-base sm:text-sm">
                        <SelectValue placeholder="Select Instructor" />
                      </SelectTrigger>
                      <SelectContent>
                        {facultyList.map((f) => (
                          <SelectItem key={f.id} value={f.id}>{f.name} ({f.email})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6 sm:space-y-8">
             <Card className="border-none shadow-md">
              <CardHeader className="px-4 sm:px-6">
                <CardTitle>Settings & Fees</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 px-4 sm:px-6">
                <div className="grid gap-2">
                  <Label htmlFor="price">Course Fee (Optional)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 sm:top-2.5 text-slate-500">₦</span>
                    <Input
                      id="price"
                      type="number"
                      placeholder="0.00"
                      className="pl-8 h-11 sm:h-10 text-base sm:text-sm"
                      value={formData.price}
                      onChange={handleChange}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Leave 0 if covered by department fees.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 bg-white dark:bg-zinc-900 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 mx-4 sm:mx-0">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
            <Upload className="text-slate-400" size={32} />
          </div>
          <div className="px-4">
            <h3 className="text-lg font-semibold">Bulk Upload Courses</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-2">
              Drag and drop your CSV or Excel file here to create multiple courses at once.
            </p>
          </div>
          <Button variant="outline" className="h-11 sm:h-10">Select File</Button>
        </div>
      )}
    </div>
  );
}
