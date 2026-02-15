"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("student@titan.edu");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials. Please verify your ID and Access Key.");
        setLoading(false);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 academic-pattern pointer-events-none"></div>
      <div className="w-full max-w-[420px] flex flex-col items-stretch relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 bg-accent text-university-gold rounded-full flex items-center justify-center mb-6 shadow-2xl border-4 border-university-gold/20">
            <span className="material-symbols-outlined text-5xl">account_balance</span>
          </div>
          <h2 className="text-accent dark:text-university-gold text-xl font-heading uppercase tracking-[0.2em]">
            Titan University Portal
          </h2>
          <div className="w-12 h-0.5 bg-university-gold mt-2"></div>
        </div>

        <div className="mb-10 text-center">
          <h1 className="text-accent dark:text-white text-5xl font-heading uppercase tracking-tight mb-3">
            Sign In
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic">
            Secure Access for Scholars & Faculty
          </p>
        </div>

        <div className="bg-white dark:bg-[#161B22] p-8 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-none border border-slate-200 dark:border-slate-800">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <label className="text-accent dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
                University Identification
              </label>
              <div className="relative group">
                <input
                  className={`w-full h-12 bg-slate-50 dark:bg-[#0D1117] border-2 ${
                    error ? "border-red-500/50 focus:border-red-500" : "border-slate-200 dark:border-slate-800 focus:border-accent dark:focus:border-university-gold"
                  } focus:ring-0 rounded px-4 text-accent dark:text-white placeholder:text-slate-400 text-sm transition-all`}
                  placeholder="ID Number or Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {error && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                    <span className="material-symbols-outlined text-lg">error</span>
                  </div>
                )}
              </div>
              {error && (
                <p className="text-red-600 text-[10px] font-bold uppercase tracking-tight px-1">
                  {error}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-accent dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
                  Access Key
                </label>
                <a
                  className="text-university-gold text-[10px] font-bold uppercase tracking-widest hover:text-accent transition-colors"
                  href="#"
                >
                  Forgot Key?
                </a>
              </div>
              <div className="relative">
                <input
                  className="w-full h-12 bg-slate-50 dark:bg-[#0D1117] border-2 border-slate-200 dark:border-slate-800 focus:border-accent dark:focus:border-university-gold focus:ring-0 rounded px-4 pr-12 text-accent dark:text-white placeholder:text-slate-400 text-sm transition-all"
                  placeholder="Enter password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-accent dark:hover:text-university-gold"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full h-12 bg-accent hover:bg-black text-university-gold font-heading text-xl uppercase tracking-widest rounded transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-3 border border-university-gold/30 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Authenticating..." : "Authenticate"}
              {!loading && <span className="material-symbols-outlined text-xl">verified_user</span>}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center space-y-4">
          <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">
            New to the Institution?
            <a
              className="text-accent dark:text-university-gold font-bold uppercase tracking-tighter hover:underline ml-1"
              href="#"
            >
              Request Access
            </a>
          </p>
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-loose">
              Official Information System<br />
              © Titan University 2024
            </p>
          </div>
        </div>
      </div>

      <div className="fixed top-0 left-0 w-full h-2 bg-gradient-to-r from-accent via-university-gold to-accent"></div>
      <div className="fixed -z-10 top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-university-gold rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent rounded-full blur-[100px]"></div>
      </div>
    </>
  );
}
