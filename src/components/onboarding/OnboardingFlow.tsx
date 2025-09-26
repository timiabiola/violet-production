import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '@/contexts/OnboardingContext';
import StepWelcome from './StepWelcome';
import StepBusinessName from './StepBusinessName';
import StepGoogleReview from './StepGoogleReview';
import StepCompletion from './StepCompletion';
import AnimatedBackground from './AnimatedBackground';
import { Progress } from '@/components/ui/progress';

const OnboardingFlow: React.FC = () => {
  const {
    currentStep,
    businessName,
    googleReviewUrl,
    setBusinessName,
    setGoogleReviewUrl,
    nextStep,
    previousStep,
    skipOnboarding,
    completeOnboarding,
    saveProgress,
  } = useOnboarding();

  // Calculate progress percentage
  const progressPercentage = ((currentStep + 1) / 4) * 100;

  const handleNext = () => {
    saveProgress();
    nextStep();
  };

  const handleSkip = () => {
    skipOnboarding();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepWelcome
            onNext={handleNext}
            onSkip={handleSkip}
          />
        );
      case 1:
        return (
          <StepBusinessName
            businessName={businessName}
            setBusinessName={setBusinessName}
            onNext={handleNext}
            onPrevious={previousStep}
            onSkip={handleSkip}
          />
        );
      case 2:
        return (
          <StepGoogleReview
            googleReviewUrl={googleReviewUrl}
            setGoogleReviewUrl={setGoogleReviewUrl}
            onNext={handleNext}
            onPrevious={previousStep}
            onSkip={handleSkip}
          />
        );
      case 3:
        return (
          <StepCompletion
            businessName={businessName}
            onComplete={completeOnboarding}
            onPrevious={previousStep}
          />
        );
      default:
        return null;
    }
  };

  const stepTitles = [
    "Welcome",
    "Business Name",
    "Google Reviews",
    "All Set!"
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative p-4">
      {/* Animated background */}
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-4xl z-10 space-y-8"
      >
        {/* Progress section with enhanced styling */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {/* Step indicators with labels */}
          <div className="flex justify-between items-center max-w-2xl mx-auto px-4">
            {stepTitles.map((title, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  animate={{
                    scale: index === currentStep ? 1.2 : 1,
                    backgroundColor: index <= currentStep ? '#8B5CF6' : '#E5E7EB',
                  }}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    transition-all duration-300 shadow-lg
                    ${index <= currentStep
                      ? 'bg-violet-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                    }
                  `}
                >
                  {index < currentStep ? (
                    <motion.svg
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <motion.path
                        d="M20 6L9 17l-5-5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </motion.div>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`
                    text-xs mt-2 font-medium
                    ${index === currentStep
                      ? 'text-violet-600'
                      : index < currentStep
                      ? 'text-gray-600'
                      : 'text-gray-400'
                    }
                  `}
                >
                  {title}
                </motion.span>
              </motion.div>
            ))}
          </div>

          {/* Connecting lines between steps */}
          <div className="relative max-w-2xl mx-auto px-12">
            <div className="absolute top-5 left-12 right-12 h-0.5 bg-gray-200" />
            <motion.div
              className="absolute top-5 left-12 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500"
              initial={{ width: "0%" }}
              animate={{ width: `${(currentStep / 3) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>

          {/* Progress bar */}
          <div className="max-w-2xl mx-auto space-y-2 px-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Step {currentStep + 1} of 4</span>
              <span className="font-medium text-violet-600">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
            <Progress
              value={progressPercentage}
              className="h-2 bg-gray-200"
            />
          </div>
        </motion.div>

        {/* Current step with animations */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-2 mt-8"
        >
          {[0, 1, 2, 3].map((step) => (
            <motion.div
              key={step}
              animate={{
                scale: step === currentStep ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: 2,
                repeat: step === currentStep ? Infinity : 0,
                ease: "easeInOut"
              }}
              className={`
                h-2 rounded-full transition-all duration-300
                ${step === currentStep
                  ? 'bg-violet-400 w-8 shadow-lg shadow-violet-400/50'
                  : step < currentStep
                  ? 'bg-violet-400/60 w-2'
                  : 'bg-gray-300 w-2'
                }
              `}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OnboardingFlow;