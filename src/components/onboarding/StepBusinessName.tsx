import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Store,
  Briefcase
} from 'lucide-react';
import { toast } from 'sonner';

interface StepBusinessNameProps {
  businessName: string;
  setBusinessName: (name: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
}

const StepBusinessName: React.FC<StepBusinessNameProps> = ({
  businessName,
  setBusinessName,
  onNext,
  onPrevious,
  onSkip,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleNext = () => {
    if (!businessName.trim()) {
      toast.error('Please enter your business name');
      return;
    }
    onNext();
  };

  const examples = [
    { icon: Store, text: "Violet Medical Center" },
    { icon: Briefcase, text: "Dr. Smith's Clinic" },
    { icon: Building2, text: "Wellness Healthcare Group" },
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

        {/* Floating decorative elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-10 right-10 opacity-10"
        >
          <Building2 className="h-24 w-24 text-violet-600" />
        </motion.div>

        <div className="relative p-10 space-y-8">
          {/* Icon with animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="relative">
              <motion.div
                animate={{
                  scale: isFocused ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
                className="p-6 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl shadow-2xl"
              >
                <Building2 className="h-14 w-14 text-white" />
              </motion.div>
              {isFocused && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -inset-2 bg-violet-400/20 rounded-3xl blur-xl"
                />
              )}
            </div>
          </motion.div>

          {/* Title and description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center space-y-3"
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              What's your business name?
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              This helps us personalize your dashboard and review requests
            </p>
          </motion.div>

          {/* Input field with enhanced styling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <Label htmlFor="business-name" className="text-gray-700 font-medium">
              Business Name
            </Label>
            <div className="relative">
              <Input
                id="business-name"
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Enter your business name"
                className={`
                  px-5 py-3 text-lg bg-white border-2 transition-all duration-300
                  ${isFocused
                    ? 'border-violet-400 shadow-lg shadow-violet-200/50 scale-[1.02]'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
                autoFocus
              />
              <motion.div
                animate={{ opacity: businessName ? 1 : 0 }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <CheckCircle className="h-5 w-5 text-green-500" />
              </motion.div>
            </div>
            <p className="text-xs text-gray-500">
              This will be displayed on your review requests and dashboard
            </p>
          </motion.div>

          {/* Example badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <p className="text-sm text-gray-600 text-center">Examples:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {examples.map((example, index) => {
                const Icon = example.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setBusinessName(example.text)}
                    className="cursor-pointer"
                  >
                    <Badge className="px-3 py-1.5 bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100 transition-colors">
                      <Icon className="h-3 w-3 mr-1" />
                      {example.text}
                    </Badge>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Tip card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-200"
          >
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-violet-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Pro Tip</p>
                <p className="text-sm text-gray-600 mt-1">
                  Use your full business name as it appears on Google Business for better SEO
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-3 pt-4"
          >
            <Button
              onClick={onPrevious}
              variant="outline"
              size="lg"
              className="sm:flex-1"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Previous
            </Button>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="sm:flex-1"
            >
              <Button
                onClick={handleNext}
                size="lg"
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg transition-all duration-300 group"
              >
                Continue
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Skip option */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <Button
              onClick={onSkip}
              variant="ghost"
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Skip this step
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export default StepBusinessName;