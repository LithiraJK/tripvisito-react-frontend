import { createContext, useContext, useEffect, useState } from "react";
import { getMyDetails } from "../services/auth";
import toast from "react-hot-toast";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("authExpiresAt");
    setUser(null);
  };

  const isSessionExpired = (): boolean => {
    const expiresAt = localStorage.getItem("authExpiresAt");
    if (expiresAt) {
      const expTime = parseInt(expiresAt, 10);
      if (!isNaN(expTime) && Date.now() > expTime) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    const hasToken =
      Boolean(localStorage.getItem("accessToken")) ||
      Boolean(localStorage.getItem("refreshToken"));

    // Check if 7-day or 1-day session has expired
    if (isSessionExpired()) {
      logout();
      setLoading(false);
      // Only show toast if the user was actually logged in previously
      if (hasToken) {
        toast.error("Your session has expired. Please log in again.", {
          id: "session-expired-init",
        });
      }
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (token) {
      getMyDetails()
        .then((res) => {
          if (res.data) setUser(res.data);
          else setUser(null);
        })
        .catch((err) => {
          console.error("Auth sync error:", err);
          logout();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setUser(null);
      setLoading(false);
    }

    // Periodic check every 60 seconds to automatically logout if 7 days expire while tab is open
    const interval = setInterval(() => {
      const activeToken =
        Boolean(localStorage.getItem("accessToken")) ||
        Boolean(localStorage.getItem("refreshToken"));

      if (activeToken && isSessionExpired()) {
        console.warn("Session expired after 7 days during active session.");
        logout();
        toast.error("Your session has expired. Please sign in again.", {
          id: "session-expired-interval",
        });
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
