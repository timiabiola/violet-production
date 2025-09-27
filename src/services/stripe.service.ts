import { supabase } from '@/integrations/supabase/client';
import { getStripe } from '@/lib/stripe';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  interval?: 'month' | 'year' | 'week' | 'day';
}

export interface Customer {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  metadata?: Record<string, any>;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret: string;
}

export interface Subscription {
  id: string;
  customerId: string;
  status: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  items: SubscriptionItem[];
}

export interface SubscriptionItem {
  id: string;
  priceId: string;
  quantity: number;
}

class StripeService {
  // Create a checkout session
  async createCheckoutSession(params: {
    priceId?: string;
    mode: 'payment' | 'subscription';
    successUrl: string;
    cancelUrl: string;
    customerId?: string;
    metadata?: Record<string, any>;
    lineItems?: Array<{ price: string; quantity: number }>;
  }) {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: params
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  // Create a payment intent for custom payment flows
  async createPaymentIntent(params: {
    amount: number;
    currency: string;
    customerId?: string;
    metadata?: Record<string, any>;
  }) {
    try {
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: params
      });

      if (error) throw error;
      return data as PaymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  // Create or update a customer
  async createOrUpdateCustomer(params: {
    email: string;
    name?: string;
    phone?: string;
    metadata?: Record<string, any>;
  }) {
    try {
      const { data, error } = await supabase.functions.invoke('create-customer', {
        body: params
      });

      if (error) throw error;
      return data as Customer;
    } catch (error) {
      console.error('Error creating/updating customer:', error);
      throw error;
    }
  }

  // Get customer's payment methods
  async getPaymentMethods(customerId: string) {
    try {
      const { data, error } = await supabase.functions.invoke('get-payment-methods', {
        body: { customerId }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting payment methods:', error);
      throw error;
    }
  }

  // Create a subscription
  async createSubscription(params: {
    customerId: string;
    priceId: string;
    paymentMethodId?: string;
    trialPeriodDays?: number;
    metadata?: Record<string, any>;
  }) {
    try {
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: params
      });

      if (error) throw error;
      return data as Subscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  // Cancel a subscription
  async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd = true) {
    try {
      const { data, error } = await supabase.functions.invoke('cancel-subscription', {
        body: { subscriptionId, cancelAtPeriodEnd }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  // Update subscription
  async updateSubscription(subscriptionId: string, params: {
    priceId?: string;
    quantity?: number;
    metadata?: Record<string, any>;
  }) {
    try {
      const { data, error } = await supabase.functions.invoke('update-subscription', {
        body: { subscriptionId, ...params }
      });

      if (error) throw error;
      return data as Subscription;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  // Get customer's subscriptions
  async getCustomerSubscriptions(customerId: string) {
    try {
      const { data, error } = await supabase.functions.invoke('get-subscriptions', {
        body: { customerId }
      });

      if (error) throw error;
      return data as Subscription[];
    } catch (error) {
      console.error('Error getting subscriptions:', error);
      throw error;
    }
  }

  // Get invoice history
  async getInvoices(customerId: string, limit = 10) {
    try {
      const { data, error } = await supabase.functions.invoke('get-invoices', {
        body: { customerId, limit }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting invoices:', error);
      throw error;
    }
  }

  // Create a setup intent for saving payment methods
  async createSetupIntent(customerId: string) {
    try {
      const { data, error } = await supabase.functions.invoke('create-setup-intent', {
        body: { customerId }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating setup intent:', error);
      throw error;
    }
  }

  // Attach payment method to customer
  async attachPaymentMethod(paymentMethodId: string, customerId: string) {
    try {
      const { data, error } = await supabase.functions.invoke('attach-payment-method', {
        body: { paymentMethodId, customerId }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error attaching payment method:', error);
      throw error;
    }
  }

  // Set default payment method
  async setDefaultPaymentMethod(paymentMethodId: string, customerId: string) {
    try {
      const { data, error } = await supabase.functions.invoke('set-default-payment-method', {
        body: { paymentMethodId, customerId }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error setting default payment method:', error);
      throw error;
    }
  }
}

export const stripeService = new StripeService();