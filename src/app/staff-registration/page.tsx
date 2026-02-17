'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader } from 'lucide-react';

interface Faculty {
  id: string;
  name: string;
  acronym: string;
}

interface Department {
  id: string;
  name: string;
  acronym: string;
}

export default function StaffRegistrationPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    state: '',
    facultyId: '',
    departmentId: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [staffId, setStaffId] = useState('');
  const [isLoadingFaculties, setIsLoadingFaculties] = useState(true);
  const [isLoadingDepts, setIsLoadingDepts] = useState(false);
  const [isGeneratingId, setIsGeneratingId] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load faculties on mount
  useEffect(() => {
    loadFaculties();
  }, []);

  // Generate staff ID when date of birth, faculty, or department changes
  useEffect(() => {
    if (formData.dateOfBirth && formData.facultyId && formData.departmentId) {
      generateStaffId();
    }
  }, [formData.dateOfBirth, formData.facultyId, formData.departmentId]);

  // Load departments when faculty changes
  useEffect(() => {
    if (formData.facultyId) {
      loadDepartments(formData.facultyId);
    } else {
      setDepartments([]);
      setFormData((prev) => ({ ...prev, departmentId: '' }));
    }
  }, [formData.facultyId]);

  const loadFaculties = async () => {
    try {
      setIsLoadingFaculties(true);
      const response = await fetch('/api/staff-registration/faculties');
      const data = await response.json();
      if (response.ok) {
        setFaculties(data.faculties);
      } else {
        setError('Failed to load faculties');
      }
    } catch (err) {
      setError('Error loading faculties');
    } finally {
      setIsLoadingFaculties(false);
    }
  };

  const loadDepartments = async (facultyId: string) => {
    try {
      setIsLoadingDepts(true);
      const response = await fetch(`/api/staff-registration/departments?facultyId=${facultyId}`);
      const data = await response.json();
      if (response.ok) {
        setDepartments(data.departments);
      } else {
        setError('Failed to load departments');
      }
    } catch (err) {
      setError('Error loading departments');
    } finally {
      setIsLoadingDepts(false);
    }
  };

  const generateStaffId = async () => {
    const selectedFaculty = faculties.find((f) => f.id === formData.facultyId);
    const selectedDept = departments.find((d) => d.id === formData.departmentId);

    if (!selectedFaculty || !selectedDept) return;

    try {
      setIsGeneratingId(true);
      const response = await fetch('/api/staff-registration/generate-staff-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          facultyAcronym: selectedFaculty.acronym,
          departmentAcronym: selectedDept.acronym,
          dateOfBirth: formData.dateOfBirth,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setStaffId(data.staffId);
      } else {
        setError(data.message || 'Failed to generate staff ID');
      }
    } catch (err) {
      setError('Error generating staff ID');
    } finally {
      setIsGeneratingId(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return;
    }

    if (!formData.dateOfBirth) {
      setError('Date of birth is required');
      return;
    }

    if (!formData.state) {
      setError('State is required');
      return;
    }

    if (!formData.facultyId) {
      setError('Faculty is required');
      return;
    }

    if (!formData.departmentId) {
      setError('Department is required');
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }

    if (!formData.password) {
      setError('Password is required');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/staff-registration/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          dateOfBirth: formData.dateOfBirth,
          state: formData.state,
          facultyId: formData.facultyId,
          departmentId: formData.departmentId,
          staffId,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to register staff');
      }

      setSuccess(
        `Staff registered successfully! Staff ID: ${data.staff.staffId}`
      );
      setFormData({
        fullName: '',
        dateOfBirth: '',
        state: '',
        facultyId: '',
        departmentId: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      setStaffId('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium transition-colors"
          >
            <ArrowLeft size={18} />
            Back
          </Link>
          <h1 className="text-4xl font-heading text-accent dark:text-university-gold mb-2">
            Staff Registration
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Register as a new staff member at Titan University
          </p>
        </div>

        {/* Registration Form Card */}
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardTitle className="flex items-center gap-2">
              <span className="material-symbols-outlined">person_add</span>
              Create Staff Account
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8">
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                <p className="text-red-700 dark:text-red-200 font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                <p className="text-green-700 dark:text-green-200 font-medium">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-bold text-accent dark:text-slate-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  required
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-bold text-accent dark:text-slate-300 mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  required
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-bold text-accent dark:text-slate-300 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Enter state"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  required
                />
              </div>

              {/* Faculty */}
              <div>
                <label className="block text-sm font-bold text-accent dark:text-slate-300 mb-2">
                  Faculty *
                </label>
                {isLoadingFaculties ? (
                  <div className="flex items-center gap-2 text-slate-500">
                    <Loader size={18} className="animate-spin" />
                    Loading faculties...
                  </div>
                ) : (
                  <select
                    name="facultyId"
                    value={formData.facultyId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                    required
                  >
                    <option value="">Select a faculty</option>
                    {faculties.map((faculty) => (
                      <option key={faculty.id} value={faculty.id}>
                        {faculty.name} ({faculty.acronym})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-bold text-accent dark:text-slate-300 mb-2">
                  Department *
                </label>
                {!formData.facultyId ? (
                  <div className="text-slate-500 text-sm">
                    Please select a faculty first
                  </div>
                ) : isLoadingDepts ? (
                  <div className="flex items-center gap-2 text-slate-500">
                    <Loader size={18} className="animate-spin" />
                    Loading departments...
                  </div>
                ) : (
                  <select
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                    required
                  >
                    <option value="">Select a department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name} ({dept.acronym})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Auto-generated Staff ID */}
              {staffId && (
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border-2 border-blue-200 dark:border-blue-800">
                  <label className="block text-sm font-bold text-accent dark:text-slate-300 mb-2">
                    Auto-Generated Staff ID
                  </label>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-300 font-mono">
                    {staffId}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                    Format: Faculty Acronym - Department Acronym - YYMMDD - Incremental Number
                  </p>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-accent dark:text-slate-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="staff@titan.edu"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-bold text-accent dark:text-slate-300 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Minimum 8 characters"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-bold text-accent dark:text-slate-300 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Re-enter password"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || isGeneratingId}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">check_circle</span>
                    Register Staff
                  </>
                )}
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
