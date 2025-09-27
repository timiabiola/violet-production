import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@18.5.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2024-12-18.acacia',
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, name, phone, metadata } = await req.json();

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    // Check if customer already exists
    const existingCustomers = await stripe.customers.list({
      email: email || user.email,
      limit: 1,
    });

    let customer;

    if (existingCustomers.data.length > 0) {
      // Update existing customer
      customer = await stripe.customers.update(existingCustomers.data[0].id, {
        name,
        phone,
        metadata: {
          ...metadata,
          userId: user.id,
        },
      });
    } else {
      // Create new customer
      customer = await stripe.customers.create({
        email: email || user.email,
        name,
        phone,
        metadata: {
          ...metadata,
          userId: user.id,
        },
      });
    }

    // Store customer ID in database
    const { error: dbError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        stripe_customer_id: customer.id,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id',
      });

    if (dbError) {
      console.error('Error updating profile:', dbError);
    }

    return new Response(
      JSON.stringify({
        id: customer.id,
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
        metadata: customer.metadata,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error creating/updating customer:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});