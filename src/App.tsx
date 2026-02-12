import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SimulationProvider } from "@/context/SimulationContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import DevToolbar from "@/components/debug/DevToolbar";

import LandingPage from "./pages/LandingPage";
import SimulatorPage from "./pages/SimulatorPage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import SimulationResults from "./pages/SimulationResults";
import InputDataPage from "./pages/InputDataPage";
import ReportsPage from "./pages/ReportsPage";
import TestSimulation from "./pages/TestSimulation";
import RetirementPlannerPage from "./pages/RetirementPlannerPage";
import { SimulatorLifeWeaver } from "./pages/SimulatorLifeWeaver";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <SimulationProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/simulator" element={<SimulatorPage />} />
                <Route path="/simulation-results" element={<SimulationResults />} />
                <Route path="/input-data" element={<InputDataPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/retirement-planner" element={<RetirementPlannerPage />} />
                <Route path="/simulator/life-weaver" element={<SimulatorLifeWeaver />} />

                {/* Dev/Test Routes (Protected for now, or move to public if needed) */}
                <Route path="/test-simulation" element={<TestSimulation />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <DevToolbar />
          </BrowserRouter>
        </SimulationProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
