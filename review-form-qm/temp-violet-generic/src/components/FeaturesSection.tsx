
import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useInView } from '@/hooks/useInView';

const features = [{
  title: "Three-Tier Access System",
  description: "Administrator (platform owner), Licensee (business owner), and End-user (staff) roles with customized access and functionality.",
  icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
}, {
  title: "SMS Review Requests",
  description: "Send personalized text messages with direct Google review links to customers right after appointments for maximum response rates.",
  icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
}, {
  title: "Comprehensive Analytics",
  description: "Track review completion rates, monitor response statistics, and measure licensee performance with detailed dashboards.",
  icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
}, {
  title: "Automated Responses",
  description: "Save time with intelligent, personalized responses to every customer review, demonstrating your commitment to customer feedback.",
  icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
}, {
  title: "Simple Three-Field Form",
  description: "Minimal data entry with just first name, phone number, and licensee dropdown makes collecting reviews quick and efficient for staff.",
  icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
}, {
  title: "Business Branding",
  description: "Customize your review requests and responses with your business's branding for a consistent customer experience.",
  icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
}];

const FeatureCard = ({
  feature,
  index
}) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, {
    threshold: 0.2,
    triggerOnce: true
  });

  return <div ref={cardRef} className={`transition-all duration-700 transform ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`} style={{
    transitionDelay: `${index * 100}ms`
  }}>
      <Card className="glass-card h-full border-white/10 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-900/10 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex flex-col h-full">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shadow-md shadow-violet-900/20">
                {feature.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">{feature.title}</h3>
                <Badge variant="outline" className="bg-violet-500/10 text-violet-300 border-violet-500/20 text-xs">
                  Violet Feature
                </Badge>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
          </div>
        </CardContent>
      </Card>
    </div>;
};

const FeaturesSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, {
    threshold: 0.1
  });

  return <section id="features" className="py-24 relative" ref={sectionRef}>
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-violet-950/10 to-black/10 pointer-events-none"></div>
      
      
      
      {/* Decorative elements */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-600/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 left-1/3 w-60 h-60 bg-violet-700/5 rounded-full blur-3xl"></div>
    </section>;
};

export default FeaturesSection;
