import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  ArrowRight,
  Star,
  Zap,
  Heart,
  Shield,
  TrendingUp,
  Award
} from 'lucide-react';

interface StepWelcomeProps {
  onNext: () => void;
  onSkip: () => void;
}

const StepWelcome: React.FC<StepWelcomeProps> = ({ onNext, onSkip }) => {
  const floatingIcons = [
    { icon: Star, delay: 0, x: -100, y: -50 },
    { icon: Heart, delay: 0.2, x: 100, y: -80 },
    { icon: Shield, delay: 0.4, x: -120, y: 50 },
    { icon: TrendingUp, delay: 0.6, x: 80, y: 40 },
    { icon: Award, delay: 0.8, x: 0, y: -100 },
  ];

  const benefits = [
    "Collect 5-star reviews effortlessly",
    "Smart filtering for Google Reviews",
    "Real-time analytics dashboard",
    "Boost your online reputation"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="relative overflow-hidden backdrop-blur-xl bg-white/90 border-white/20 shadow-2xl">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-100/50 via-purple-100/50 to-pink-100/50" />

        {/* Floating icons animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {floatingIcons.map(({ icon: Icon, delay, x, y }, index) => (
            <motion.div
              key={index}
              className="absolute left-1/2 top-1/2"
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{
                x: [0, x, 0],
                y: [0, y, 0],
                opacity: [0, 0.15, 0],
              }}
              transition={{
                duration: 8,
                delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Icon className="h-12 w-12 text-violet-400" />
            </motion.div>
          ))}
        </div>

        <div className="relative p-10 text-center space-y-8">
          {/* Main icon with pulse effect */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="inline-flex items-center justify-center"
          >
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-violet-400 rounded-full blur-2xl"
              />
              <div className="relative p-6 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl shadow-2xl">
                <Sparkles className="h-16 w-16 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Welcome text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to Violet! ✨
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Let's set up your review collection system in just 2 minutes
            </p>
          </motion.div>

          {/* Benefits badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Badge className="px-3 py-1.5 bg-violet-100 text-violet-700 border-violet-200">
                  <Zap className="h-3 w-3 mr-1" />
                  {benefit}
                </Badge>
              </motion.div>
            ))}
          </motion.div>

          {/* Progress indicator */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-4"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Quick Setup Process</span>
              <span className="font-semibold text-violet-600">3 Simple Steps</span>
            </div>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
                initial={{ width: "0%" }}
                animate={{ width: "10%" }}
                transition={{ delay: 1, duration: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-3 pt-4"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1"
            >
              <Button
                onClick={onNext}
                size="lg"
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg transition-all duration-300 group"
              >
                Let's Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
            <Button
              onClick={onSkip}
              variant="outline"
              size="lg"
              className="sm:flex-1"
            >
              Skip for Now
            </Button>
          </motion.div>

          {/* Trust indicator */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-xs text-gray-500"
          >
            🔒 Your information is secure and never shared
          </motion.p>
        </div>
      </Card>
    </motion.div>
  );
};

export default StepWelcome;