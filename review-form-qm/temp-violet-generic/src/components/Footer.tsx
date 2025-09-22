import React from 'react';
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return <footer className="bg-black/50 py-12">
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
              <li><a href="#overview" className="text-gray-400 hover:text-white transition">Overview</a></li>
              <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition">How It Works</a></li>
              <li><a href="#benefits" className="text-gray-400 hover:text-white transition">Benefits</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white transition">Contact</a></li>
              <li><a href="/auth" className="text-gray-400 hover:text-white transition">Login</a></li>
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