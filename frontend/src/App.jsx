import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import CitoyensPage from "./pages/CitoyensPage";
import DemandesPage from "./pages/DemandesPage";
import UtilisateursPage from "./pages/UtilisateursPage";
import VerifyPage from "./pages/VerifyPage";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1c2030",
              color: "#f0f2ff",
              border: "1px solid rgba(255,255,255,0.08)",
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.875rem",
            },
            success: {
              iconTheme: { primary: "#00d68f", secondary: "#0f1117" },
            },
            error: { iconTheme: { primary: "#ff4d6d", secondary: "#0f1117" } },
          }}
        />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="citoyens" element={<CitoyensPage />} />
            <Route path="demandes" element={<DemandesPage />} />
            <Route path="utilisateurs" element={<UtilisateursPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
