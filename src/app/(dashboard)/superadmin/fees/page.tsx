
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Plus, Trash2, Search, FileDown } from "lucide-react";
import { format } from "date-fns";

interface FeeStructure {
  id: string;
  name: string;
  amount: number;
  level: string;
  priority: number;
  dueDate: string | null;
  currency: string;
}

export default function FeesPage() {
  const [fees, setFees] = useState<FeeStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    level: "",
    priority: "",
    dueDate: "",
  });

  const fetchFees = async () => {
    try {
      const res = await fetch("/api/superadmin/fees");
      if (res.ok) {
        const data = await res.json();
        setFees(data);
      }
    } catch (error) {
      console.error("Failed to fetch fees", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/superadmin/fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          priority: parseInt(formData.priority),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create fee");
      }

      toast({ title: "Success", description: "Fee structure created successfully" });
      setFormData({ name: "", amount: "", level: "", priority: "", dueDate: "" });
      fetchFees();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredFees = fees.filter(fee => 
    fee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fee.level.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Fee Management</h2>
        <Button variant="outline" className="gap-2">
            <FileDown size={16} /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Fee Form */}
        <Card className="lg:col-span-1 h-fit border-none shadow-md">
          <CardHeader>
            <CardTitle>Create New Fee</CardTitle>
            <CardDescription>Define a mandatory fee for a specific level.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Fee Name</Label>
                <Input id="name" placeholder="e.g. Acceptance Fee" value={formData.name} onChange={handleChange} required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="amount">Amount (NGN)</Label>
                    <Input id="amount" type="number" placeholder="0.00" value={formData.amount} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="level">Level</Label>
                    <Select onValueChange={(val) => handleSelectChange("level", val)} value={formData.level}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="100">100 Level</SelectItem>
                            <SelectItem value="200">200 Level</SelectItem>
                            <SelectItem value="300">300 Level</SelectItem>
                            <SelectItem value="400">400 Level</SelectItem>
                            <SelectItem value="500">500 Level</SelectItem>
                            <SelectItem value="ALL">All Levels</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="priority">Priority Order</Label>
                    <Input id="priority" type="number" min="1" placeholder="e.g. 1 (First)" value={formData.priority} onChange={handleChange} required />
                    <p className="text-[10px] text-muted-foreground">1 must be paid before 2.</p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date (Optional)</Label>
                    <Input id="dueDate" type="date" value={formData.dueDate} onChange={handleChange} />
                </div>
              </div>

              <Button type="submit" className="w-full bg-titan-blue hover:bg-titan-blue/90" disabled={submitting}>
                {submitting ? <Loader2 className="animate-spin mr-2" /> : <Plus className="mr-2 h-4 w-4" />}
                Create Fee
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Fee List */}
        <Card className="lg:col-span-2 border-none shadow-md">
          <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle>Existing Fee Structures</CardTitle>
                <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search fees..." 
                        className="pl-8 h-9 w-[200px]" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Priority</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">Loading fees...</TableCell>
                    </TableRow>
                ) : filteredFees.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No fees found.</TableCell>
                    </TableRow>
                ) : (
                    filteredFees.map((fee) => (
                        <TableRow key={fee.id}>
                            <TableCell className="font-bold text-center w-16">
                                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs">{fee.priority}</span>
                            </TableCell>
                            <TableCell className="font-medium">{fee.name}</TableCell>
                            <TableCell>
                                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                    {fee.level}
                                </span>
                            </TableCell>
                            <TableCell>{fee.currency} {fee.amount.toLocaleString()}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                                {fee.dueDate ? format(new Date(fee.dueDate), "MMM d, yyyy") : "None"}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
