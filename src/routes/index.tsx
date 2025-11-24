import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import AdminLayout from "../components/AdminLayout";
import AllUsers from "../pages/admin/AllUsers";
import { useAuth } from "../contexts/authContext";
import { Toaster } from "react-hot-toast";

const Index = lazy(() => import("../pages/LandingPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const Trips = lazy(() => import("../pages/admin/TripsPage"));

type RequiredAuthTypes = {
  children: React.ReactNode;
  roles?: string[];
};

const RequireAuth = ({ children, roles }: RequiredAuthTypes) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.some((role) => user.roles?.includes(role))) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return <>{children}</>;
};
const Router = () => {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        }
      >
         <Toaster position="top-center" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          {/* <Route path="/" element={<AdminLayout />}/> */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route
            element={
              <RequireAuth>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/all-users" element={<AllUsers />} />
            <Route path="/trips" element={<Trips />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
