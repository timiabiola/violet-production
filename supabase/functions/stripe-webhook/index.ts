import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@18.5.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2024-12-18.acacia',
});

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      throw new Error('No Stripe signature found');
    }

    const body = await req.text();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Update user's payment status
        if (session.metadata?.userId) {
          const { error } = await supabase
            .from('payments')
            .insert({
              user_id: session.metadata.userId,
              stripe_session_id: session.id,
              amount: session.amount_total,
              currency: session.currency,
              status: 'completed',
              metadata: session.metadata,
              created_at: new Date().toISOString(),
            });

          if (error) {
            console.error('Error inserting payment record:', error);
          }
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        if (paymentIntent.metadata?.userId) {
          const { error } = await supabase
            .from('payments')
            .upsert({
              stripe_payment_intent_id: paymentIntent.id,
              user_id: paymentIntent.metadata.userId,
              amount: paymentIntent.amount,
              currency: paymentIntent.currency,
              status: 'succeeded',
              metadata: paymentIntent.metadata,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'stripe_payment_intent_id',
            });

          if (error) {
            console.error('Error updating payment record:', error);
          }
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        if (paymentIntent.metadata?.userId) {
          const { error } = await supabase
            .from('payments')
            .upsert({
              stripe_payment_intent_id: paymentIntent.id,
              user_id: paymentIntent.metadata.userId,
              amount: paymentIntent.amount,
              currency: paymentIntent.currency,
              status: 'failed',
              metadata: paymentIntent.metadata,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'stripe_payment_intent_id',
            });

          if (error) {
            console.error('Error updating payment record:', error);
          }
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;

        if (subscription.metadata?.userId) {
          const { error } = await supabase
            .from('subscriptions')
            .upsert({
              stripe_subscription_id: subscription.id,
              user_id: subscription.metadata.userId,
              stripe_customer_id: subscription.customer as string,
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              metadata: subscription.metadata,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'stripe_subscription_id',
            });

          if (error) {
            console.error('Error updating subscription record:', error);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        if (subscription.metadata?.userId) {
          const { error } = await supabase
            .from('subscriptions')
            .update({
              status: 'canceled',
              canceled_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', subscription.id);

          if (error) {
            console.error('Error updating subscription record:', error);
          }
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;

        if (invoice.subscription && invoice.metadata?.userId) {
          const { error } = await supabase
            .from('invoices')
            .insert({
              stripe_invoice_id: invoice.id,
              user_id: invoice.metadata.userId,
              stripe_subscription_id: invoice.subscription as string,
              amount_paid: invoice.amount_paid,
              currency: invoice.currency,
              status: 'paid',
              invoice_pdf: invoice.invoice_pdf,
              created_at: new Date().toISOString(),
            });

          if (error) {
            console.error('Error inserting invoice record:', error);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});