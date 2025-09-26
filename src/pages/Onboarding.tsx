import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { OnboardingProvider, useOnboarding } from '@/contexts/OnboardingContext';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';

const OnboardingContent: React.FC = () => {
  const { user } = useAuth();
  const { isOnboardingCompleted, checkOnboardingStatus } = useOnboarding();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      navigate('/auth');
      return;
    }

    // Check if onboarding is already completed
    const checkStatus = async () => {
      const completed = await checkOnboardingStatus();
      if (completed) {
        navigate('/review-form');
      }
    };

    checkStatus();
  }, [user, navigate, checkOnboardingStatus]);

  // If onboarding is completed, don't show the flow
  if (isOnboardingCompleted) {
    return null;
  }

  return <OnboardingFlow />;
};

const Onboarding: React.FC = () => {
  return (
    <OnboardingProvider>
      <OnboardingContent />
    </OnboardingProvider>
  );
};

export default Onboarding;