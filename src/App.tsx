import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { UserRole } from "./types/enums";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import RouteGuard from "./components/RouteGuard";

// Public Pages
import LandingPage from "./pages/LandingPage";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// Driver (Rider) Pages
import Dashboard from "./pages/rider/Dashboard";
import ScheduleRide from "./pages/rides/ScheduleRide";
import EditRide from "./pages/rides/EditRide";

// Common Pages
import Profile from "./pages/profile/Profile";
import Settings from "./pages/profile/Settings";
// Student Pages
import UserDashboard from "./pages/user/Dashboard";
import UserHistory from "./pages/user/UserHistory";
import RiderHistory from "./pages/rider/RiderHistory";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Driver (Rider) Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <RouteGuard allowedRoles={[UserRole.DRIVER]}>
                  <Dashboard />
                </RouteGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/rides/*"
            element={
              <ProtectedRoute>
                <RouteGuard allowedRoles={[UserRole.DRIVER]}>
                  <Routes>
                    <Route path="new" element={<ScheduleRide />} />
                    <Route path=":id/edit" element={<EditRide />} />
                    <Route path="history" element={<RiderHistory />} />
                  </Routes>
                </RouteGuard>
              </ProtectedRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="/user/*"
            element={
              <ProtectedRoute>
                <RouteGuard allowedRoles={[UserRole.STUDENT]}>
                  <Routes>
                    <Route path="dashboard" element={<UserDashboard />} />
                    <Route path="history" element={<UserHistory />} />
                    {/* Add additional student routes here */}
                  </Routes>
                </RouteGuard>
              </ProtectedRoute>
            }
          />

          {/* Common Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route index element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                </Routes>
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/history"
            element={
              <ProtectedRoute>
                <UserHistory />
              </ProtectedRoute>
            }
          /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
