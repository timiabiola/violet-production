import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, Zap, Shield, Clock } from 'lucide-react';

const FreeTrialSection = () => {
  const features = [
    {
      icon: Clock,
      title: "See Results in 7 Days",
      description: "Watch your online reputation transform within your first week"
    },
    {
      icon: Shield,
      title: "No Credit Card Required",
      description: "Start immediately without any payment information"
    },
    {
      icon: Zap,
      title: "Full Feature Access",
      description: "Experience everything Violet has to offer"
    },
    {
      icon: Check,
      title: "Cancel Anytime",
      description: "No strings attached - complete flexibility"
    }
  ];

  return (
    <section id="free-trial" className="py-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-800/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600/20 border border-violet-500/30 rounded-full mb-6">
            <span className="text-sm font-medium text-violet-300">Limited Time Offer</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Start Your <span className="text-gradient">7-Day Free Trial</span> Today
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the power of intelligent reputation management with absolutely no commitment.
            See real results before you decide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="glass-card p-6 rounded-xl border border-white/10 hover:border-violet-500/30 transition-all duration-300 hover:scale-105 animate-fade-in opacity-0"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <div className="mb-4">
                  <div className="w-12 h-12 bg-violet-600/20 rounded-lg flex items-center justify-center">
                    <Icon className="h-6 w-6 text-violet-400" />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>

                <p className="text-gray-400 text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link to="/auth">
            <Button
              size="lg"
              className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white px-10 py-6 text-lg shadow-lg shadow-violet-900/30 hover:shadow-xl hover:shadow-violet-900/40 transition-all duration-300 button-glow"
            >
              Start Free Trial
            </Button>
          </Link>

          <p className="text-sm text-gray-400 mt-4">
            No credit card required • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default FreeTrialSection;