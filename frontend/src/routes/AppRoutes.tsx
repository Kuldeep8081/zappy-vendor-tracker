import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import CheckIn from "../pages/CheckIn";
import ProtectedRoute from "../utils/ProtectedRoute";
import EventStart from "../pages/EventStart";
import Setup from "../pages/Setup";
import EventClose from "../pages/EventClose";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/check-in"
        element={
          <ProtectedRoute>
            <CheckIn />
          </ProtectedRoute>
        }
      />

      <Route
        path="/start-event"
        element={
          <ProtectedRoute>
            <EventStart />
          </ProtectedRoute>
        }
      />

      <Route
        path="/setup"
        element={
          <ProtectedRoute>
            <Setup />
          </ProtectedRoute>
        }
      />

      <Route
        path="/close-event"
        element={
          <ProtectedRoute>
            <EventClose />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
