import React from 'react';
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