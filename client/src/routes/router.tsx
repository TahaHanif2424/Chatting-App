import { createBrowserRouter } from "react-router-dom";
import AuthPage from "../pages/auth/AuthPage";
import Dashboard from "../pages/Dashboard/Dashboard";

const router = createBrowserRouter([
    { path: '/auth', element: <AuthPage /> },
    { path: '/dashboard', element: <Dashboard /> },
]);
export default router;