import React, { useEffect } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuccessBannerProps {
  show: boolean;
  onClose: () => void;
  message?: string;
  description?: string;
}

const SuccessBanner: React.FC<SuccessBannerProps> = ({
  show,
  onClose,
  message = "Success!",
  description = "Your form has been submitted successfully."
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-50 animate-slide-down-fade-in">
      <div className="mx-auto max-w-2xl px-4 py-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-violet-700 p-6 shadow-2xl">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -left-4 -top-4 h-24 w-24 animate-pulse-slow rounded-full bg-white/20 blur-xl" />
            <div className="absolute -bottom-4 -right-4 h-32 w-32 animate-pulse-slow animation-delay-1000 rounded-full bg-white/20 blur-xl" />
          </div>

          {/* Sparkle decorations */}
          <Sparkles className="absolute left-8 top-8 h-4 w-4 animate-sparkle text-white/40" />
          <Sparkles className="absolute right-12 bottom-6 h-3 w-3 animate-sparkle animation-delay-500 text-white/40" />
          <Sparkles className="absolute right-1/3 top-6 h-5 w-5 animate-sparkle animation-delay-1500 text-white/40" />

          <div className="relative flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm animate-success-bounce">
              <Check className="h-6 w-6 text-white" strokeWidth={3} />
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">
                {message}
              </h3>
              <p className="mt-1 text-sm text-white/90">
                {description}
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close notification"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessBanner;