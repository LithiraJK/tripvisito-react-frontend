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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      const response: any = await login(email.trim(), password);

      if (response?.data?.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);

        const loggedInUser = response.data.user;
        setUser(loggedInUser);

        const defaultPath =
          loggedInUser.roles.includes("ADMIN") ||
          loggedInUser.roles.includes("SUPERADMIN")
            ? "/admin/dashboard"
            : "/customer/dashboard";

        const redirectPath = location.state?.from?.pathname || defaultPath;

        toast.success("Welcome back to Tripvisito!");
        navigate(redirectPath, { replace: true });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errMsg = error?.response?.data?.message || "Login failed, please check your credentials";
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. GOOGLE LOGIN LOGIC ---
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsGoogleLoading(true);

        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );

        const googleUser = userInfo.data;

        const response = await api.post("/auth/google-login", {
          name: googleUser.name,
          email: googleUser.email,
          profileimg: googleUser.picture,
        });

        const backendData = response.data.data;

        if (backendData.accessToken) {
          localStorage.setItem("accessToken", backendData.accessToken);
          localStorage.setItem("refreshToken", backendData.refreshToken);

          const loggedInUser = backendData.user;
          setUser(loggedInUser);
          
          const defaultPath = loggedInUser.roles.includes("ADMIN") || loggedInUser.roles.includes("SUPERADMIN")
            ? "/admin/dashboard"
            : "/customer/dashboard";

          const redirectPath = location.state?.from?.pathname || defaultPath;

          toast.success("Logged in with Google!");
          navigate(redirectPath, { replace: true });
        }
      } catch (error: any) {
        console.error("Google Login Error:", error);
        const errMsg = error?.response?.data?.message || "Google Login failed!";
        toast.error(errMsg);
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
              <figure className="flex items-center">
                <img src={logo} alt="logo" className="h-6 w-auto sm:h-8" />
              </figure>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-500 to-sky-600 bg-clip-text text-transparent">
                Tripvisito
              </h1>
            </Link>
            <div className="space-y-2">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                Sign In to Explore <br className="hidden sm:inline" />
                <span className="text-blue-500 font-medium">Your Travel World</span>
              </h2>
              <p className="text-xs xs:text-sm sm:text-base text-gray-600">
                Unlock personalized trips, AI travel planning, and exclusive destinations.
              </p>
            </div>
          </header>

          <div className="w-full flex justify-center items-center">
            <div className="w-full max-w-md bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-4 xs:p-6 sm:p-8">
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-2 text-center">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Welcome Back</h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Sign in with your email or Google account
                    </p>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {/* --- MANUAL LOGIN FORM --- */}
                    <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          className="w-full border border-gray-300 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Password
                        </label>
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full border border-gray-300 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>

                      <div className="flex justify-end">
                        <a href="#" className="text-xs text-blue-500 hover:underline">
                          Forgot Password?
                        </a>
                      </div>

                      <div>
                        <button 
                          type="submit"
                          disabled={isLoading || isGoogleLoading}
                          className="w-full bg-blue-500 text-white rounded-xl py-2.5 sm:py-3 text-xs sm:text-sm font-semibold hover:bg-blue-600 disabled:bg-blue-300 transition-all cursor-pointer shadow-md shadow-blue-500/20"
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

                  <div className="w-full flex flex-col items-center gap-1 mt-4 sm:mt-6">
                    <p className="text-xs sm:text-sm text-center">Don't have an account? <Link to="/register" className="text-blue-500 hover:underline font-medium">Sign Up</Link></p>
                    <Link to="/admin/login" className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors mt-2 flex items-center gap-1">
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
