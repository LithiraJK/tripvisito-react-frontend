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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      const res: any = await adminLoginService(email.trim(), password);

      if (res?.data?.accessToken) {
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);

        const loggedInUser = res.data.user;
        setUser(loggedInUser);

        const redirectPath =
          location.state?.from?.pathname || "/admin/dashboard";

        toast.success(`Welcome to Command Center, ${loggedInUser.name}! 🛡️`);
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
    <main className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-white relative overflow-hidden px-4 py-8">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 -left-32 size-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 size-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10"
      >
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center gap-3 mb-3">
            <img src={logo} alt="Tripvisito" className="size-8 object-contain" />
            <span className="font-black text-xl tracking-tight text-white">
              Tripvisito
            </span>
            <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-md">
              Staff
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mt-1">
            <IoShieldCheckmarkOutline className="text-emerald-400 text-base" />
            <span>Administrative Command Portal</span>
          </div>
        </div>

        {/* Security Warning Notice */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3.5 mb-6 flex items-start gap-3 text-amber-300 text-xs leading-relaxed">
          <IoAlertCircleOutline className="text-lg shrink-0 mt-0.5" />
          <p>
            <strong className="font-semibold text-amber-200">Restricted Access:</strong> Authorized personnel only. All access requests and IP origins are logged for compliance.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleAdminLogin} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
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
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
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
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2 mt-2"
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
        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-blue-400 transition-colors"
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
