import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const scenarios = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    title: "Be the First They See",
    description: "When someone searches for the best businesses like yours nearby, you'll be one of the first three they see - where over 75% of clicks happen."
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    title: "Reviews That Sell For You",
    description: "Potential customers will read glowing reviews that address their exact concerns - turning hesitant browsers into confident buyers before they even contact you."
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: "Free Marketing Army",
    description: "Happy customers become your marketing team - sharing their experiences and bringing their friends, reducing your need for expensive advertising."
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Protection from Bad Days",
    description: "Build a strong foundation of positive reviews so that one difficult customer can't damage your reputation - you'll have dozens of happy voices drowning out the noise."
  }
];

const WhatThisMeansSection = () => {
  return (
    <section className="py-20 relative bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-white">
            What This Means <span className="text-gradient">For You</span>
          </h2>
          <p className="text-lg text-gray-300">
            Forget the technical jargon. Here's exactly how better reviews transform your daily business:
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {scenarios.map((scenario, index) => (
            <div
              key={index}
              className="animate-fade-in"
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <Card className="h-full bg-glass border-0">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-violet-600/20 p-2.5 rounded-lg flex-shrink-0 text-violet-400">
                      {scenario.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold font-heading mb-2 text-white">
                        {scenario.title}
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {scenario.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-block bg-violet-600/10 border border-violet-600/30 rounded-lg p-6 max-w-2xl">
            <p className="text-violet-300 font-medium mb-2">
              💡 The Bottom Line
            </p>
            <p className="text-white">
              Every day without reputation management is money left on the table.
              Your competitors are already collecting reviews - don't let them win your customers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatThisMeansSection;