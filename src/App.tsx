import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Layout from "./components/layout/Layout";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/rider/Dashboard";
import ScheduleRide from "./pages/rides/ScheduleRide";
import EditRide from "./pages/rides/EditRide";

// Import other pages as needed
// import Login from './pages/auth/Login';
// import Register from './pages/auth/Register';
// import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />

          {/* Protected routes wrapped in Layout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rides/new"
            element={
              <ProtectedRoute>
                <ScheduleRide />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rides/:id/edit"
            element={
              <ProtectedRoute>
                <EditRide />
              </ProtectedRoute>
            }
          />

          {/* Auth routes without the main layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
