import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { CheckoutButton } from './CheckoutButton';
import { formatPrice } from '@/lib/stripe';

interface PricingCardProps {
  title: string;
  description?: string;
  price: number;
  currency?: string;
  interval?: 'month' | 'year' | 'week' | 'day';
  features: string[];
  priceId: string;
  isPopular?: boolean;
  buttonText?: string;
  mode?: 'payment' | 'subscription';
}

export const PricingCard: React.FC<PricingCardProps> = ({
  title,
  description,
  price,
  currency = 'usd',
  interval,
  features,
  priceId,
  isPopular = false,
  buttonText = 'Get Started',
  mode = 'subscription',
}) => {
  return (
    <Card className={isPopular ? 'border-primary shadow-lg' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          {isPopular && <Badge>Most Popular</Badge>}
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <span className="text-4xl font-bold">{formatPrice(price, currency)}</span>
          {interval && <span className="text-muted-foreground">/{interval}</span>}
        </div>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="mr-2 h-5 w-5 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <CheckoutButton
          priceId={priceId}
          mode={mode}
          className="w-full"
        >
          {buttonText}
        </CheckoutButton>
      </CardFooter>
    </Card>
  );
};