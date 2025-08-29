import { createBrowserRouter } from "react-router-dom";
import AuthPage from "../pages/auth/AuthPage";
import Dashboard from "../pages/Dashboard/Dashboard";
import ErrorPage from "../components/a-level/Error";

const router = createBrowserRouter([
    { path: '/auth', element: <AuthPage /> },
    { path: '/dashboard', element: <Dashboard /> },
    { path: '/*', element: <ErrorPage /> },
]);
export default router;