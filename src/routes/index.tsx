import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import { useAuth } from "../contexts/authContext";
import { Toaster } from "react-hot-toast";
import { CreateTrip } from "../pages/trip/CreateTrip";
import TravelLoader from "../components/TravelLoader";

const TripDetails = lazy(() => import("../pages/trip/TripDetails"));
const LandingLayout = lazy(() => import("../pages/LandingLayout"));
const CreateUser = lazy(() => import("../pages/admin/CreateUser"));
const UpdateTrip = lazy(() => import("../pages/trip/UpdateTrip"));
const ThankyouMessage = lazy(() => import("../components/ThankyouMessage"));
const UserDashboard = lazy(() => import("../pages/user/UserDashboard"));
const ChatRoom = lazy(() => import("../pages/admin/ChatRoom"));
const Notifications = lazy(() => import("../pages/Notifications"));
const AdminLayout = lazy(() => import("../pages/AdminLayout"));
const Index = lazy(() => import("../pages/LandingPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const Trips = lazy(() => import("../pages/admin/TripsPage"));
const AllUsers = lazy(() => import("../pages/admin/AllUsers"));

type RequiredAuthTypes = {
  children: React.ReactNode;
  roles?: string[];
};

const RequireAuth = ({ children, roles }: RequiredAuthTypes) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.some((role) => user.roles?.includes(role))) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold mb-2 text-red-600">Access Denied</h2>
        <p className="text-gray-600 mb-4">You do not have permission to view this page.</p>
        <a href="/" className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Return Home
        </a>
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
            <TravelLoader />
          </div>
        }
      >
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#363636',
            },
          }}
        />
        <Routes>
          {/* Landing Page with Layout */}
          <Route element={<LandingLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/trip/:tripId" element={<TripDetails />} />
          </Route>

          {/* Protected Payment Routes */}
          <Route
            element={
              <RequireAuth>
                <LandingLayout />
              </RequireAuth>
            }
          >
            <Route path="/customer/dashboard" element={<UserDashboard />} />
            <Route path="/trip/payment/success" element={<ThankyouMessage />} />
          </Route>

          {/* Auth Pages - Full Page (No Layout) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Admin Routes (LOG-10: guarded with ADMIN and SUPERADMIN) */}
          <Route
            element={
              <RequireAuth roles={["ADMIN", "SUPERADMIN"]}>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/all-users" element={<AllUsers />} />
            <Route path="/admin/trips" element={<Trips />} />
            <Route path="/admin/user/create" element={<CreateUser />} />
            <Route path="/admin/chats" element={<ChatRoom />} />
            <Route path="/admin/notifications" element={<Notifications />} />
            <Route path="/admin/trip/create" element={<CreateTrip />} />
            <Route path="/admin/trip/:tripId" element={<TripDetails />} />
            <Route path="/admin/trip/edit/:tripId" element={<UpdateTrip />} />
          </Route>

          {/* 404 Wildcard Route (ENH-14) */}
          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-gray-50">
                <h1 className="text-6xl font-bold text-blue-500 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
                <p className="text-gray-600 mb-6 max-w-md">The page you are looking for does not exist or may have been moved.</p>
                <a
                  href="/"
                  className="px-6 py-2.5 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors shadow-md"
                >
                  Return to Home
                </a>
              </div>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
