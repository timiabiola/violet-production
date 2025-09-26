import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const FreeTrialSection = () => {
  const benefits = [
    "7 days free • No credit card required",
    "Full access to all features",
    "See real results before committing",
    "Cancel anytime • No strings attached"
  ];

  return (
    <section id="free-trial" className="py-16 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-800/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Card */}
          <div className="glass-card p-10 rounded-2xl border border-violet-500/20 bg-violet-900/10 backdrop-blur-sm animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Try Violet <span className="text-gradient">Free for 7 Days</span>
            </h2>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join hundreds of businesses improving their online reputation and driving more revenue.
            </p>

            {/* Benefits List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 max-w-2xl mx-auto">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-left"
                >
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-violet-600/30 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-violet-400" />
                    </div>
                  </div>
                  <span className="text-gray-200">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Link to="/auth?tab=signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white px-12 py-6 text-lg shadow-lg shadow-violet-900/30 hover:shadow-xl hover:shadow-violet-900/40 transition-all duration-300 button-glow"
              >
                Start Your Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreeTrialSection;