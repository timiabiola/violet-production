import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  ArrowRight,
  Sparkles,
  Trophy,
  Star,
  Rocket,
  Shield,
  TrendingUp,
  Award,
  ArrowLeft
} from 'lucide-react';
import ConfettiExplosion from './ConfettiExplosion';

interface StepCompletionProps {
  businessName: string;
  onComplete: () => void;
  onPrevious: () => void;
}

const StepCompletion: React.FC<StepCompletionProps> = ({ businessName, onComplete, onPrevious }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    setShowConfetti(true);
  }, []);

  const achievements = [
    { icon: Award, label: 'Early Adopter', color: 'from-amber-400 to-orange-500' },
    { icon: Rocket, label: 'Quick Setup', color: 'from-blue-400 to-cyan-500' },
    { icon: Star, label: 'Review Master', color: 'from-violet-400 to-purple-500' },
  ];

  const features = [
    {
      icon: CheckCircle,
      title: 'Review Form Ready',
      description: 'Start collecting customer feedback immediately',
      color: 'from-green-400 to-emerald-500',
      delay: 0.1
    },
    {
      icon: Sparkles,
      title: 'Smart Review Management',
      description: 'Intelligently route satisfied customers to Google',
      color: 'from-violet-400 to-purple-500',
      delay: 0.2
    },
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      description: 'Track your reputation metrics over time',
      color: 'from-blue-400 to-cyan-500',
      delay: 0.3
    },
    {
      icon: Shield,
      title: 'Reputation Protected',
      description: 'Build trust with authentic customer feedback',
      color: 'from-pink-400 to-rose-500',
      delay: 0.4
    }
  ];

  return (
    <>
      <ConfettiExplosion trigger={showConfetti} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Main celebration card with glassmorphism */}
        <Card className="relative overflow-hidden backdrop-blur-xl bg-white/80 border-white/20 shadow-2xl">
          {/* Animated gradient border */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 opacity-20 animate-pulse" />

          <div className="relative p-12 text-center space-y-8">
            {/* Trophy animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 1 }}
              className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-2xl"
            >
              <Trophy className="h-16 w-16 text-white" />
            </motion.div>

            {/* Welcome message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                Welcome Aboard, {businessName || 'there'}! 🎉
              </h2>
              <p className="mt-3 text-lg text-gray-600">
                Your review collection system is now live and ready to boost your reputation!
              </p>
            </motion.div>

            {/* Achievement badges */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center gap-4 flex-wrap"
            >
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Badge className={`px-4 py-2 bg-gradient-to-r ${achievement.color} text-white border-0 shadow-lg`}>
                      <Icon className="h-4 w-4 mr-2" />
                      {achievement.label}
                    </Badge>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Feature cards */}
            <div className="grid md:grid-cols-2 gap-4 mt-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: feature.delay }}
                    whileHover={{ scale: 1.02 }}
                    onHoverStart={() => setHoveredCard(index)}
                    onHoverEnd={() => setHoveredCard(null)}
                  >
                    <Card className={`
                      p-6 border-2 transition-all duration-300 bg-white
                      ${hoveredCard === index
                        ? 'border-violet-400 shadow-xl shadow-violet-200/50'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}>
                      <div className="flex items-start gap-4">
                        <div className={`
                          p-3 rounded-xl bg-gradient-to-br ${feature.color}
                          ${hoveredCard === index ? 'animate-pulse' : ''}
                        `}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-left flex-1">
                          <h3 className="font-semibold text-gray-900 text-base">{feature.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* What's Next section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="p-6 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h3>
              <ul className="space-y-3 text-left">
                <li className="flex items-start gap-3">
                  <div className="mt-1">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Share your review form link</p>
                    <p className="text-xs text-gray-600 mt-0.5">Send it to customers via email or SMS</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1">
                    <Star className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Collect customer feedback</p>
                    <p className="text-xs text-gray-600 mt-0.5">Happy customers are directed to Google Reviews</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Monitor your dashboard</p>
                    <p className="text-xs text-gray-600 mt-0.5">Track feedback trends and insights</p>
                  </div>
                </li>
              </ul>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Button
                onClick={onPrevious}
                variant="outline"
                size="lg"
                className="sm:flex-1"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Go Back
              </Button>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="sm:flex-1"
              >
                <Button
                  onClick={onComplete}
                  size="lg"
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <Rocket className="mr-3 h-6 w-6" />
                  Launch Your Review System
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </Card>
      </motion.div>

      <style jsx global>{`
        @keyframes gradient {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </>
  );
};

export default StepCompletion;