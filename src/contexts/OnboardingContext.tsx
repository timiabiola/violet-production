import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface OnboardingContextType {
  currentStep: number;
  businessName: string;
  googleReviewUrl: string;
  isLoading: boolean;
  isOnboardingCompleted: boolean;
  setBusinessName: (name: string) => void;
  setGoogleReviewUrl: (url: string) => void;
  nextStep: () => void;
  previousStep: () => void;
  skipOnboarding: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  saveProgress: () => Promise<void>;
  checkOnboardingStatus: () => Promise<boolean>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [businessName, setBusinessName] = useState('');
  const [googleReviewUrl, setGoogleReviewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);

  // Check onboarding status when user changes
  useEffect(() => {
    if (user) {
      checkOnboardingStatus();
    }
  }, [user]);

  // Check if user has completed onboarding
  const checkOnboardingStatus = useCallback(async (): Promise<boolean> => {
    if (!user) return true; // No user, no need for onboarding

    try {
      // First try to get all fields including onboarding columns
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking onboarding status:', error);
        return true; // Assume completed on error to avoid blocking
      }

      if (data) {
        console.log('Profile data:', data);

        // Check if onboarding columns exist in the response
        if ('onboarding_completed' in data) {
          setIsOnboardingCompleted(data.onboarding_completed || false);
          setCurrentStep(data.onboarding_step || 0);
          setBusinessName(data.business_name || '');
          setGoogleReviewUrl(data.google_review_url || '');
          console.log('Has onboarding columns, completed:', data.onboarding_completed);
          return data.onboarding_completed || false;
        } else {
          // Columns don't exist yet - check if user has business info
          // If they don't have business info, they need onboarding
          const hasBusinessInfo = !!(data.business_name && data.business_name.trim());
          console.log('No onboarding columns, has business info:', hasBusinessInfo, 'business_name:', data.business_name);

          if (!hasBusinessInfo) {
            setIsOnboardingCompleted(false);
            setCurrentStep(0);
            setBusinessName('');
            setGoogleReviewUrl('');
            return false; // Needs onboarding
          } else {
            // Has business info, consider onboarding complete
            setIsOnboardingCompleted(true);
            setBusinessName(data.business_name || '');
            setGoogleReviewUrl(data.google_review_url || '');
            return true;
          }
        }
      }

      return false;
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return true;
    }
  }, [user]);

  // Move to next step
  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
    saveProgress();
  }, []);

  // Move to previous step
  const previousStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  // Save progress to database
  const saveProgress = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Try to update with all fields first
      let updateData: any = {
        business_name: businessName,
        google_review_url: googleReviewUrl,
        updated_at: new Date().toISOString(),
      };

      // Check if onboarding columns exist
      const { data: profileCheck } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileCheck && 'onboarding_step' in profileCheck) {
        updateData.onboarding_step = currentStep;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) {
        console.error('Error saving progress:', error);
        // Don't show error toast if it's just missing columns
        if (!error.message.includes('column')) {
          toast.error('Failed to save progress');
        }
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      toast.error('Failed to save progress');
    } finally {
      setIsLoading(false);
    }
  }, [user, businessName, googleReviewUrl, currentStep]);

  // Skip onboarding
  const skipOnboarding = useCallback(async () => {
    if (!user) return;

    const confirmed = window.confirm(
      'Are you sure you want to skip the onboarding? You can always add this information later in your profile.'
    );

    if (!confirmed) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          onboarding_completed: true,
          onboarding_step: 0,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error skipping onboarding:', error);
        toast.error('Failed to skip onboarding');
      } else {
        setIsOnboardingCompleted(true);
        toast.info('You can add your business information later in your profile');
        navigate('/review-form');
      }
    } catch (error) {
      console.error('Error skipping onboarding:', error);
      toast.error('Failed to skip onboarding');
    } finally {
      setIsLoading(false);
    }
  }, [user, navigate]);

  // Complete onboarding
  const completeOnboarding = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Prepare update data
      let updateData: any = {
        business_name: businessName,
        google_review_url: googleReviewUrl,
        updated_at: new Date().toISOString(),
      };

      // Check if onboarding columns exist
      const { data: profileCheck } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileCheck && 'onboarding_completed' in profileCheck) {
        updateData.onboarding_completed = true;
        updateData.onboarding_step = 0;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) {
        console.error('Error completing onboarding:', error);
        // Don't show error for missing columns, but still mark as complete
        if (!error.message.includes('column')) {
          toast.error('Failed to complete onboarding');
        } else {
          // Even if columns don't exist, we saved the business info
          setIsOnboardingCompleted(true);
          toast.success('Welcome aboard! Your profile is all set up.');
          navigate('/review-form');
        }
      } else {
        setIsOnboardingCompleted(true);
        toast.success('Welcome aboard! Your profile is all set up.');
        navigate('/review-form');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to complete onboarding');
    } finally {
      setIsLoading(false);
    }
  }, [user, businessName, googleReviewUrl, navigate]);

  const value = {
    currentStep,
    businessName,
    googleReviewUrl,
    isLoading,
    isOnboardingCompleted,
    setBusinessName,
    setGoogleReviewUrl,
    nextStep,
    previousStep,
    skipOnboarding,
    completeOnboarding,
    saveProgress,
    checkOnboardingStatus,
  };

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};