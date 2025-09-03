import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthPage from "../pages/auth/AuthPage";
import Dashboard from "../pages/Dashboard/Dashboard";
import ErrorPage from "../components/a-level/Error";
import ProtectedRoute from "../components/ProtectedRoute";

const router = createBrowserRouter([
    { path: '/', element: <Navigate to="/dashboard" replace /> },
    { path: '/auth', element: <AuthPage /> },
    { 
        path: '/dashboard', 
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ) 
    },
    { path: '/*', element: <ErrorPage /> },
]);
export default router;