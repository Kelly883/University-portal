"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("student@titan.edu");
  const [identifierType, setIdentifierType] = useState<"email" | "staffId" | "matricNo">("email");
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
        identifier,
        identifierType,
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

  const getPlaceholder = () => {
    switch (identifierType) {
      case "email":
        return "Enter your email";
      case "staffId":
        return "Enter your staff ID";
      case "matricNo":
        return "Enter your matric number";
    }
  };

  const getIdentifierLabel = () => {
    switch (identifierType) {
      case "email":
        return "Email Address";
      case "staffId":
        return "Staff ID";
      case "matricNo":
        return "Matric Number";
    }
  };

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
            <span className="material-symbols-outlined text-4xl">account_balance</span>
          </div>
          <h2 className="text-titan-blue dark:text-titan-gold text-lg font-heading uppercase tracking-[0.2em] font-bold text-center">
            Titan University Portal
          </h2>
          <div className="w-12 h-0.5 bg-titan-gold mt-2"></div>
        </div>

        <div className="w-full bg-white dark:bg-[#161B22] p-8 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-none border border-slate-200 dark:border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-titan-gold/50 to-transparent"></div>
          
          <div className="mb-8 text-center">
            <h1 className="text-titan-blue dark:text-white text-3xl font-heading uppercase tracking-tight mb-2 font-bold">
              Sign In
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium italic">
              Secure Access for Scholars & Faculty
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Identifier Type Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-titan-blue dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider">
                University Identification
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "email" as const, label: "Email", icon: "mail" },
                  { value: "staffId" as const, label: "Staff ID", icon: "badge" },
                  { value: "matricNo" as const, label: "Matric No", icon: "school" },
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => {
                      setIdentifierType(type.value);
                      setIdentifier("");
                      setError("");
                    }}
                    className={`px-2 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1 h-16 ${
                      identifierType === type.value
                        ? "bg-titan-blue text-titan-gold border border-titan-gold shadow-md"
                        : "bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:border-titan-blue/30 dark:hover:border-titan-gold/30 hover:bg-white dark:hover:bg-white/10"
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">{type.icon}</span>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Identifier Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-titan-blue dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider">
                {getIdentifierLabel()}
              </label>
              <div className="relative group">
                <input
                  className={`w-full h-10 bg-slate-50 dark:bg-black/20 border ${
                    error ? "border-red-500/50 focus:border-red-500" : "border-slate-200 dark:border-white/10 focus:border-titan-gold"
                  } focus:ring-1 focus:ring-titan-gold/20 rounded px-3 text-titan-blue dark:text-white placeholder:text-slate-400 text-sm transition-all`}
                  placeholder={getPlaceholder()}
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-titan-blue dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider">
                  Access Key
                </label>
                <a
                  className="text-titan-gold text-[10px] font-bold uppercase tracking-widest hover:text-titan-blue dark:hover:text-white transition-colors"
                  href="#"
                >
                  Forgot Key?
                </a>
              </div>
              <div className="relative">
                <input
                  className="w-full h-10 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:border-titan-gold focus:ring-1 focus:ring-titan-gold/20 rounded px-3 pr-10 text-titan-blue dark:text-white placeholder:text-slate-400 text-sm transition-all"
                  placeholder="Enter password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {error && (
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded p-3 flex items-start gap-2">
                <span className="material-symbols-outlined text-red-500 text-sm mt-0.5">error</span>
                <p className="text-red-600 dark:text-red-400 text-xs font-medium leading-tight">
                  {error}
                </p>
              </div>
            )}

            <button
              disabled={loading}
              className="w-full h-12 bg-titan-blue hover:bg-titan-blue/90 text-white font-heading text-lg uppercase tracking-widest rounded transition-all shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 border border-white/10 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span className="text-sm">Authenticating...</span>
                </>
              ) : (
                <>
                  <span className="text-sm font-bold">Authenticate</span>
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center space-y-4">
          <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">
            New to the Institution?
            <a
              className="text-titan-blue dark:text-titan-gold font-bold uppercase tracking-tighter hover:underline ml-1"
              href="#"
            >
              Request Access
            </a>
          </p>
          <div className="pt-6 border-t border-slate-200 dark:border-white/5 w-full max-w-[200px] mx-auto">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-loose">
              Official Information System<br />
              © Titan University 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
