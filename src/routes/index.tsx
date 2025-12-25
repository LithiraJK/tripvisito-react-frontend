import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import AdminLayout from "../components/AdminLayout";
import AllUsers from "../pages/admin/AllUsers";
import { useAuth } from "../contexts/authContext";
import { Toaster } from "react-hot-toast";
import { CreateTrip } from "../pages/trip/CreateTrip";
import TripDetails from "../pages/trip/TripDetails";
import LandingLayout from "../components/LandingLayout";
import CreateUser from "../pages/admin/CreateUser";
import UpdateTrip from "../pages/trip/UpdateTrip";
import Payment from "../pages/trip/Payment";
import ThankyouMessage from "../components/ThankyouMessage";

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
        <Toaster position="top-right" />
        <Routes>
          {/* Landing Page with Layout */}
          <Route element={<LandingLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/trip/:tripId" element={<TripDetails />} />
            <Route path="/trip/payment" element={<Payment />} />
            <Route path="/trip/payment/success" element={<ThankyouMessage />} />



          </Route>

          {/* Auth Pages - Full Page (No Layout) */}
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
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/all-users" element={<AllUsers />} />
            <Route path="/admin/trips" element={<Trips />} />
            <Route path="/admin/user/create" element={<CreateUser />} />
          </Route>
          <Route
            element={
              <RequireAuth roles={["ADMIN"]}>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route path="/admin/trip/create" element={<CreateTrip />} />
            {/* Dynamic Routes */}
            <Route path="/admin/trip/:tripId" element={<TripDetails />} />
            <Route path="/admin/trip/edit/:tripId" element={<UpdateTrip/>} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
