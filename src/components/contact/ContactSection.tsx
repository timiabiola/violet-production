
import React from 'react';
import ContactFeatureList from './ContactFeatureList';
import ContactInfoCard from './ContactInfoCard';
import ContactForm from './ContactForm';

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 relative bg-black">
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black/20 to-transparent"></div>
      <div className="absolute -top-10 left-1/4 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-violet-800/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <div className="animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-white">
                Ready to Turn Every Customer Into <span className="text-gradient">Your Best Advocate</span>?
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                Join businesses that are seeing real results - more calls, more visits, more revenue - all from better reviews. Let's show you exactly what this means for your bottom line.
              </p>
            </div>
            
            <ContactFeatureList />
            <ContactInfoCard />
          </div>
          
          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
