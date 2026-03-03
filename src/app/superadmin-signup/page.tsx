'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SuperadminSignup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [exists, setExists] = useState(false);

  // Check if superadmin already exists on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/superadmin/register');
        if (res.ok) {
          const data = await res.json();
          if (data.exists) {
            setExists(true);
            setCheckingStatus(false);
          } else {
            setCheckingStatus(false);
          }
        } else {
            setCheckingStatus(false);
        }
      } catch (error) {
        console.error('Error checking status:', error);
        setCheckingStatus(false);
      }
    };
    checkStatus();
  }, [router]);

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset the superadmin account? This action cannot be undone and will delete all existing superadmin accounts.')) return;
    
    try {
        setLoading(true);
        const res = await fetch('/api/superadmin/register', { method: 'DELETE' });
        if (res.ok) {
            alert('System reset successfully. You can now create a new superadmin account.');
            window.location.reload();
        } else {
            alert('Failed to reset system.');
            setLoading(false);
        }
    } catch (e) {
        alert('An error occurred.');
        setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/superadmin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to create superadmin account');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-titan-blue/30 border-t-titan-blue rounded-full animate-spin"></div>
          <p className="text-titan-blue dark:text-titan-gold font-heading uppercase tracking-widest text-sm animate-pulse">
            Verifying System Status...
          </p>
        </div>
      </div>
    );
  }

  if (exists) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background-light dark:bg-background-dark p-4">
        <div className="w-full max-w-[420px] bg-white dark:bg-[#161B22] p-8 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-200 dark:border-white/5 text-center">
            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-4xl">warning</span>
            </div>
            <h1 className="text-2xl font-bold text-titan-blue dark:text-white mb-4">Superadmin Already Exists</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
                A superadmin account has already been created for this system.
                For security reasons, multiple superadmin accounts cannot be created via this page.
            </p>
            
            <div className="flex flex-col gap-3">
                <Link 
                    href="/login" 
                    className="w-full py-3 bg-titan-blue hover:bg-titan-blue/90 text-white rounded font-bold uppercase tracking-wide transition-colors"
                >
                    Log In
                </Link>
                
                <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-200 dark:border-white/10"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-[#161B22] px-2 text-slate-400">Recovery Options</span>
                    </div>
                </div>

                <button 
                    onClick={handleReset}
                    disabled={loading}
                    className="w-full py-3 bg-white dark:bg-transparent border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded font-medium transition-colors text-sm"
                >
                    {loading ? 'Resetting...' : 'Reset System (Delete Superadmin)'}
                </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative bg-background-light dark:bg-background-dark overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 academic-pattern pointer-events-none opacity-5"></div>
      <div className="fixed top-0 left-0 w-full h-2 bg-gradient-to-r from-titan-blue via-titan-gold to-titan-blue z-50"></div>
      <div className="fixed -z-10 top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-titan-gold/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-titan-blue/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-[420px] flex flex-col items-center relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-titan-blue text-titan-gold rounded-full flex items-center justify-center mb-4 shadow-2xl border-4 border-titan-gold/20">
            <span className="material-symbols-outlined text-4xl">admin_panel_settings</span>
          </div>
          <h2 className="text-titan-blue dark:text-titan-gold text-lg font-heading uppercase tracking-[0.2em] font-bold text-center">
            System Initialization
          </h2>
          <div className="w-12 h-0.5 bg-titan-gold mt-2"></div>
        </div>

        <div className="w-full bg-white dark:bg-[#161B22] p-8 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-none border border-slate-200 dark:border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-titan-gold/50 to-transparent"></div>
          
          <div className="mb-8 text-center">
            <h1 className="text-titan-blue dark:text-white text-2xl font-heading uppercase tracking-tight mb-2 font-bold">
              Create Superadmin
            </h1>
            <p className="text-red-500 text-xs font-bold uppercase tracking-wider bg-red-50 dark:bg-red-900/10 py-2 px-4 rounded-full inline-block border border-red-200 dark:border-red-900/30">
              One-Time Setup Only
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium italic mt-3">
              This page will be permanently disabled after account creation.
            </p>
          </div>

          {success ? (
            <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-lg p-6 text-center animate-in fade-in zoom-in duration-300">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-2xl">check_circle</span>
              </div>
              <p className="text-green-700 dark:text-green-400 font-bold mb-1">Account Created Successfully!</p>
              <p className="text-green-600 dark:text-green-500 text-xs">Redirecting to secure login...</p>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-titan-blue dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full h-10 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:border-titan-gold focus:ring-1 focus:ring-titan-gold/20 rounded px-3 text-titan-blue dark:text-white placeholder:text-slate-400 text-sm transition-all"
                    placeholder="Enter full name"
                    disabled={loading}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-titan-blue dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full h-10 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:border-titan-gold focus:ring-1 focus:ring-titan-gold/20 rounded px-3 text-titan-blue dark:text-white placeholder:text-slate-400 text-sm transition-all"
                    placeholder="superadmin@titan.edu"
                    disabled={loading}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-titan-blue dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full h-10 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:border-titan-gold focus:ring-1 focus:ring-titan-gold/20 rounded px-3 pr-10 text-titan-blue dark:text-white placeholder:text-slate-400 text-sm transition-all"
                      placeholder="Min. 8 characters"
                      disabled={loading}
                      required
                    />
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-titan-blue dark:hover:text-titan-gold"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-titan-blue dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full h-10 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:border-titan-gold focus:ring-1 focus:ring-titan-gold/20 rounded px-3 pr-10 text-titan-blue dark:text-white placeholder:text-slate-400 text-sm transition-all"
                      placeholder="Confirm password"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded p-3 flex items-start gap-2">
                  <span className="material-symbols-outlined text-red-500 text-sm mt-0.5">error</span>
                  <p className="text-red-600 dark:text-red-400 text-xs font-medium leading-tight">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-titan-blue hover:bg-titan-blue/90 text-white font-heading text-lg uppercase tracking-widest rounded transition-all shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 border border-white/10 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden mt-6"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span className="text-sm">Initializing...</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm font-bold">Create System Admin</span>
                    <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <div className="mt-8 text-center space-y-4">
          <div className="pt-6 border-t border-slate-200 dark:border-white/5 w-full max-w-[200px] mx-auto">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-loose">
              Titan University System<br />
              Secure Initialization Protocol
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}