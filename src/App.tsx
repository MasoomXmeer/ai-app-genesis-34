
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/examples" element={<Examples />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/ai-builder" element={
              <ProtectedRoute>
                <AIBuilder />
              </ProtectedRoute>
            } />
            <Route path="/ai-builder-chat" element={
              <ProtectedRoute>
                <AIBuilderChat />
              </ProtectedRoute>
            } />
            <Route path="/multi-file-generator" element={
              <ProtectedRoute>
                <MultiFileGenerator />
              </ProtectedRoute>
            } />
            <Route path="/smart-debugger" element={
              <ProtectedRoute>
                <SmartDebugger />
              </ProtectedRoute>
            } />
            <Route path="/code-optimizer" element={
              <ProtectedRoute>
                <CodeOptimizer />
              </ProtectedRoute>
            } />
            <Route path="/visual-to-code" element={
              <ProtectedRoute>
                <VisualToCode />
              </ProtectedRoute>
            } />
            <Route path="/workflow-builder" element={
              <ProtectedRoute>
                <WorkflowBuilder />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
