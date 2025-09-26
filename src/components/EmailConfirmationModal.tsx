import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mail, CheckCircle } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';

interface EmailConfirmationModalProps {
  email: string;
  onClose: () => void;
}

const EmailConfirmationModal: React.FC<EmailConfirmationModalProps> = ({ email, onClose }) => {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Particles for visual interest */}
      <ParticleBackground />

      {/* Modal Content */}
      <Card className="relative z-10 bg-glass border-white/10 backdrop-blur-md p-8 max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-violet-400/20 blur-xl animate-pulse" />
              <div className="relative bg-violet-600/20 p-4 rounded-full">
                <Mail className="h-16 w-16 text-violet-400" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white">Check Your Email!</h2>
            <div className="flex items-center justify-center gap-2 text-violet-300">
              <CheckCircle className="h-5 w-5" />
              <p className="text-sm font-medium">Registration Successful</p>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-3">
            <p className="text-gray-300">
              We've sent a confirmation email to:
            </p>
            <p className="text-white font-semibold bg-white/10 px-4 py-2 rounded-lg">
              {email}
            </p>
            <p className="text-gray-400 text-sm">
              Please click the link in the email to activate your account and get started with your 7-day free trial.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={onClose}
              size="lg"
              className="w-full bg-violet-600 hover:bg-violet-700 text-white transition-all duration-200 transform hover:scale-[1.02]"
            >
              Okay, I'll Check Now
            </Button>
          </div>

          {/* Help text */}
          <div className="pt-4 border-t border-white/10">
            <p className="text-xs text-gray-500">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                className="text-violet-400 hover:text-violet-300 underline transition-colors"
                onClick={() => window.location.reload()}
              >
                try signing up again
              </button>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EmailConfirmationModal;