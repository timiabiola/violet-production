
import React from 'react';

const ContactInfoCard = () => {
  return (
    <div className="glass-card p-7 rounded-xl animate-fade-in" style={{ animationDelay: "0.6s" }}>
      <h3 className="text-xl font-bold mb-4 text-white">Ready to get started?</h3>
      <p className="text-gray-300 mb-4">
        Fill out the form and we'll be in touch to discuss how Violet can help your specific business needs.
      </p>
      <p className="text-gray-300 mb-2">
        Schedule a demo to see how easy it is to:
      </p>
      <ul className="space-y-1 mb-4">
        <li className="flex items-center">
          <span className="mr-2 text-violet-400">•</span>
          <span className="text-gray-300">Collect more positive reviews</span>
        </li>
        <li className="flex items-center">
          <span className="mr-2 text-violet-400">•</span>
          <span className="text-gray-300">Save staff time with automation</span>
        </li>
        <li className="flex items-center">
          <span className="mr-2 text-violet-400">•</span>
          <span className="text-gray-300">Track and improve your online reputation</span>
        </li>
      </ul>
      <p className="text-violet-300 font-medium">
        Pricing is customized based on business size and needs.
      </p>
    </div>
  );
};

export default ContactInfoCard;
