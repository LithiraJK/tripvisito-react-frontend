import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  IoShieldCheckmarkOutline,
  IoLockClosedOutline,
  IoMailOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoArrowBackOutline,
  IoAlertCircleOutline,
} from "react-icons/io5";
import { adminLoginService } from "../../services/auth";
import { useAuth } from "../../contexts/authContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import logo from "../../assets/icons/logo.svg";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AdminLoginPage = () => {
  const [email, setEmail] = useState(() => localStorage.getItem("rememberedAdminEmail") || "");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(() => localStorage.getItem("rememberAdminChecked") === "true");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please enter your admin credentials");
      return;
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      toast.error("Please enter a valid administrative email");
      return;
    }

    try {
      setIsLoading(true);
      const res: any = await adminLoginService(email.trim(), password, rememberMe);

      if (res?.data?.accessToken) {
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);

        const expiresInMs = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
        const expTime = res.data?.expiresAt
          ? new Date(res.data.expiresAt).getTime()
          : Date.now() + expiresInMs;
        localStorage.setItem("authExpiresAt", String(expTime));

        if (rememberMe) {
          localStorage.setItem("rememberedAdminEmail", email.trim());
          localStorage.setItem("rememberAdminChecked", "true");
        } else {
          localStorage.removeItem("rememberedAdminEmail");
          localStorage.removeItem("rememberAdminChecked");
        }

        const loggedInUser = res.data.user;
        setUser(loggedInUser);

        const redirectPath =
          location.state?.from?.pathname || "/admin/dashboard";

        toast.success(
          rememberMe 
            ? `Welcome, ${loggedInUser.name}! Staff session active for 7 days. 🛡️` 
            : `Welcome to Command Center, ${loggedInUser.name}! 🛡️`
        );
        navigate(redirectPath, { replace: true });
      }
    } catch (err: any) {
      console.error("Admin Login Error:", err);
      const statusCode = err?.response?.status;
      const errorMsg =
        err?.response?.data?.message ||
        "Authentication failed. Please verify your administrator credentials.";

      if (statusCode === 403) {
        toast.error("Access Denied: Administrator clearance required!");
      } else if (statusCode === 429) {
        toast.error("Too many failed attempts. Portal locked for 15 minutes.");
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-100 via-sky-50/70 to-blue-100/50 text-slate-800 relative overflow-hidden px-4 py-8">
      {/* Decorative Light Background Accents */}
      <div className="absolute top-10 left-10 size-80 bg-sky-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 size-80 bg-cyan-300/25 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-slate-200/60 relative z-10"
      >
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-7">
          <div className="flex items-center gap-3 mb-2.5">
            <img src={logo} alt="Tripvisito" className="size-8 object-contain" />
            <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-cyan-600 to-sky-600 bg-clip-text text-transparent">
              Tripvisito
            </span>
            <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
              Staff Portal
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mt-0.5">
            <IoShieldCheckmarkOutline className="text-emerald-500 text-base" />
            <span>Administrative Command Center</span>
          </div>
        </div>

        {/* Security Warning Notice */}
        <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-3.5 mb-6 flex items-start gap-2.5 text-amber-900 text-xs leading-relaxed">
          <IoAlertCircleOutline className="text-amber-600 text-base shrink-0 mt-0.5" />
          <p>
            <strong className="font-semibold text-amber-950">Restricted Access:</strong> Authorized management personnel only. All access attempts are monitored and IP-audited.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleAdminLogin} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Staff Email Address
            </label>
            <div className="relative">
              <IoMailOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tripvisito.com"
                className="w-full bg-slate-50/90 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Security Key / Password
            </label>
            <div className="relative">
              <IoLockClosedOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-50/90 border border-slate-200 rounded-xl pl-10 pr-11 py-3 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="size-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500 cursor-pointer accent-sky-600"
              />
              <span className="text-slate-600 font-semibold">Remember staff session (7 days)</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-sky-500/25 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2 pt-3 mt-3"
          >
            {isLoading ? (
              <>
                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verifying Clearance...</span>
              </>
            ) : (
              <>
                <IoShieldCheckmarkOutline size={18} />
                <span>Authenticate & Access Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Link back to Public Portal */}
        <div className="mt-7 pt-5 border-t border-slate-100 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <IoArrowBackOutline />
            <span>Return to Public Traveler Site</span>
          </Link>
        </div>
      </motion.div>
    </main>
  );
};

export default AdminLoginPage;
