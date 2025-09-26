import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import AuthButtons from './AuthButtons';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      
      // Update navbar background
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      // Update active section
      const sections = ['benefits', 'features', 'contact'];
      let currentSection = 'home';
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && window.scrollY >= element.offsetTop - 200) {
          currentSection = section;
        }
      }
      
      setActiveSection(currentSection);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
    
    // For the contact button, also scroll to get-in-touch
    if (sectionId === 'contact') {
      const getInTouchElement = document.getElementById('get-in-touch');
      if (getInTouchElement) {
        setTimeout(() => {
          getInTouchElement.scrollIntoView({
            behavior: 'smooth'
          });
        }, 100);
      }
    }
    
    // Close mobile menu if open
    if (isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 py-2 shadow-lg shadow-black/20'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shadow-lg shadow-violet-800/20 relative overflow-hidden">
                <span className="text-white text-xl font-bold z-10">V</span>
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/0 via-white/10 to-violet-600/0 opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
              </div>
              <span className="text-white text-xl font-bold group-hover:opacity-90 transition-opacity">
                Violet <span className="font-light bg-gradient-to-r from-violet-300 to-violet-400 bg-clip-text text-transparent">the Curious</span>
              </span>
            </Link>

            {/* Free Trial Badge */}
            <div className="ml-4 hidden sm:flex items-center">
              <span className="px-3 py-1 text-xs font-medium bg-violet-600/20 text-violet-300 border border-violet-500/30 rounded-full animate-pulse-subtle">
                7-Day Trial
              </span>
            </div>
          </div>
          
          <div className="hidden md:flex space-x-1 items-center">
            <button 
              onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} 
              className={`px-4 py-2 text-gray-300 hover:text-white transition-colors cursor-pointer hover:bg-white/5 rounded-md relative group ${activeSection === 'home' ? 'text-white' : ''}`}
            >
              Home
              {activeSection === 'home' && (
                <span className="absolute bottom-0 left-0 right-0 mx-auto w-1/2 h-0.5 bg-violet-500 rounded-full animate-fade-in"></span>
              )}
              <span className="absolute bottom-0 left-0 right-0 mx-auto w-0 h-0.5 bg-white/30 group-hover:w-1/2 transition-all duration-300"></span>
            </button>
            <button 
              onClick={() => scrollToSection('benefits')} 
              className={`px-4 py-2 text-gray-300 hover:text-white transition-colors cursor-pointer hover:bg-white/5 rounded-md relative group ${activeSection === 'benefits' ? 'text-white' : ''}`}
            >
              Benefits
              {activeSection === 'benefits' && (
                <span className="absolute bottom-0 left-0 right-0 mx-auto w-1/2 h-0.5 bg-violet-500 rounded-full animate-fade-in"></span>
              )}
              <span className="absolute bottom-0 left-0 right-0 mx-auto w-0 h-0.5 bg-white/30 group-hover:w-1/2 transition-all duration-300"></span>
            </button>
            <button 
              onClick={() => scrollToSection('features')} 
              className={`px-4 py-2 text-gray-300 hover:text-white transition-colors cursor-pointer hover:bg-white/5 rounded-md relative group ${activeSection === 'features' ? 'text-white' : ''}`}
            >
              Features
              {activeSection === 'features' && (
                <span className="absolute bottom-0 left-0 right-0 mx-auto w-1/2 h-0.5 bg-violet-500 rounded-full animate-fade-in"></span>
              )}
              <span className="absolute bottom-0 left-0 right-0 mx-auto w-0 h-0.5 bg-white/30 group-hover:w-1/2 transition-all duration-300"></span>
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className={`px-4 py-2 text-gray-300 hover:text-white transition-colors cursor-pointer hover:bg-white/5 rounded-md relative group ${activeSection === 'contact' ? 'text-white' : ''}`}
            >
              Contact
              {activeSection === 'contact' && (
                <span className="absolute bottom-0 left-0 right-0 mx-auto w-1/2 h-0.5 bg-violet-500 rounded-full animate-fade-in"></span>
              )}
              <span className="absolute bottom-0 left-0 right-0 mx-auto w-0 h-0.5 bg-white/30 group-hover:w-1/2 transition-all duration-300"></span>
            </button>
            
            <div className="ml-2">
              <AuthButtons />
            </div>
          </div>
          
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-gray-300 hover:text-white p-2 rounded-md hover:bg-white/10 transition-colors"
            >
              {isOpen ? 
                <X className="h-6 w-6" /> : 
                <Menu className="h-6 w-6" />
              }
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu with improved transitions */}
      {isOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10 animate-fade-in">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <button 
              className={`block w-full text-left px-4 py-3 ${activeSection === 'home' ? 'text-white bg-violet-900/20 border-l-2 border-violet-500' : 'text-gray-300'} hover:text-white hover:bg-violet-900/20 rounded-md transition-all`} 
              onClick={() => {
                window.scrollTo({top: 0, behavior: 'smooth'});
                setIsOpen(false);
              }}
            >
              Home
            </button>
            <button 
              className={`block w-full text-left px-4 py-3 ${activeSection === 'benefits' ? 'text-white bg-violet-900/20 border-l-2 border-violet-500' : 'text-gray-300'} hover:text-white hover:bg-violet-900/20 rounded-md transition-all`} 
              onClick={() => scrollToSection('benefits')}
            >
              Benefits
            </button>
            <button 
              className={`block w-full text-left px-4 py-3 ${activeSection === 'features' ? 'text-white bg-violet-900/20 border-l-2 border-violet-500' : 'text-gray-300'} hover:text-white hover:bg-violet-900/20 rounded-md transition-all`} 
              onClick={() => scrollToSection('features')}
            >
              Features
            </button>
            <button 
              className={`block w-full text-left px-4 py-3 ${activeSection === 'contact' ? 'text-white bg-violet-900/20 border-l-2 border-violet-500' : 'text-gray-300'} hover:text-white hover:bg-violet-900/20 rounded-md transition-all`} 
              onClick={() => scrollToSection('contact')}
            >
              Contact
            </button>
            <div className="px-4 py-3">
              <AuthButtons />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
