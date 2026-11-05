import { Link, useNavigate, useLocation } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import React, { useState } from "react";
import { login } from "../services/auth";
import { useAuth } from "../contexts/authContext";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google"; 
import axios from "axios";
import api from "../services/api";
import logo from "../assets/icons/logo.svg";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginPage = () => {
  const [email, setEmail] = useState(() => localStorage.getItem("rememberedEmail") || "");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(() => localStorage.getItem("rememberMeChecked") === "true");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // --- 1. MANUAL LOGIN LOGIC ---
  const handleLogin = async (e: React.FormEvent<HTMLButtonElement | HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password!");
      return;
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      toast.error("Please enter a valid email address!");
      return;
    }

    try {
      setIsLoading(true);
      const response: any = await login(email.trim(), password, rememberMe);

      if (response?.data?.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);

        // Store 7-day expiration if rememberMe, otherwise 24 hours
        const expiresInMs = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
        const expTime = response.data?.expiresAt
          ? new Date(response.data.expiresAt).getTime()
          : Date.now() + expiresInMs;
        localStorage.setItem("authExpiresAt", String(expTime));

        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email.trim());
          localStorage.setItem("rememberMeChecked", "true");
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberMeChecked");
        }

        const loggedInUser = response.data.user;
        setUser(loggedInUser);

        const defaultPath =
          loggedInUser.roles.includes("ADMIN") ||
          loggedInUser.roles.includes("SUPERADMIN")
            ? "/admin/dashboard"
            : "/customer/dashboard";

        const redirectPath = location.state?.from?.pathname || defaultPath;

        toast.success(
          rememberMe 
            ? "Welcome back! Session remembered for 7 days." 
            : "Welcome back to Tripvisito!"
        );
        navigate(redirectPath, { replace: true });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errMsg = error?.response?.data?.message || "Login failed, please check your credentials";
      toast.error(errMsg, { duration: 4500 });
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. GOOGLE LOGIN LOGIC ---
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsGoogleLoading(true);
        const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });

        const googleUser = res.data;

        const response = await api.post("/auth/google-login", {
          name: googleUser.name,
          email: googleUser.email,
          profileimg: googleUser.picture,
        });

        const backendData = response.data.data;

        if (backendData.accessToken) {
          localStorage.setItem("accessToken", backendData.accessToken);
          localStorage.setItem("refreshToken", backendData.refreshToken);

          const expMs = backendData.expiresAt 
            ? new Date(backendData.expiresAt).getTime() 
            : Date.now() + 7 * 24 * 60 * 60 * 1000;
          localStorage.setItem("authExpiresAt", String(expMs));

          const loggedInUser = backendData.user;
          setUser(loggedInUser);
          
          const defaultPath = loggedInUser.roles.includes("ADMIN") || loggedInUser.roles.includes("SUPERADMIN")
            ? "/admin/dashboard"
            : "/customer/dashboard";

          const redirectPath = location.state?.from?.pathname || defaultPath;

          toast.success("Logged in with Google! Session remembered for 7 days.");
          navigate(redirectPath, { replace: true });
        }
      } catch (error: any) {
        console.error("Google Login Error:", error);
        const errMsg = error?.response?.data?.message || "Google Login failed!";
        toast.error(errMsg, { duration: 4500 });
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => toast.error("Google Login Failed!"),
  });

  return (
    <main className='w-full h-screen flex justify-center items-center min-h-screen bg-[url("https://res.cloudinary.com/dxs4vmk1i/image/upload/v1767602259/auth-img_nyrdnw.webp")] bg-cover bg-no-repeat'>
      <section className="size-full bg-[rgba(255,255,255,0.3)] glassmorphism flex justify-center items-center px-2 sm:px-4 overflow-y-auto">
        <div className="w-full max-w-6xl px-2 xs:px-4 sm:px-8 md:px-12 py-6 sm:py-8 md:py-12 bg-[rgba(255,255,255,0.4)] backdrop-blur-lg rounded-2xl sm:rounded-3xl my-4 sm:my-8 space-y-6 sm:space-y-8 md:space-y-0 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
          <header className="md:flex md:flex-col md:justify-center md:h-full space-y-6">
            <Link to="/" className="nav-link flex flex-row items-center space-x-3 mb-4 group transition-all">
              <img src={logo} alt="logo" className="md:size-10 transition-transform group-hover:scale-110" />
              <h1 className="sm:text-2xl font-bold bg-linear-to-r from-cyan-500 to-sky-600 bg-clip-text text-transparent">Tripvisito</h1>
            </Link>
            <article className="space-y-2 md:space-y-4">
              <h2 className="sm:text-xl text-2xl md:text-4xl font-bold text-gray-800 leading-tight">Start Your Travel Journey</h2>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-md">Log in to manage your trips, discover new destinations, and create unforgettable travel experiences.</p>
            </article>
          </header>
          
          <div className="w-full">
            <div className="py-4 sm:py-6 flex flex-col justify-center">
              <div className="relative py-2 sm:py-3 w-full max-w-xl mx-auto drop-shadow-xl">
                <div className="absolute inset-0 bg-linear-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 rounded-2xl sm:rounded-3xl"></div>
                <div className="relative px-4 py-6 xs:px-6 xs:py-8 sm:p-10 bg-white shadow-lg rounded-2xl sm:rounded-3xl">
                  <div className="w-full mx-auto">
                    <div className="flex flex-col justify-center items-center mb-4 sm:mb-6">
                      <h1 className="sm:text-xl text-2xl md:text-4xl font-bold text-gray-800 mb-2">Login</h1>
                      <p className="text-lg sm:text-base text-gray-500">Welcome back!</p>
                    </div>
                    
                    <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
                      <div className="relative">
                        <label className="text-sm font-medium text-gray-700 block mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          value={email}
                          className="text-xs xs:text-sm py-2 px-3 xs:px-4 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-cyan-400"
                          placeholder="Email address"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="relative">
                        <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
                        <input
                          type="password"
                          required
                          value={password}
                          className="text-xs xs:text-sm py-2 px-3 xs:px-4 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-cyan-400"
                          placeholder="Password"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>

                      {/* --- REMEMBER ME & FORGOT PASSWORD --- */}
                      <div className="flex items-center justify-between text-xs py-0.5">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="size-4 text-cyan-500 rounded border-gray-300 focus:ring-cyan-400 cursor-pointer accent-cyan-500"
                          />
                          <span className="text-gray-600 font-medium">Remember me (7 days)</span>
                        </label>
                        <a href="#" className="text-cyan-600 hover:underline">
                          Forgot Password?
                        </a>
                      </div>

                      <div className="relative pt-1">
                        <button
                          type="submit"
                          disabled={isLoading || isGoogleLoading}
                          className="w-full bg-linear-to-r from-cyan-400 to-sky-500 text-white text-sm sm:text-base font-semibold rounded-lg px-4 py-2 hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          {isLoading ? "Signing in..." : "Login"}
                        </button>
                      </div>
                      
                      <p className="text-center text-xs sm:text-sm text-gray-500 py-1 sm:py-2">or</p>
                      
                      {/* --- GOOGLE LOGIN BUTTON --- */}
                      <div className="relative">
                        <button 
                          type="button"
                          disabled={isLoading || isGoogleLoading}
                          onClick={() => googleLogin()}
                          className="w-full border border-gray-300 rounded-xl py-2 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 transition-all cursor-pointer"
                        >
                          <FcGoogle className="mr-2 text-lg sm:text-xl" />
                          <span className="text-xs xs:text-sm sm:text-base">
                            {isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}
                          </span>
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="w-full flex flex-col items-center justify-center mt-4 sm:mt-6 gap-2">
                    <p className="text-lg xs:text-sm text-center">
                      Don't have an account? <Link to="/register" className="text-blue-500 hover:underline font-medium">Sign Up</Link>
                    </p>
                    <Link
                      to="/admin/login"
                      className="text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1 font-medium"
                    >
                      Staff & Admin Portal 🛡️
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
