
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

// Data for select dropdowns
const businessTypes = [
  "Clinic",
  "Retail Store",
  "Restaurant/Cafe",
  "Service Business",
  "Professional Services",
  "Hotel/Hospitality",
  "Salon/Spa",
  "Other"
];

const challengeOptions = [
  "Obtaining reviews",
  "Previous negative reviews",
  "Responding to review comments",
  "Other"
];

const ContactForm = () => {
  const { toast } = useToast();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [businessType, setBusinessType] = useState('');
  const [challenge, setChallenge] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      currentGoogleScore: formData.get('currentGoogleScore') || '',
      desiredGoogleScore: formData.get('desiredGoogleScore') || '',
      businessType: businessType || '',
      challenge: challenge || '',
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
        setChallenge('');
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
            <div className={`form-control ${focusedField === 'firstName' ? 'is-focused' : ''}`}>
              <Label htmlFor="firstName" className="text-white/70 text-sm mb-1.5 font-medium">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="First name"
                required
                className="form-input"
                onFocus={() => setFocusedField('firstName')}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            <div className={`form-control ${focusedField === 'lastName' ? 'is-focused' : ''}`}>
              <Label htmlFor="lastName" className="text-white/70 text-sm mb-1.5 font-medium">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Last name"
                required
                className="form-input"
                onFocus={() => setFocusedField('lastName')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

            <div className={`form-control ${focusedField === 'phone' ? 'is-focused' : ''}`}>
              <Label htmlFor="phone" className="text-white/70 text-sm mb-1.5 font-medium">Phone</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="(123) 456-7890"
                required
                className="form-input"
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className={`form-control ${focusedField === 'currentGoogleScore' ? 'is-focused' : ''}`}>
              <Label htmlFor="currentGoogleScore" className="text-white/70 text-sm mb-1.5 font-medium">Current Google Score</Label>
              <Input
                id="currentGoogleScore"
                name="currentGoogleScore"
                type="number"
                min="1"
                max="5"
                step="0.1"
                placeholder="e.g., 3.5"
                className="form-input"
                onFocus={() => setFocusedField('currentGoogleScore')}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            <div className={`form-control ${focusedField === 'desiredGoogleScore' ? 'is-focused' : ''}`}>
              <Label htmlFor="desiredGoogleScore" className="text-white/70 text-sm mb-1.5 font-medium">Desired Google Score</Label>
              <Input
                id="desiredGoogleScore"
                name="desiredGoogleScore"
                type="number"
                min="1"
                max="5"
                step="0.1"
                placeholder="e.g., 4.5"
                className="form-input"
                onFocus={() => setFocusedField('desiredGoogleScore')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
            <div className={`form-control ${focusedField === 'challenge' ? 'is-focused' : ''}`}>
              <Label htmlFor="challenge" className="text-white/70 text-sm mb-1.5 font-medium">
                What's your #1 challenge in terms of improving your online reputation?
              </Label>
              <Select
                value={challenge}
                onValueChange={setChallenge}
                onOpenChange={(open) => {
                  if (open) {
                    setFocusedField('challenge');
                  } else {
                    // When the select closes, remove focus
                    setTimeout(() => setFocusedField(null), 100);
                  }
                }}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white form-input">
                  <SelectValue placeholder="Select challenge" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10">
                  {challengeOptions.map((option) => (
                    <SelectItem key={option} value={option} className="text-white hover:bg-white/10 focus:bg-white/10">
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
