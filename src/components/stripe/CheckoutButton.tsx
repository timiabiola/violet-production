import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { stripeService } from '@/services/stripe.service';
import { useToast } from '@/hooks/use-toast';

interface CheckoutButtonProps {
  priceId?: string;
  mode?: 'payment' | 'subscription';
  className?: string;
  children?: React.ReactNode;
  metadata?: Record<string, any>;
  lineItems?: Array<{ price: string; quantity: number }>;
}

export const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  priceId,
  mode = 'payment',
  className = '',
  children = 'Checkout',
  metadata = {},
  lineItems,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCheckout = async () => {
    try {
      setIsLoading(true);

      const session = await stripeService.createCheckoutSession({
        priceId,
        mode,
        successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/payment-canceled`,
        metadata,
        lineItems,
      });

      // Redirect to Stripe Checkout
      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Checkout Error',
        description: 'Failed to start checkout process. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading}
      className={className}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
};