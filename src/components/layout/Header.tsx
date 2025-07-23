
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { Brain, LogOut, Settings, User, Shield, Home, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Check if user is admin
  const isAdmin = user?.email === 'admin@example.com' || user?.user_metadata?.role === 'admin';

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-primary to-accent p-2 rounded-lg">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">AI Builder Pro</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {!user ? (
              // Public navigation
              <>
                <Link 
                  to="/features" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActivePath('/features') ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  Features
                </Link>
                <Link 
                  to="/pricing" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActivePath('/pricing') ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  Pricing
                </Link>
                <Link 
                  to="/documentation" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActivePath('/documentation') ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  Documentation
                </Link>
                <Link 
                  to="/examples" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActivePath('/examples') ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  Examples
                </Link>
                <Link 
                  to="/blog" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActivePath('/blog') ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  Blog
                </Link>
              </>
            ) : (
              // Authenticated user navigation
              <>
                <Link 
                  to="/dashboard" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActivePath('/dashboard') ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/ai-builder" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActivePath('/ai-builder') ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  AI Builder
                </Link>
                <Link 
                  to="/multi-file-generator" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActivePath('/multi-file-generator') ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  Multi-File
                </Link>
                <Link 
                  to="/smart-debugger" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActivePath('/smart-debugger') ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  Debugger
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className={`text-sm font-medium transition-colors hover:text-primary ${isActivePath('/admin') ? 'text-primary' : 'text-orange-600'} text-orange-600`}
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">
                    <Home className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/ai-builder">
                  <Button variant="outline" size="sm">
                    AI Builder
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || ''} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user.email?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.user_metadata?.full_name || user.email}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/admin')}>
                          <Shield className="mr-2 h-4 w-4" />
                          Admin Panel
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t">
              {!user ? (
                <>
                  <Link 
                    to="/features" 
                    className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Features
                  </Link>
                  <Link 
                    to="/pricing" 
                    className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                  <Link 
                    to="/documentation" 
                    className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Documentation
                  </Link>
                  <Link 
                    to="/examples" 
                    className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Examples
                  </Link>
                  <Link 
                    to="/blog" 
                    className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Blog
                  </Link>
                  <div className="px-3 py-2 space-y-2">
                    <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    to="/dashboard" 
                    className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/ai-builder" 
                    className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    AI Builder
                  </Link>
                  <Link 
                    to="/multi-file-generator" 
                    className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Multi-File Generator
                  </Link>
                  <Link 
                    to="/smart-debugger" 
                    className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Smart Debugger
                  </Link>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="block px-3 py-2 text-sm font-medium text-orange-600 hover:text-orange-500"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <div className="px-3 py-2 space-y-2">
                    <Link to="/settings" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-destructive hover:text-destructive"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleSignOut();
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
