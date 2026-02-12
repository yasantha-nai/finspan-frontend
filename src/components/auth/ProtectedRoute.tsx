import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { CircularProgress, Box } from "@mui/material";

export const ProtectedRoute = () => {
    const { user, userProfile, loading } = useAuth();
    const location = useLocation();

    // DEV MODE: Bypass authentication in development
    const isDev = import.meta.env.DEV;
    if (isDev) {
        return <Outlet />;
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If user is authenticated but hasn't completed onboarding, redirect to /simulator (the real onboarding)
    // Exception: If we are already on the simulator page to avoid infinite loop
    if (userProfile && !userProfile.onboardingCompleted && location.pathname !== '/simulator') {
        return <Navigate to="/simulator" replace />;
    }

    return <Outlet />;
};
