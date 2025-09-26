
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { AppRole } from '@/types/supabase';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRoles?: AppRole[];
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = []
}) => {
  const { user, isLoading: authLoading, hasRole } = useAuth();
  const { checkOnboardingStatus } = useOnboarding();
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const location = useLocation();

  // Check onboarding status when user is authenticated
  useEffect(() => {
    const checkOnboarding = async () => {
      if (!user) {
        setIsCheckingOnboarding(false);
        return;
      }

      // Don't check onboarding for certain paths
      const skipOnboardingCheck = ['/onboarding', '/profile'].includes(location.pathname);
      if (skipOnboardingCheck) {
        setIsCheckingOnboarding(false);
        return;
      }

      try {
        const isCompleted = await checkOnboardingStatus();
        console.log('Onboarding check result:', { isCompleted, pathname: location.pathname });
        setNeedsOnboarding(!isCompleted);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        // On error, assume onboarding is complete to avoid blocking
        setNeedsOnboarding(false);
      } finally {
        setIsCheckingOnboarding(false);
      }
    };

    checkOnboarding();
  }, [user, checkOnboardingStatus, location.pathname]);

  // Show loading spinner while checking auth or onboarding
  if (authLoading || isCheckingOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-700"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/auth" />;
  }

  // Check if user needs onboarding (only after first login)
  if (needsOnboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" />;
  }

  // If roles are required, check if user has at least one of them
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => hasRole(role));
    if (!hasRequiredRole) {
      // Unauthorized access
      return <Navigate to="/" />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
