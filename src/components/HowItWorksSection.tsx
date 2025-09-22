
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    number: "01",
    title: "Customer Visit Completion",
    description: "After a customer completes their purchase or service, identify satisfied customers who might leave positive reviews.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
  {
    number: "02",
    title: "Quick Form Submission",
    description: "Staff enter the customer's name and phone number in our simple two-field form.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    number: "03",
    title: "Automated SMS Delivery",
    description: "The customer receives a personalized text message with a direct link to leave a Google review for your business.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    )
  },
  {
    number: "04",
    title: "Customer Review Submission",
    description: "Customer clicks the link and quickly leaves a review, increasing your Google review count with authentic feedback.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    )
  },
  {
    number: "05",
    title: "Automated Response",
    description: "Every review receives a prompt, professional response, demonstrating your commitment to customer engagement.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
      </svg>
    )
  },
  {
    number: "06",
    title: "Performance Analytics",
    description: "Access comprehensive analytics to track review metrics, completion rates, and overall online reputation growth.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  }
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20 relative bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-white">
            How <span className="text-gradient">Violet</span> Works
          </h2>
          <p className="text-lg text-gray-300">
            Our streamlined process makes collecting and managing customer reviews effortless for your business.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="animate-fade-in" 
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <Card className="h-full bg-glass border-0 hover:-translate-y-1 transition-transform duration-300">
                <CardContent className="p-6 relative">
                  <span className="absolute top-4 right-4 text-2xl font-bold text-violet-500/30">{step.number}</span>
                  <div className="bg-violet-600 p-2 rounded-lg inline-block mb-4 text-white">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-300">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-block glass-morphism p-6 rounded-xl max-w-3xl">
            <h3 className="text-2xl font-bold mb-4 text-white">Effortless Implementation</h3>
            <p className="text-gray-300">
              Violet integrates seamlessly with your current workflow without disrupting day-to-day operations. 
              Our system requires minimal training and dramatically increases your Google review count with authentic customer feedback.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
