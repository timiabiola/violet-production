
import React from 'react';

interface FeatureProps {
  title: string;
  description: string;
  animationDelay: string;
}

const Feature = ({ title, description, animationDelay }: FeatureProps) => (
  <li className="flex items-start animate-slide-in" style={{ animationDelay }}>
    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center mr-3 mt-1 shadow-md shadow-violet-900/20">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    </span>
    <span className="text-gray-300">
      <strong className="text-white">{title}</strong> {description}
    </span>
  </li>
);

const ContactFeatureList = () => {
  const features = [
    {
      title: "Business Specialized:",
      description: "Built for retail, restaurants, services, and all customer-facing businesses.",
      animationDelay: "0.2s"
    },
    {
      title: "Privacy Focused:",
      description: "We prioritize customer privacy and data security in all our features.",
      animationDelay: "0.3s"
    },
    {
      title: "Staff-Friendly:",
      description: "Minimal training required with our intuitive two-field form design.",
      animationDelay: "0.4s"
    },
    {
      title: "Results Driven:",
      description: "Businesses using Violet see an average 300% increase in positive Google reviews.",
      animationDelay: "0.5s"
    }
  ];

  return (
    <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
      <h3 className="text-xl font-bold mb-4 text-white">Why businesses choose Violet:</h3>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <Feature 
            key={index}
            title={feature.title}
            description={feature.description}
            animationDelay={feature.animationDelay}
          />
        ))}
      </ul>
    </div>
  );
};

export default ContactFeatureList;
