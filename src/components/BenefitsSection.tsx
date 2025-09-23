
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    title: "Get Found First by Your Customers",
    description: "When customers search for businesses like yours, you'll appear at the top of local results where most clicks happen. Businesses in top positions receive over double the customer calls and visits.",
    stat: "2x more customer actions"
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Win Customer Trust Before They Walk In",
    description: "Your stellar reviews become your best sales team, convincing hesitant customers to choose you over competitors. 9 out of 10 customers check reviews before visiting - make sure they love what they see.",
    stat: "90% of customers read reviews first"
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: "Turn Reviews Into Revenue",
    description: "Watch as more browsers become buyers and happy customers bring their friends. Each star increase in your rating can mean nearly half more customers taking action - calling, visiting, or purchasing.",
    stat: "44% more customer conversions per star"
  }
];

const BenefitsSection = () => {
  return (
    <section id="benefits" className="py-20 relative bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-white">
            Why Invest in <span className="text-gradient">Reputation Management</span>?
          </h2>
          <p className="text-lg text-gray-300">
            In today's competitive business landscape, your online reputation can make or break your success. Here's why Violet makes the difference.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="animate-fade-in" 
              style={{ animationDelay: `${0.2 * index}s` }}
            >
              <Card className="h-full bg-glass border-0">
                <CardContent className="p-6">
                  <div className="bg-violet-600/20 p-3 rounded-lg inline-block mb-4 text-violet-400">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold font-heading mb-3 text-white">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    {benefit.description}
                  </p>
                  <div className="pt-4 border-t border-violet-600/20">
                    <span className="text-sm font-semibold text-violet-400">
                      {benefit.stat}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
