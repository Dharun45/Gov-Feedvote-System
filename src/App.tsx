import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "./pages/Landing";
import BuildingList from "./pages/BuildingList";
import EmployeeList from "./pages/EmployeeList";
import FeedbackForm from "./pages/FeedbackForm";
import Success from "./pages/Success";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import BuildingAdminDashboard from "./pages/BuildingAdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProfilePage from "./pages/ProfilePage";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/buildings" element={<BuildingList />} />
          <Route path="/buildings/employees" element={<EmployeeList />} />
          <Route path="/feedback" element={<FeedbackForm />} />
          <Route path="/success" element={<Success />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected: any logged-in admin */}
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* Protected: admin dashboard (legacy) */}
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

          {/* Protected: user */}
          <Route path="/user/dashboard" element={<UserDashboard />} />

          {/* Protected: Building Admin */}
          <Route
            path="/building-admin/dashboard"
            element={<ProtectedRoute allowedRoles={['BUILDING_ADMIN']}><BuildingAdminDashboard /></ProtectedRoute>}
          />

          {/* Protected: Super Admin only */}
          <Route
            path="/superadmin/dashboard"
            element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']}><SuperAdminDashboard /></ProtectedRoute>}
          />
          <Route
            path="/analytics"
            element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']}><AnalyticsDashboard /></ProtectedRoute>}
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
