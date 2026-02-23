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

export default function CreateCourseForm({ facultyList }: { facultyList: any[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("single");
  
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    department: "",
    level: "",
    price: "",
    facultyId: "",
    description: "", // Schema doesn't have description yet but good for UI
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price) || 0,
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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-slate-50/95 dark:bg-[#0D1117]/95 backdrop-blur z-10 py-4 -mx-8 px-8 border-b border-slate-200 dark:border-slate-800">
        <div>
          <nav className="flex text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
            <Link href="/admin" className="hover:text-primary transition-colors">Dashboard</Link>
            <span className="mx-2">/</span>
            <Link href="/admin/courses" className="hover:text-primary transition-colors">Courses</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-900 dark:text-slate-100 font-semibold">Create New</span>
          </nav>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-heading">Create New Course</h2>
        </div>
        <div className="flex items-center gap-3">
           {/* Link to Superadmin (Requested Feature) */}
           <Link href="/superadmin" className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-primary px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mr-2">
             <Shield size={14} />
             <span>Superadmin Access</span>
           </Link>

          <Button variant="outline" onClick={() => router.back()} className="gap-2">
            <X size={16} /> Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Save Course
          </Button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-8">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
                <CardDescription>Enter the basic details about the course.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Course Title</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Introduction to Computer Science"
                    value={formData.name}
                    onChange={handleChange}
                    className="max-w-xl"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="code">Course Code</Label>
                    <Input
                      id="code"
                      placeholder="e.g. CS101"
                      value={formData.code}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="level">Level</Label>
                    <Select onValueChange={(val) => handleSelectChange("level", val)}>
                      <SelectTrigger>
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
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief summary of the course content..."
                    className="min-h-[120px]"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Academic Details</CardTitle>
                <CardDescription>Assign department and faculty.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="grid gap-2">
                    <Label htmlFor="department">Department</Label>
                    <Select onValueChange={(val) => handleSelectChange("department", val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Arts">Arts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="facultyId">Assigned Faculty</Label>
                    <Select onValueChange={(val) => handleSelectChange("facultyId", val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Faculty" />
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
          <div className="space-y-8">
             <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Settings & Fees</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="price">Course Fee (Optional)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-500">₦</span>
                    <Input
                      id="price"
                      type="number"
                      placeholder="0.00"
                      className="pl-8"
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
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 bg-white dark:bg-zinc-900 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
            <Upload className="text-slate-400" size={32} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Bulk Upload Courses</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-2">
              Drag and drop your CSV or Excel file here to create multiple courses at once.
            </p>
          </div>
          <Button variant="outline">Select File</Button>
        </div>
      )}
    </div>
  );
}
