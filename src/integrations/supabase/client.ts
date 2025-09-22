
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { n8nClient } from '@/lib/n8n-client';

// Debug: Log all available environment variables
console.log('Available env vars:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;
const N8N_AUTH_HEADER_NAME = import.meta.env.VITE_N8N_AUTH_HEADER_NAME || 'Authorization';
const N8N_AUTH_HEADER_VALUE =
  import.meta.env.VITE_N8N_AUTH_HEADER_VALUE ?? import.meta.env.VITE_N8N_AUTH_TOKEN;

// Check if we're using n8n webhook (URL contains n8n or webhook)
const isN8nWebhook = SUPABASE_URL && (
  SUPABASE_URL.includes('n8n') ||
  SUPABASE_URL.includes('webhook')
);

console.log('Backend configuration:', {
  isN8nWebhook,
  url: SUPABASE_URL,
  authHeaderName: N8N_AUTH_HEADER_VALUE ? N8N_AUTH_HEADER_NAME : 'NOT SET',
  hasAuthToken: !!N8N_AUTH_HEADER_VALUE
});

// Detailed debugging
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing environment variables:', {
    VITE_SUPABASE_URL: SUPABASE_URL || 'NOT SET - Add this in Vercel Dashboard!',
    VITE_SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'NOT SET',
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || 'NOT SET',
    VITE_N8N_AUTH_HEADER_NAME: N8N_AUTH_HEADER_NAME || 'NOT SET',
    VITE_N8N_AUTH_HEADER_VALUE: N8N_AUTH_HEADER_VALUE ? 'Set' : 'NOT SET',
    VITE_N8N_AUTH_TOKEN: import.meta.env.VITE_N8N_AUTH_TOKEN ? 'Set (legacy)' : 'NOT SET',
    allEnvKeys: Object.keys(import.meta.env),
    MODE: import.meta.env.MODE,
    PROD: import.meta.env.PROD,
    DEV: import.meta.env.DEV
  });

  // Provide clear instructions in the console
  console.error('📍 TO FIX: Add VITE_SUPABASE_URL in Vercel Dashboard → Settings → Environment Variables');

  throw new Error('Missing VITE_SUPABASE_URL. Add it in Vercel Dashboard → Settings → Environment Variables');
}

// Create a wrapper that adapts n8n client to Supabase-like interface
const createN8nSupabaseAdapter = () => {
  return {
    auth: {
      signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
        try {
          const result = await n8nClient.signIn(email, password);
          return { data: result, error: null };
        } catch (error) {
          return { data: null, error };
        }
      },
      signUp: async ({ email, password }: { email: string; password: string }) => {
        try {
          const result = await n8nClient.signUp(email, password);
          return { data: result, error: null };
        } catch (error) {
          return { data: null, error };
        }
      },
      signOut: async () => {
        try {
          await n8nClient.signOut();
          return { error: null };
        } catch (error) {
          return { error };
        }
      },
      getUser: async () => {
        try {
          const user = await n8nClient.getUser();
          return { data: { user }, error: null };
        } catch (error) {
          return { data: null, error };
        }
      }
    },
    from: (table: string) => ({
      select: (columns?: string) => {
        const chainable = {
          promise: null as any,
          then: function(onfulfilled?: any, onrejected?: any) {
            if (!this.promise) {
              this.promise = n8nClient.query(table, { columns })
                .then((data: any) => ({ data, error: null }))
                .catch((error: any) => {
                  console.error(`n8n query error for table ${table}:`, error);
                  return { data: null, error: { message: error.message || 'Query failed' } };
                });
            }
            return this.promise.then(onfulfilled, onrejected);
          }
        };
        return chainable;
      },
      insert: (data: any) => {
        const chainable = {
          promise: null as any,
          select: function() {
            // For insert().select() pattern
            return this;
          },
          then: function(onfulfilled?: any, onrejected?: any) {
            if (!this.promise) {
              console.log(`n8n insert request for table ${table}:`, data);
              this.promise = n8nClient.insert(table, data)
                .then((result: any) => {
                  console.log(`n8n insert success for table ${table}:`, result);
                  return { data: result, error: null };
                })
                .catch((error: any) => {
                  console.error(`n8n insert error for table ${table}:`, error);
                  return { data: null, error: { message: error.message || 'Insert failed' } };
                });
            }
            return this.promise.then(onfulfilled, onrejected);
          }
        };
        return chainable;
      },
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          then: function(onfulfilled?: any, onrejected?: any) {
            return n8nClient.update(table, value, data)
              .then((result: any) => ({ data: result, error: null }))
              .catch((error: any) => {
                console.error(`n8n update error for table ${table}:`, error);
                return { data: null, error: { message: error.message || 'Update failed' } };
              })
              .then(onfulfilled, onrejected);
          }
        })
      }),
      delete: () => ({
        eq: (column: string, value: any) => ({
          then: function(onfulfilled?: any, onrejected?: any) {
            return n8nClient.delete(table, value)
              .then(() => ({ error: null }))
              .catch((error: any) => {
                console.error(`n8n delete error for table ${table}:`, error);
                return { error: { message: error.message || 'Delete failed' } };
              })
              .then(onfulfilled, onrejected);
          }
        })
      })
    })
  };
};

// If using n8n webhook, create adapter; otherwise use regular Supabase client
export const supabase = isN8nWebhook
  ? createN8nSupabaseAdapter() as any
  : createClient<Database>(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        }
      }
    );

// Add test function for debugging
if (isN8nWebhook) {
  // Test the n8n connection immediately
  n8nClient.testConnection().catch(error => {
    console.error('Failed to connect to n8n webhook:', error);
  });
}
