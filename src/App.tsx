
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Blog from "./pages/Blog";
import Documentation from "./pages/Documentation";
import Examples from "./pages/Examples";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import AIBuilder from "./pages/AIBuilder";
import AIBuilderChat from "./pages/AIBuilderChat";
import WorkflowBuilder from "./pages/WorkflowBuilder";
import MultiFileGenerator from "./pages/MultiFileGenerator";
import VisualToCode from "./pages/VisualToCode";
import SmartDebugger from "./pages/SmartDebugger";
import CodeOptimizer from "./pages/CodeOptimizer";
import AdminPanel from "./pages/AdminPanel";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import OAuthCallback from "./pages/OAuthCallback";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Routes with Layout */}
              <Route path="/" element={<Layout><Index /></Layout>} />
              <Route path="/landing" element={<Layout><Landing /></Layout>} />
              <Route path="/features" element={<Layout><Features /></Layout>} />
              <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
              <Route path="/blog" element={<Layout><Blog /></Layout>} />
              <Route path="/docs" element={<Layout><Documentation /></Layout>} />
              <Route path="/examples" element={<Layout><Examples /></Layout>} />
              <Route path="/login" element={<Layout><Login /></Layout>} />
              <Route path="/register" element={<Layout><Register /></Layout>} />
              <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
              <Route path="/settings" element={<Layout><Settings /></Layout>} />
              <Route path="/ai-builder" element={<Layout><AIBuilder /></Layout>} />
              <Route path="/workflow-builder" element={<Layout><WorkflowBuilder /></Layout>} />
              <Route path="/multi-file-generator" element={<Layout><MultiFileGenerator /></Layout>} />
              <Route path="/visual-to-code" element={<Layout><VisualToCode /></Layout>} />
              <Route path="/smart-debugger" element={<Layout><SmartDebugger /></Layout>} />
              <Route path="/code-optimizer" element={<Layout><CodeOptimizer /></Layout>} />
              <Route path="/admin" element={<Layout><AdminPanel /></Layout>} />
              <Route path="/terms" element={<Layout><Terms /></Layout>} />
              <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
              <Route path="/oauth/callback" element={<Layout><OAuthCallback /></Layout>} />
              
              {/* Full-screen routes without Layout */}
              <Route path="/ai-builder-chat" element={<AIBuilderChat />} />
              
              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
