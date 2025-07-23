
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Layout from "@/components/layout/Layout";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import AIBuilder from "./pages/AIBuilder";
import AIBuilderChat from "./pages/AIBuilderChat";
import MultiFileGenerator from "./pages/MultiFileGenerator";
import SmartDebugger from "./pages/SmartDebugger";
import CodeOptimizer from "./pages/CodeOptimizer";
import VisualToCode from "./pages/VisualToCode";
import WorkflowBuilder from "./pages/WorkflowBuilder";
import AdminPanel from "./pages/AdminPanel";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Documentation from "./pages/Documentation";
import Examples from "./pages/Examples";
import Blog from "./pages/Blog";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes with Layout */}
            <Route path="/" element={<Layout><Landing /></Layout>} />
            <Route path="/auth" element={<Layout><Auth /></Layout>} />
            <Route path="/login" element={<Layout><Login /></Layout>} />
            <Route path="/register" element={<Layout><Register /></Layout>} />
            <Route path="/features" element={<Layout><Features /></Layout>} />
            <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
            <Route path="/documentation" element={<Layout><Documentation /></Layout>} />
            <Route path="/examples" element={<Layout><Examples /></Layout>} />
            <Route path="/blog" element={<Layout><Blog /></Layout>} />
            <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
            <Route path="/terms" element={<Layout><Terms /></Layout>} />
            
            {/* Protected Routes with Layout */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/app" element={
              <ProtectedRoute>
                <Layout><Index /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Layout><Settings /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/ai-builder" element={
              <ProtectedRoute>
                <Layout><AIBuilder /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/ai-builder-chat" element={
              <ProtectedRoute>
                <Layout><AIBuilderChat /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/multi-file-generator" element={
              <ProtectedRoute>
                <Layout><MultiFileGenerator /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/smart-debugger" element={
              <ProtectedRoute>
                <Layout><SmartDebugger /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/code-optimizer" element={
              <ProtectedRoute>
                <Layout><CodeOptimizer /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/visual-to-code" element={
              <ProtectedRoute>
                <Layout><VisualToCode /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/workflow-builder" element={
              <ProtectedRoute>
                <Layout><WorkflowBuilder /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <Layout><AdminPanel /></Layout>
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
