'use client';

import { useState } from 'react';
import { registerCourse, dropCourse } from '@/actions/student';
import { useRouter } from 'next/navigation';

interface Course {
  id: string;
  name: string;
  code: string;
  department: string | null;
  level: string | null;
  price: number;
  faculty: {
    name: string | null;
    email: string | null;
  };
}

interface Props {
  availableCourses: Course[];
  enrolledCourses: Course[];
}

export default function CourseRegistrationClient({ availableCourses, enrolledCourses }: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const router = useRouter();

  const handleRegister = async (courseId: string) => {
    setLoadingId(courseId);
    setMessage(null);
    try {
      const res = await registerCourse(courseId);
      if (res.error) {
        setMessage({ type: 'error', text: res.error });
      } else {
        setMessage({ type: 'success', text: res.success as string });
        router.refresh();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setLoadingId(null);
    }
  };

  const handleDrop = async (courseId: string) => {
    if (!confirm('Are you sure you want to drop this course?')) return;
    
    setLoadingId(courseId);
    setMessage(null);
    try {
      const res = await dropCourse(courseId);
      if (res.error) {
        setMessage({ type: 'error', text: res.error });
      } else {
        setMessage({ type: 'success', text: res.success as string });
        router.refresh();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Available Courses Section */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <div className="h-8 w-1 bg-titan-gold rounded-full"></div>
          <h2 className="text-2xl font-heading font-bold text-titan-blue dark:text-white uppercase tracking-wide">Available Courses</h2>
        </div>
        
        {availableCourses.length === 0 ? (
          <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-xl text-center border border-slate-200 dark:border-slate-700 border-dashed">
            <p className="text-slate-500">No available courses found for registration.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCourses.map(course => (
              <div key={course.id} className="group bg-white dark:bg-slate-800 p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_25px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-700 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-titan-blue group-hover:bg-titan-gold transition-colors duration-300"></div>
                
                <div className="flex justify-between items-start mb-4 pl-3">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-titan-blue dark:text-blue-300 rounded-full tracking-wider uppercase border border-blue-100 dark:border-blue-900/30">
                      {course.code}
                    </span>
                    <h3 className="text-lg font-bold mt-3 text-slate-900 dark:text-white leading-tight group-hover:text-titan-blue dark:group-hover:text-titan-gold transition-colors">
                      {course.name}
                    </h3>
                  </div>
                </div>
                
                <div className="space-y-2.5 mb-6 pl-3 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-slate-400">school</span>
                    <span>{course.department || 'General'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-slate-400">person</span>
                    <span>{course.faculty?.name || 'Staff'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-slate-400">payments</span>
                    <span className={course.price > 0 ? "font-semibold text-slate-900 dark:text-white" : "text-green-600 font-bold"}>
                      {course.price > 0 ? `$${course.price.toLocaleString()}` : 'Free'}
                    </span>
                  </div>
                </div>

                <div className="pl-3">
                  <button
                    onClick={() => handleRegister(course.id)}
                    disabled={loadingId === course.id}
                    className="w-full h-10 bg-titan-blue hover:bg-titan-blue/90 text-white text-sm font-bold uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {loadingId === course.id ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <span>Register</span>
                        <span className="material-symbols-outlined text-base">add_circle</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Enrolled Courses Section */}
      <section className="pt-10 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-8 w-1 bg-green-500 rounded-full"></div>
          <h2 className="text-2xl font-heading font-bold text-titan-blue dark:text-white uppercase tracking-wide">My Registered Courses</h2>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-xl text-center border border-slate-200 dark:border-slate-700 border-dashed">
            <p className="text-slate-500">You have not registered for any courses yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map(course => (
              <div key={course.id} className="bg-green-50/50 dark:bg-green-900/10 p-6 rounded-xl border border-green-100 dark:border-green-900/30 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full tracking-wider uppercase">
                      {course.code}
                    </span>
                    <h3 className="text-lg font-bold mt-3 text-slate-900 dark:text-white leading-tight">
                      {course.name}
                    </h3>
                  </div>
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                    <span className="material-symbols-outlined text-lg">check</span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-6 text-sm text-slate-600 dark:text-slate-400">
                  <p className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base opacity-50">school</span>
                    {course.department || 'General'}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base opacity-50">person</span>
                    {course.faculty?.name || 'Staff'}
                  </p>
                </div>

                <button
                  onClick={() => handleDrop(course.id)}
                  disabled={loadingId === course.id}
                  className="w-full py-2 px-4 bg-white dark:bg-slate-800 text-red-500 hover:text-red-600 text-xs font-bold uppercase tracking-wider border border-red-100 dark:border-red-900/30 hover:border-red-200 rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                >
                  {loadingId === course.id ? 'Processing...' : 'Drop Course'}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
      
      {message && (
        <div className={`fixed bottom-8 right-8 p-4 rounded-lg shadow-2xl ${message.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white animate-in slide-in-from-bottom-5 fade-in duration-300 z-50 flex items-center gap-3`}>
          <span className="material-symbols-outlined">{message.type === 'success' ? 'check_circle' : 'error'}</span>
          <p className="font-medium">{message.text}</p>
        </div>
      )}
    </div>
  );
}
