import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, BarChart3, Settings, LogIn, Home } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { user } = useAuth();

  return <footer className="bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-heading font-bold text-gradient">Violet</span>
              <span className="text-lg ml-2 font-heading font-light text-white">the Curious</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Enlightened Informatics' premiere data gathering & feedback system for reputation management designed for businesses of all types.
            </p>

          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {user ? (
                <>
                  <li>
                    <Link to="/review-form" className="text-gray-400 hover:text-white transition flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Review Form
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard" className="text-gray-400 hover:text-white transition flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Analytics
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile" className="text-gray-400 hover:text-white transition flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Profile Settings
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/" className="text-gray-400 hover:text-white transition flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      Home
                    </Link>
                  </li>
                  <li><a href="#overview" className="text-gray-400 hover:text-white transition">Overview</a></li>
                  <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition">How It Works</a></li>
                  <li><a href="#benefits" className="text-gray-400 hover:text-white transition">Benefits</a></li>
                  <li>
                    <Link to="/auth" className="text-gray-400 hover:text-white transition flex items-center gap-2">
                      <LogIn className="w-4 h-4" />
                      Login
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Enlightened Informatics. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-white text-sm transition">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-white text-sm transition">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-white text-sm transition">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;