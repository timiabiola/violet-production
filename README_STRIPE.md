# Stripe Integration Guide

## Overview

This project now includes a complete Stripe integration for handling payments, subscriptions, and billing.

## Setup Instructions

### 1. Environment Variables

Add your Stripe keys to the `.env` file:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... # Your Stripe publishable key
STRIPE_SECRET_KEY=sk_test_...          # Your Stripe secret key (server-side only)
STRIPE_WEBHOOK_SECRET=whsec_...        # Your webhook endpoint secret
```

### 2. Database Migration

Run the migration to create the necessary tables:

```bash
npx supabase db push
```

Or apply the migration manually using the SQL file in `supabase/migrations/20240926_stripe_integration.sql`.

### 3. Deploy Supabase Functions

Deploy the Edge Functions for Stripe:

```bash
npx supabase functions deploy create-checkout-session
npx supabase functions deploy create-payment-intent
npx supabase functions deploy create-customer
npx supabase functions deploy stripe-webhook
```

### 4. Configure Webhook Endpoint

1. Go to your Stripe Dashboard
2. Navigate to Developers → Webhooks
3. Add endpoint: `https://your-project.supabase.co/functions/v1/stripe-webhook`
4. Select the following events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`

5. Copy the webhook signing secret and add it to your environment variables

## Usage

### Components

#### CheckoutButton
Simple button for initiating Stripe Checkout:

```tsx
import { CheckoutButton } from '@/components/stripe/CheckoutButton';

<CheckoutButton
  priceId="price_xxxxx"
  mode="subscription"
>
  Subscribe Now
</CheckoutButton>
```

#### PaymentForm
Embedded payment form for custom payment flows:

```tsx
import { PaymentForm } from '@/components/stripe/PaymentForm';

<PaymentForm
  amount={2999} // Amount in cents
  currency="usd"
  description="One-time payment"
  onSuccess={() => console.log('Payment successful')}
/>
```

#### PricingCard
Pre-styled pricing card component:

```tsx
import { PricingCard } from '@/components/stripe/PricingCard';

<PricingCard
  title="Pro Plan"
  price={2900}
  currency="usd"
  interval="month"
  features={['Feature 1', 'Feature 2']}
  priceId="price_xxxxx"
  isPopular={true}
/>
```

### Service Methods

The `stripeService` provides methods for:

- `createCheckoutSession()` - Create Stripe Checkout sessions
- `createPaymentIntent()` - Create payment intents for custom flows
- `createOrUpdateCustomer()` - Manage Stripe customers
- `createSubscription()` - Create subscriptions
- `cancelSubscription()` - Cancel subscriptions
- `getCustomerSubscriptions()` - Get customer's subscriptions
- `getInvoices()` - Get invoice history

## Testing

### Test Cards

Use these test card numbers in development:

- **Success**: 4242 4242 4242 4242
- **Declined**: 4000 0000 0000 0002
- **Requires authentication**: 4000 0025 0000 3155

### Test Webhooks

Use the Stripe CLI to test webhooks locally:

```bash
stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook
```

## Security Considerations

1. **Never expose your secret key** - Only use it in server-side functions
2. **Validate webhooks** - Always verify the webhook signature
3. **Use HTTPS** - Ensure all payment pages use HTTPS
4. **PCI Compliance** - Use Stripe Elements or Checkout to maintain PCI compliance
5. **RLS Policies** - Database tables have Row Level Security enabled

## Database Schema

### Tables Created

- `payments` - Payment records
- `subscriptions` - Active subscriptions
- `invoices` - Invoice records
- `products` - Product catalog
- `prices` - Price configurations
- `profiles.stripe_customer_id` - Links users to Stripe customers

## Next Steps

1. Create products and prices in your Stripe Dashboard
2. Update the price IDs in your code
3. Customize the UI components to match your brand
4. Add more payment methods if needed
5. Implement subscription management UI
6. Add billing portal integration

## Support

For issues or questions about the Stripe integration, refer to:
- [Stripe Documentation](https://stripe.com/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Stripe Testing Guide](https://stripe.com/docs/testing)