import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { checkOnboardingStatus } = useOnboarding();
  const [isProcessing, setIsProcessing] = useState(true);
  const [message, setMessage] = useState('Confirming your email...');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Give Supabase time to process the confirmation
        setMessage('Verifying your account...');

        // Wait a moment for auth state to update
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (user) {
          setMessage('Checking your profile...');

          // Check if user needs onboarding
          const isOnboardingComplete = await checkOnboardingStatus();

          // Always redirect to review-form, which will handle onboarding check
          setMessage('Setting up your account...');
          setTimeout(() => {
            navigate('/review-form', { replace: true });
          }, 500);
        } else {
          // No user found, might need to sign in again
          setMessage('Please sign in to continue...');
          setTimeout(() => {
            navigate('/auth', { replace: true });
          }, 1500);
        }
      } catch (error) {
        console.error('Error handling email confirmation:', error);
        setMessage('Something went wrong. Redirecting...');
        setTimeout(() => {
          navigate('/auth', { replace: true });
        }, 2000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleEmailConfirmation();
  }, [user, navigate, checkOnboardingStatus]);

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <ParticleBackground />

      <Card className="bg-glass border-white/10 backdrop-blur-md p-8 max-w-md w-full z-10">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <Loader2 className="h-12 w-12 text-violet-400 animate-spin" />
              <div className="absolute inset-0 bg-violet-400/20 blur-xl animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">
              {isProcessing ? message : 'Redirecting...'}
            </h2>
            <p className="text-gray-300 text-sm">
              Please wait while we set up your account
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AuthCallback;