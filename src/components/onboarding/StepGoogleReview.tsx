import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Link2,
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  ExternalLink,
  MapPin,
  Star,
  CheckCircle,
  Copy
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface StepGoogleReviewProps {
  googleReviewUrl: string;
  setGoogleReviewUrl: (url: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
}

const StepGoogleReview: React.FC<StepGoogleReviewProps> = ({
  googleReviewUrl,
  setGoogleReviewUrl,
  onNext,
  onPrevious,
  onSkip,
}) => {
  const [showExample, setShowExample] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleNext = () => {
    if (googleReviewUrl && !isValidUrl(googleReviewUrl)) {
      toast.error('Please enter a valid URL');
      return;
    }
    onNext();
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const copyExample = () => {
    const exampleUrl = 'https://g.page/r/CXvKP8mG5LZ9EBM/review';
    navigator.clipboard.writeText(exampleUrl);
    setGoogleReviewUrl(exampleUrl);
    toast.success('Example URL copied!');
  };

  const steps = [
    { icon: MapPin, text: "Find your business on Google Maps" },
    { icon: Star, text: "Click 'Get more reviews'" },
    { icon: Copy, text: "Copy the review link" },
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

        {/* Floating link animation */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-10 right-10 opacity-10"
        >
          <Link2 className="h-24 w-24 text-violet-600" />
        </motion.div>

        <div className="relative p-10 space-y-8">
          {/* Icon with pulse effect */}
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
                <Link2 className="h-14 w-14 text-white" />
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
              Add your Google Review link
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Connect your Google Business to direct 5-star reviews automatically
            </p>
          </motion.div>

          {/* Input field with enhanced styling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <Label htmlFor="google-review" className="text-gray-700 font-medium">
                Google Business Review URL
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Your Google Business review link allows customers to leave reviews directly on your Google Business Profile</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="relative">
              <Input
                id="google-review"
                type="url"
                value={googleReviewUrl}
                onChange={(e) => setGoogleReviewUrl(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="https://g.page/r/..."
                className={`
                  px-5 py-3 text-lg text-gray-900 bg-white border-2 transition-all duration-300 placeholder:text-gray-400
                  ${isFocused
                    ? 'border-violet-400 shadow-lg shadow-violet-200/50 scale-[1.02]'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              />
              <motion.div
                animate={{ opacity: googleReviewUrl && isValidUrl(googleReviewUrl) ? 1 : 0 }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <CheckCircle className="h-5 w-5 text-green-500" />
              </motion.div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-violet-600 hover:text-violet-700"
              onClick={() => setShowExample(!showExample)}
            >
              {showExample ? 'Hide' : 'Show'} example
              <ExternalLink className="ml-2 h-3 w-3" />
            </Button>
          </motion.div>

          {/* Example URL card */}
          <AnimatePresence>
            {showExample && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Card className="bg-violet-50 border-violet-200 p-4">
                  <div className="flex items-center justify-between">
                    <code className="text-sm text-violet-700 font-mono">
                      https://g.page/r/CXvKP8mG5LZ9EBM/review
                    </code>
                    <Button
                      onClick={copyExample}
                      variant="ghost"
                      size="sm"
                      className="text-violet-600 hover:text-violet-700"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* How to find steps */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            <p className="text-sm font-medium text-gray-700 text-center">How to find your link:</p>
            <div className="grid grid-cols-3 gap-3">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="text-center"
                  >
                    <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 mx-auto">
                      <Icon className="h-8 w-8 text-violet-500 mx-auto mb-2" />
                      <p className="text-xs text-gray-600">{step.text}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Benefits badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap justify-center gap-2"
          >
            <Badge className="px-3 py-1.5 bg-green-50 text-green-700 border-green-200">
              <Star className="h-3 w-3 mr-1" />
              Boost Google ranking
            </Badge>
            <Badge className="px-3 py-1.5 bg-blue-50 text-blue-700 border-blue-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Automatic filtering
            </Badge>
            <Badge className="px-3 py-1.5 bg-purple-50 text-purple-700 border-purple-200">
              <Link2 className="h-3 w-3 mr-1" />
              Direct integration
            </Badge>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
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
            transition={{ delay: 0.9 }}
            className="text-center"
          >
            <Button
              onClick={onSkip}
              variant="ghost"
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              I'll add this later
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export default StepGoogleReview;