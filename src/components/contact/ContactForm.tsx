
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import SuccessBanner from "@/components/SuccessBanner";
import { Loader2 } from "lucide-react";

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
  "Generating warm leads",
  "Converting leads to customers",
  "Other"
];

const ContactForm = () => {
  // Form with strict validation
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [businessType, setBusinessType] = useState('');
  const [challenge, setChallenge] = useState('');
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'firstName':
        return !value.trim() ? 'First name is required' : '';
      case 'lastName':
        return !value.trim() ? 'Last name is required' : '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Please enter a valid email' : '';
      case 'phone':
        return !value.trim() ? 'Phone number is required' : '';
      default:
        return '';
    }
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Form submission started');

    // Prevent multiple submissions
    if (isSubmitting) {
      console.log('Already submitting, ignoring duplicate submission');
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});

    const form = event.currentTarget;
    const formData = new FormData(form);

    // FIRST CHECK: Ensure form data exists
    const rawFirstName = formData.get('firstName') as string;
    const rawLastName = formData.get('lastName') as string;
    const rawEmail = formData.get('email') as string;
    const rawPhone = formData.get('phone') as string;

    console.log('Raw form data:', {
      firstName: rawFirstName || 'EMPTY',
      lastName: rawLastName || 'EMPTY',
      email: rawEmail || 'EMPTY',
      phone: rawPhone || 'EMPTY'
    });

    // Immediate validation - block if ANY field is empty
    if (!rawFirstName || !rawLastName || !rawEmail || !rawPhone) {
      console.log('Blocking submission - empty fields detected');
      const errors: Record<string, string> = {};

      if (!rawFirstName) errors.firstName = 'First name is required';
      if (!rawLastName) errors.lastName = 'Last name is required';
      if (!rawEmail) errors.email = 'Email is required';
      if (!rawPhone) errors.phone = 'Phone number is required';

      setFieldErrors(errors);
      toast.error('❌ Cannot Submit - Missing Required Fields', {
        description: 'Please fill in all fields marked with an asterisk (*)',
        duration: 6000,
      });

      setIsSubmitting(false);
      return; // STOP HERE - DO NOT PROCEED
    }

    // Validate all required fields with proper validation rules
    const errors: Record<string, string> = {};
    const requiredFields = ['firstName', 'lastName', 'email', 'phone'];

    for (const field of requiredFields) {
      const value = formData.get(field) as string || '';
      const error = validateField(field, value);
      if (error) {
        errors[field] = error;
      }
    }

    // If there are validation errors, show them and stop submission
    if (Object.keys(errors).length > 0) {
      console.log('Validation failed:', errors);
      setFieldErrors(errors);
      toast.error('⚠️ Submission Incomplete', {
        description: 'Please complete all required fields before submitting. Check the fields highlighted in red below.',
        duration: 6000,
      });
      setIsSubmitting(false);

      // Add shake animation to form
      const formElement = document.getElementById('contact-form');
      if (formElement) {
        formElement.classList.add('animate-shake');
        setTimeout(() => formElement.classList.remove('animate-shake'), 500);
      }
      return; // STOP EXECUTION HERE
    }

    // Extract form values with proper type safety
    const firstName = (formData.get('firstName') as string || '').trim();
    const lastName = (formData.get('lastName') as string || '').trim();
    const email = (formData.get('email') as string || '').trim();
    const phone = (formData.get('phone') as string || '').trim();

    // Double validation - ensure critical fields are not empty
    if (!firstName || !lastName || !email || !phone) {
      console.log('Second validation failed - empty fields detected:', {
        firstName: !firstName ? 'empty' : 'filled',
        lastName: !lastName ? 'empty' : 'filled',
        email: !email ? 'empty' : 'filled',
        phone: !phone ? 'empty' : 'filled'
      });

      const missingFields: string[] = [];
      if (!firstName) missingFields.push('First Name');
      if (!lastName) missingFields.push('Last Name');
      if (!email) missingFields.push('Email');
      if (!phone) missingFields.push('Phone');

      toast.error('❌ Cannot Submit - Form Incomplete', {
        description: `Missing required fields: ${missingFields.join(', ')}. Please fill in all required information.`,
        duration: 6000,
      });

      // Set specific errors for empty fields
      const newErrors: Record<string, string> = {};
      if (!firstName) newErrors.firstName = 'First name is required';
      if (!lastName) newErrors.lastName = 'Last name is required';
      if (!email) newErrors.email = 'Email is required';
      if (!phone) newErrors.phone = 'Phone number is required';
      setFieldErrors(newErrors);

      // Add shake animation here too
      const formElement = document.getElementById('contact-form');
      if (formElement) {
        formElement.classList.add('animate-shake');
        setTimeout(() => formElement.classList.remove('animate-shake'), 500);
      }

      setIsSubmitting(false);
      return; // ABSOLUTELY STOP HERE - NO WEBHOOK CALL
    }

    console.log('All validations passed, preparing to send data:', {
      firstName,
      lastName,
      email,
      phone
    });

    const data = {
      firstName,
      lastName,
      email,
      phone,
      currentGoogleScore: formData.get('currentGoogleScore') || '',
      desiredGoogleScore: formData.get('desiredGoogleScore') || '',
      businessType: businessType || '',
      challenge: challenge || '',
      timestamp: new Date().toISOString()
    };

    try {
      // Try the webhook with proper error handling
      const response = await fetch('https://services.leadconnectorhq.com/hooks/vuoXllweQOW5Mxsn8raO/webhook-trigger/4db700b6-a04d-403b-946c-9108ba479976', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        mode: 'cors' // Explicitly set CORS mode
      });

      if (response.ok) {
        // Show success banner
        setShowSuccessBanner(true);

        // Reset form safely
        if (form) {
          form.reset();
        }
        setBusinessType('');
        setChallenge('');
        setFieldErrors({});
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);

      // Always show error for any failure
      let errorMessage = 'There was an error processing your request. Please try again.';

      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
      }

      toast.error('Failed to submit form', {
        description: errorMessage,
        duration: 5000,
      });

      // Do NOT reset form on error - keep user's data
      // Do NOT show success banner
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <SuccessBanner
        show={showSuccessBanner}
        onClose={() => setShowSuccessBanner(false)}
        message="Thank you for contacting us!"
        description="We've received your information and will be in touch soon."
      />

      <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <div id="get-in-touch" className="glass-card p-8 rounded-2xl relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-violet-600/10 rounded-full blur-3xl"></div>
          <h3 className="text-2xl font-bold mb-6 text-white">Get in Touch</h3>

          <form id="contact-form" onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className={`form-control ${focusedField === 'firstName' ? 'is-focused' : ''}`}>
              <Label htmlFor="firstName" className="text-white/70 text-sm mb-1.5 font-medium">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="First name"
                required
                className={`form-input ${fieldErrors.firstName ? 'border-red-500 focus:ring-red-500' : ''}`}
                onFocus={() => setFocusedField('firstName')}
                onBlur={(e) => {
                  setFocusedField(null);
                  handleFieldChange(e);
                }}
                onChange={handleFieldChange}
              />
              {fieldErrors.firstName && (
                <p className="text-red-400 text-xs mt-1">{fieldErrors.firstName}</p>
              )}
            </div>

            <div className={`form-control ${focusedField === 'lastName' ? 'is-focused' : ''}`}>
              <Label htmlFor="lastName" className="text-white/70 text-sm mb-1.5 font-medium">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Last name"
                required
                className={`form-input ${fieldErrors.lastName ? 'border-red-500 focus:ring-red-500' : ''}`}
                onFocus={() => setFocusedField('lastName')}
                onBlur={(e) => {
                  setFocusedField(null);
                  handleFieldChange(e);
                }}
                onChange={handleFieldChange}
              />
              {fieldErrors.lastName && (
                <p className="text-red-400 text-xs mt-1">{fieldErrors.lastName}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className={`form-control ${focusedField === 'email' ? 'is-focused' : ''}`}>
              <Label htmlFor="email" className="text-white/70 text-sm mb-1.5 font-medium">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                required
                className={`form-input ${fieldErrors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                onFocus={() => setFocusedField('email')}
                onBlur={(e) => {
                  setFocusedField(null);
                  handleFieldChange(e);
                }}
                onChange={handleFieldChange}
              />
              {fieldErrors.email && (
                <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <div className={`form-control ${focusedField === 'phone' ? 'is-focused' : ''}`}>
              <Label htmlFor="phone" className="text-white/70 text-sm mb-1.5 font-medium">
                Phone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                placeholder="(123) 456-7890"
                required
                className={`form-input ${fieldErrors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
                onFocus={() => setFocusedField('phone')}
                onBlur={(e) => {
                  setFocusedField(null);
                  handleFieldChange(e);
                }}
                onChange={handleFieldChange}
              />
              {fieldErrors.phone && (
                <p className="text-red-400 text-xs mt-1">{fieldErrors.phone}</p>
              )}
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
              <Label htmlFor="businessType" className="text-white/70 text-sm mb-1.5 font-medium h-10 flex items-start">
                Business Type
              </Label>
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
              <Label htmlFor="challenge" className="text-white/70 text-sm mb-1.5 font-medium h-10 flex items-start">
                What's your #1 online reputation challenge?
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
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Start Free Trial'
              )}
            </Button>
            <p className="text-sm text-gray-400 text-center">
              By submitting this form, you agree to our Privacy Policy and Terms of Service.
            </p>
          </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ContactForm;
