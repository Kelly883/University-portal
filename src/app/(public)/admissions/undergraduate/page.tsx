
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Loader2, Upload, CheckCircle, GraduationCap } from "lucide-react";

export default function UndergraduateAdmissionForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ trackingId: string } | null>(null);
  const [programs, setPrograms] = useState<{ id: string; name: string }[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    state: "",
    country: "",
    previousSchool: "",
    examGrades: [{ subject: "", grade: "", examNo: "" }], // Changed from previousGrade
    transcriptUrl: "", // Base64 string
    program: "",
    password: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
  });

  const WAEC_GRADES = ["A1", "B2", "B3", "C4", "C5", "C6", "D7", "E8", "F9"];

  const handleGradeChange = (index: number, field: string, value: string) => {
    const newGrades = [...formData.examGrades];
    newGrades[index] = { ...newGrades[index], [field]: value };
    setFormData({ ...formData, examGrades: newGrades });
  };

  const addGradeRow = () => {
    setFormData({
      ...formData,
      examGrades: [...formData.examGrades, { subject: "", grade: "", examNo: "" }],
    });
  };

  const removeGradeRow = (index: number) => {
    const newGrades = formData.examGrades.filter((_, i) => i !== index);
    setFormData({ ...formData, examGrades: newGrades });
  };

  useEffect(() => {
    async function fetchPrograms() {
      try {
        const res = await fetch("/api/admissions/programs");
        if (res.ok) {
          const data = await res.json();
          // Filter only undergraduate programs if we had a way to distinguish them
          // For now, we'll list all programs but could filter by 'B.Sc', 'B.A', etc.
          setPrograms(data);
        } else {
            console.error("Failed to fetch programs");
        }
      } catch (error) {
        console.error("Error fetching programs:", error);
      } finally {
        setLoadingPrograms(false);
      }
    }
    fetchPrograms();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "File too large", description: "Transcript must be under 2MB", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, transcriptUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // We can reuse the existing API route since the schema is the same
      // Or create a specific one if undergraduate logic differs significantly
      const res = await fetch("/api/admissions/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth : undefined,
          previousGrade: JSON.stringify(formData.examGrades), // Serialize grades array to string for storage
          admissionType: "UNDERGRADUATE" 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSuccess({ trackingId: data.trackingId });
      toast({ title: "Application Submitted", description: "Check your email for confirmation." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg border-none shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-blue-700">Undergraduate Application Received!</CardTitle>
            <CardDescription>Your application has been successfully submitted to the Undergraduate Admissions Office.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="bg-slate-100 p-4 rounded-lg">
              <p className="text-sm text-slate-500 mb-1">Your Tracking ID</p>
              <p className="text-2xl font-mono font-bold text-slate-800 tracking-wider">{success.trackingId}</p>
            </div>
            <p className="text-slate-600">
              Please keep this ID safe. You can use it to check your admission status later.
              A confirmation email has been sent to your inbox.
            </p>
            <Button onClick={() => window.location.reload()} className="w-full bg-blue-600 hover:bg-blue-700">
              Submit Another Application
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
            <GraduationCap className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 font-heading">Undergraduate Admission</h1>
          <p className="mt-2 text-slate-600 max-w-2xl mx-auto">
            Begin your academic journey at Titan University. Please complete the form below to apply for our undergraduate programs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar Info */}
            <div className="hidden lg:block space-y-6">
                <Card className="border-none shadow-sm bg-blue-600 text-white">
                    <CardHeader>
                        <CardTitle className="text-xl">Why Titan?</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-3">
                            <span className="material-symbols-outlined bg-white/20 p-2 rounded-full h-fit">school</span>
                            <div>
                                <h4 className="font-bold">World-Class Faculty</h4>
                                <p className="text-sm text-blue-100">Learn from industry experts and renowned researchers.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <span className="material-symbols-outlined bg-white/20 p-2 rounded-full h-fit">groups</span>
                            <div>
                                <h4 className="font-bold">Vibrant Community</h4>
                                <p className="text-sm text-blue-100">Join a diverse community of learners from around the globe.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <span className="material-symbols-outlined bg-white/20 p-2 rounded-full h-fit">rocket_launch</span>
                            <div>
                                <h4 className="font-bold">Innovation Hub</h4>
                                <p className="text-sm text-blue-100">Access state-of-the-art labs and research facilities.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Application Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                            <li>High School Diploma or equivalent</li>
                            <li>Official Transcripts</li>
                            <li>Personal Statement</li>
                            <li>Letter of Recommendation (Optional)</li>
                            <li>Application Fee (Waived)</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* Main Form */}
            <div className="lg:col-span-2">
                <Card className="border-none shadow-lg">
                <CardHeader>
                    <CardTitle>Application Details</CardTitle>
                    <CardDescription>Please fill in all required fields accurately.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-600">person</span> Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" value={formData.firstName} onChange={handleChange} required placeholder="e.g. John" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" value={formData.lastName} onChange={handleChange} required placeholder="e.g. Doe" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" value={formData.email} onChange={handleChange} required placeholder="john.doe@example.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} required placeholder="+1 (555) 000-0000" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">Date of Birth</Label>
                            <Input id="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select onValueChange={(val) => handleSelectChange("gender", val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                            </Select>
                        </div>
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="address">Residential Address</Label>
                        <Textarea id="address" value={formData.address} onChange={handleChange} required placeholder="123 University Ave, Apt 4B" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="state">State/Province</Label>
                            <Input id="state" value={formData.state} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input id="country" value={formData.country} onChange={handleChange} required />
                        </div>
                        </div>
                    </div>

                    {/* Academic History */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-600">school</span> Academic History
                        </h3>
                        <div className="space-y-2">
                            <Label htmlFor="previousSchool">High School Name</Label>
                            <Input id="previousSchool" value={formData.previousSchool} onChange={handleChange} required placeholder="e.g. Central High School" />
                        </div>
                        
                        <div className="space-y-3">
                            <Label>Examination Grades (WAEC/NECO/SSCE)</Label>
                            {formData.examGrades.map((grade, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2 items-end bg-slate-50 p-2 rounded-md">
                                    <div className="col-span-4">
                                        <Label className="text-xs text-slate-500 mb-1 block">Subject</Label>
                                        <Input 
                                            placeholder="Subject" 
                                            value={grade.subject} 
                                            onChange={(e) => handleGradeChange(index, "subject", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <Label className="text-xs text-slate-500 mb-1 block">Grade</Label>
                                        <Select value={grade.grade} onValueChange={(val) => handleGradeChange(index, "grade", val)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Grade" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {WAEC_GRADES.map((g) => (
                                                    <SelectItem key={g} value={g}>{g}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="col-span-4">
                                        <Label className="text-xs text-slate-500 mb-1 block">Exam No</Label>
                                        <Input 
                                            placeholder="Exam Reg No" 
                                            value={grade.examNo} 
                                            onChange={(e) => handleGradeChange(index, "examNo", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        {formData.examGrades.length > 1 && (
                                            <Button 
                                                type="button" 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => removeGradeRow(index)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <span className="material-symbols-outlined">delete</span>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={addGradeRow} className="w-full text-blue-600 border-blue-200 hover:bg-blue-50">
                                <span className="material-symbols-outlined mr-2">add</span> Add Subject
                            </Button>
                        </div>

                        <div className="space-y-2 mt-4">
                        <Label htmlFor="transcript">Upload O'Level Result (PDF/Image, Max 2MB)</Label>
                        <div className="flex items-center gap-4 border border-dashed border-slate-300 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                            <Input id="transcript" type="file" accept=".pdf,.jpg,.png,.jpeg" onChange={handleFileChange} className="cursor-pointer border-none bg-transparent shadow-none p-0 h-auto" />
                            {formData.transcriptUrl && <CheckCircle className="text-green-500 w-6 h-6 flex-shrink-0" />}
                        </div>
                        </div>
                    </div>

                    {/* Program Selection */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-600">bookmark</span> Program Selection & Account
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                        <Label htmlFor="program">Intended Undergraduate Program</Label>
                        <Select onValueChange={(val) => handleSelectChange("program", val)}>
                            <SelectTrigger disabled={loadingPrograms}>
                            <SelectValue placeholder={loadingPrograms ? "Loading programs..." : "Select Program"} />
                            </SelectTrigger>
                            <SelectContent>
                            {programs.length > 0 ? (
                                programs.map((prog) => (
                                <SelectItem key={prog.id} value={prog.name}>
                                    {prog.name}
                                </SelectItem>
                                ))
                            ) : (
                                <SelectItem value="none" disabled>
                                No programs available
                                </SelectItem>
                            )}
                            </SelectContent>
                        </Select>
                        </div>
                        <div className="space-y-2 relative">
                            <Label htmlFor="password">Create Password</Label>
                            <div className="relative">
                            <Input 
                                id="password" 
                                type={showPassword ? "text" : "password"} 
                                value={formData.password} 
                                onChange={handleChange} 
                                required 
                                placeholder="Min 8 chars, 1 uppercase, 1 number"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? (
                                <span className="material-symbols-outlined text-sm">visibility_off</span>
                                ) : (
                                <span className="material-symbols-outlined text-sm">visibility</span>
                                )}
                            </button>
                            </div>
                        </div>
                        </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-600">contact_emergency</span> Emergency Contact
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="emergencyContactName">Contact Name</Label>
                            <Input id="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
                            <Input id="emergencyContactPhone" type="tel" value={formData.emergencyContactPhone} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="emergencyContactRelation">Relationship</Label>
                            <Input id="emergencyContactRelation" value={formData.emergencyContactRelation} onChange={handleChange} required placeholder="e.g. Parent" />
                        </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-12 text-lg bg-titan-blue hover:bg-titan-blue/90" disabled={loading}>
                        {loading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...
                        </>
                        ) : (
                        "Submit Undergraduate Application"
                        )}
                    </Button>
                    </form>
                </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
