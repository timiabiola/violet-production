import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  User,
  LogOut,
  Settings,
  ChevronDown,
  FileText,
  Menu,
  X,
  BarChart3
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const AuthNavbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { path: '/review-form', label: 'Review Form', icon: FileText },
    { path: '/dashboard', label: 'Analytics', icon: BarChart3 },
    { path: '/profile', label: 'Profile', icon: Settings },
  ];

  return (
    <nav className="bg-black border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/review-form" className="flex items-center gap-2 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shadow-lg shadow-violet-800/20 relative overflow-hidden">
                <span className="text-white text-xl font-bold z-10">V</span>
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/0 via-white/10 to-violet-600/0 opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
              </div>
              <span className="text-white text-xl font-bold group-hover:opacity-90 transition-opacity">
                Violet <span className="font-light bg-gradient-to-r from-violet-300 to-violet-400 bg-clip-text text-transparent">the Curious</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                  location.pathname === item.path
                    ? 'bg-violet-600/20 text-violet-300'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 text-gray-300 hover:text-white">
                  <User className="w-4 h-4" />
                  <span className="hidden lg:inline">{user?.email}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-black border-white/10">
                <DropdownMenuItem
                  onClick={() => navigate('/profile')}
                  className="text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-md hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ?
                <X className="h-6 w-6" /> :
                <Menu className="h-6 w-6" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-md transition-all flex items-center gap-2 ${
                  location.pathname === item.path
                    ? 'bg-violet-900/20 text-white border-l-2 border-violet-500'
                    : 'text-gray-300 hover:text-white hover:bg-violet-900/20'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}

            <div className="pt-2 border-t border-white/10">
              <div className="px-4 py-2 text-gray-400 text-sm">
                {user?.email}
              </div>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-violet-900/20 rounded-md transition-all flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AuthNavbar;