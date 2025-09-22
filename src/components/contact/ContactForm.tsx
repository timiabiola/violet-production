
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

// Data for select dropdowns
const businessTypes = [
  "Retail Store",
  "Restaurant/Cafe",
  "Service Business",
  "Professional Services",
  "Hotel/Hospitality",
  "Salon/Spa",
  "Other"
];

const referralSources = [
  "Google Search",
  "Social Media",
  "Professional Referral",
  "Conference/Event",
  "Advertisement",
  "Word of Mouth",
  "Other"
];

const ContactForm = () => {
  const { toast } = useToast();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [businessType, setBusinessType] = useState('');
  const [referral, setReferral] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone') || '',
      businessType: businessType || '',
      locations: formData.get('locations') || '',
      referral: referral || '',
      message: formData.get('message') || '',
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch('https://services.leadconnectorhq.com/hooks/vuoXllweQOW5Mxsn8raO/webhook-trigger/a56f95e3-6363-4b2c-927d-6a8a5ad94c7b', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        toast({
          title: "Form submitted successfully!",
          description: "Thank you for your interest. We'll be in touch soon.",
          variant: "default",
        });

        // Reset form
        event.currentTarget.reset();
        setBusinessType('');
        setReferral('');
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
      <div id="get-in-touch" className="glass-card p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-violet-600/10 rounded-full blur-3xl"></div>
        <h3 className="text-2xl font-bold mb-6 text-white">Get in Touch</h3>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className={`form-control ${focusedField === 'name' ? 'is-focused' : ''}`}>
              <Label htmlFor="name" className="text-white/70 text-sm mb-1.5 font-medium">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Your name"
                required
                className="form-input"
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            
            <div className={`form-control ${focusedField === 'email' ? 'is-focused' : ''}`}>
              <Label htmlFor="email" className="text-white/70 text-sm mb-1.5 font-medium">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                required
                className="form-input"
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className={`form-control ${focusedField === 'phone' ? 'is-focused' : ''}`}>
              <Label htmlFor="phone" className="text-white/70 text-sm mb-1.5 font-medium">Phone (Optional)</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="(123) 456-7890"
                className="form-input"
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            
            <div className={`form-control ${focusedField === 'businessType' ? 'is-focused' : ''}`}>
              <Label htmlFor="businessType" className="text-white/70 text-sm mb-1.5 font-medium">Business Type</Label>
              <Select
                value={businessType}
                onValueChange={setBusinessType}
                onOpenChange={(open) => {
                  if (open) {
                    setFocusedField('businessType');
                  } else {
                    // When the select closes, remove focus
                    setTimeout(() => setFocusedField(null), 100);
                  }
                }}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white form-input">
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10">
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type} className="text-white hover:bg-white/10 focus:bg-white/10">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className={`form-control ${focusedField === 'locations' ? 'is-focused' : ''}`}>
              <Label htmlFor="locations" className="text-white/70 text-sm mb-1.5 font-medium">Number of Locations</Label>
              <Input
                id="locations"
                name="locations"
                type="number"
                min="1"
                placeholder="e.g., 3"
                className="form-input"
                onFocus={() => setFocusedField('locations')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            
            <div className={`form-control ${focusedField === 'referral' ? 'is-focused' : ''}`}>
              <Label htmlFor="referral" className="text-white/70 text-sm mb-1.5 font-medium">How did you hear about us?</Label>
              <Select
                value={referral}
                onValueChange={setReferral}
                onOpenChange={(open) => {
                  if (open) {
                    setFocusedField('referral');
                  } else {
                    // When the select closes, remove focus
                    setTimeout(() => setFocusedField(null), 100);
                  }
                }}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white form-input">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10">
                  {referralSources.map((source) => (
                    <SelectItem key={source} value={source} className="text-white hover:bg-white/10 focus:bg-white/10">
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className={`form-control ${focusedField === 'message' ? 'is-focused' : ''}`}>
            <Label htmlFor="message" className="text-white/70 text-sm mb-1.5 font-medium">Message (Optional)</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell us about your business and needs..."
              className="min-h-24 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
              rows={4}
              onFocus={() => setFocusedField('message')}
              onBlur={() => setFocusedField(null)}
            />
          </div>
          
          <div className="flex flex-col gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white py-6 text-lg shadow-md shadow-violet-900/20 hover:shadow-lg hover:shadow-violet-900/30 transition-all button-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Request Information'}
            </Button>
            <p className="text-sm text-gray-400 text-center">
              By submitting this form, you agree to our Privacy Policy and Terms of Service.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
