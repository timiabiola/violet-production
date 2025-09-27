import React from 'react';
import { PricingCard } from '@/components/stripe/PricingCard';

const pricingPlans = [
  {
    title: 'Starter',
    description: 'Perfect for individuals just getting started',
    price: 900, // $9 in cents
    currency: 'usd',
    interval: 'month' as const,
    features: [
      'Up to 10 projects',
      'Basic analytics',
      'Email support',
      '1GB storage',
    ],
    priceId: 'price_starter_monthly', // Replace with actual Stripe price ID
    isPopular: false,
  },
  {
    title: 'Professional',
    description: 'Great for growing businesses',
    price: 2900, // $29 in cents
    currency: 'usd',
    interval: 'month' as const,
    features: [
      'Unlimited projects',
      'Advanced analytics',
      'Priority email support',
      '10GB storage',
      'Custom integrations',
      'API access',
    ],
    priceId: 'price_pro_monthly', // Replace with actual Stripe price ID
    isPopular: true,
  },
  {
    title: 'Enterprise',
    description: 'For large teams and organizations',
    price: 9900, // $99 in cents
    currency: 'usd',
    interval: 'month' as const,
    features: [
      'Everything in Professional',
      'Dedicated account manager',
      '24/7 phone support',
      'Unlimited storage',
      'Custom contracts',
      'SLA guarantee',
      'Advanced security features',
    ],
    priceId: 'price_enterprise_monthly', // Replace with actual Stripe price ID
    isPopular: false,
  },
];

const Pricing: React.FC = () => {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground">
            Select the perfect plan for your needs. Upgrade or downgrade at any time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.priceId}
              {...plan}
              mode="subscription"
              buttonText={plan.isPopular ? 'Start Free Trial' : 'Get Started'}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;