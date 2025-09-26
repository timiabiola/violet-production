
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import ParticleBackground from './ParticleBackground';
import ReviewRequestForm from './ReviewRequestForm';
import { useAuth } from '@/contexts/AuthContext';

const HeroSection = () => {
  const {
    user
  } = useAuth();
  
  const scrollToContact = () => {
    const contactSection = document.getElementById('get-in-touch');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return <section id="overview" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-black">
      <ParticleBackground />
      
      {/* Decorative elements */}
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl"></div>
      <div className="absolute top-40 -right-20 w-72 h-72 bg-violet-800/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-4 h-4 bg-violet-400 rounded-full animate-pulse-glow"></div>
      <div className="absolute top-1/3 left-10 w-3 h-3 bg-violet-300 rounded-full animate-pulse-glow" style={{
      animationDelay: '1s'
    }}></div>
      
      <div className="container mx-auto px-4 py-20 z-10 relative">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 lg:pr-8 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-600/20 border border-violet-500/30 rounded-full mb-4 animate-fade-in">
                <span className="text-sm font-medium text-violet-300">🎉 7-Day Free Trial</span>
              </div>

              <h1 className="font-heading text-white mb-2 animate-fade-in">
                Elevate Your <span className="text-gradient">Business</span> Online
              </h1>

              <p className="subtitle mb-8 animate-fade-in opacity-0" style={{
              animationDelay: "0.2s"
            }}>
                Get more 5-star reviews and watch your business grow.
                Start free today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in opacity-0" style={{
              animationDelay: "0.3s"
            }}>
                {!user ? (
                  <Link to="/auth?tab=signup">
                    <Button
                      size="lg"
                      className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-6 rounded-md text-lg button-glow"
                    >
                      Start 7-Day Free Trial
                    </Button>
                  </Link>
                ) : (
                  <Link to="/dashboard">
                    <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-6 rounded-md text-lg button-glow">
                      Go to Dashboard
                    </Button>
                  </Link>
                )}
                
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 rounded-md text-lg relative group" asChild>
                  <a href="#how-it-works">
                    Learn More
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-violet-400 group-hover:w-4/5 transition-all duration-300"></span>
                  </a>
                </Button>
              </div>
              
              {/* Free Trial CTA Text */}
              <div className="text-center sm:text-left animate-fade-in opacity-0" style={{
              animationDelay: "0.4s"
            }}>
                <p className="text-sm text-gray-300">No credit card required • Cancel anytime</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 animate-fade-in opacity-0" style={{
              animationDelay: "0.5s"
            }}>
                <div className="text-center">
                  <div className="text-2xl font-bold text-violet-400">7-Day Trial</div>
                  <div className="text-sm text-gray-400">No strings attached</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-violet-400">Higher Revenue</div>
                  <div className="text-sm text-gray-400">From trusted reviews</div>
                </div>
                <div className="text-center sm:col-span-1 col-span-2">
                  <div className="text-2xl font-bold text-violet-400">Top Results</div>
                  <div className="text-sm text-gray-400">Where customers click</div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 flex justify-center items-center animate-fade-in opacity-0" style={{
            animationDelay: "0.4s"
          }}>
              <div className="glass-card p-7 rounded-2xl max-w-md w-full relative">
                <div className="absolute -top-3 -left-3 w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br from-violet-600/20 to-transparent rounded-full blur-xl"></div>
                <ReviewRequestForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};

export default HeroSection;
