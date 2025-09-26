import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import BenefitsSection from '@/components/BenefitsSection';
import FreeTrialSection from '@/components/FreeTrialSection';
import WhatThisMeansSection from '@/components/WhatThisMeansSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import FeaturesSection from '@/components/FeaturesSection';
import ContactSection from '@/components/contact/ContactSection';
import Footer from '@/components/Footer';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if this is an email confirmation redirect from Supabase
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const isEmailConfirmation = hashParams.get('type') === 'email' ||
                               hashParams.get('type') === 'signup' ||
                               hashParams.get('type') === 'recovery' ||
                               hashParams.get('type') === 'magiclink';

    // If this is an email confirmation, redirect to the callback handler
    if (isEmailConfirmation && window.location.hash) {
      navigate(`/auth/callback${window.location.hash}`);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <main>
        <HeroSection />
        <BenefitsSection />
        <FreeTrialSection />
        <WhatThisMeansSection />
        <HowItWorksSection />
        <FeaturesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;