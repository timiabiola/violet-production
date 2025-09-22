import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  // Log available environment variables during build
  console.log('Build mode:', mode);
  console.log('Available VITE_ env vars:', Object.keys(env).filter(key => key.startsWith('VITE_')));

  const proxyPath = env.VITE_N8N_PROXY_URL || process.env.VITE_N8N_PROXY_URL || '/api/n8n-proxy';
  const upstreamUrl = env.N8N_WEBHOOK_URL || env.VITE_SUPABASE_URL || process.env.N8N_WEBHOOK_URL || process.env.VITE_SUPABASE_URL;
  const headerName = env.N8N_AUTH_HEADER_NAME || env.VITE_N8N_AUTH_HEADER_NAME || process.env.N8N_AUTH_HEADER_NAME || 'Authorization';
  const headerValue =
    env.N8N_AUTH_HEADER_VALUE ||
    env.VITE_N8N_AUTH_HEADER_VALUE ||
    env.VITE_N8N_AUTH_TOKEN ||
    process.env.N8N_AUTH_HEADER_VALUE ||
    process.env.VITE_N8N_AUTH_HEADER_VALUE ||
    process.env.N8N_AUTH_TOKEN ||
    process.env.VITE_N8N_AUTH_TOKEN;

  const serverConfig: Record<string, any> = {
    host: '::',
    port: 8080,
  };

  if (proxyPath && upstreamUrl && headerValue) {
    const normalizedPath = proxyPath.startsWith('/') ? proxyPath : `/${proxyPath}`;
    serverConfig.proxy = {
      [normalizedPath]: {
        target: upstreamUrl,
        changeOrigin: true,
        secure: true,
        rewrite: (path: string) => path.replace(new RegExp(`^${normalizedPath}`), ''),
        configure: (proxy: any) => {
          proxy.on('proxyReq', (proxyReq: any) => {
            proxyReq.setHeader(headerName, headerValue);
          });
        },
      },
    };
  }

  return {
    server: serverConfig,
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-vendor': [
              '@radix-ui/react-accordion',
              '@radix-ui/react-alert-dialog',
              '@radix-ui/react-aspect-ratio',
              '@radix-ui/react-avatar',
              '@radix-ui/react-checkbox',
              '@radix-ui/react-collapsible',
              '@radix-ui/react-context-menu',
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-hover-card',
              '@radix-ui/react-label',
              '@radix-ui/react-menubar',
              '@radix-ui/react-navigation-menu',
              '@radix-ui/react-popover',
              '@radix-ui/react-progress',
              '@radix-ui/react-radio-group',
              '@radix-ui/react-scroll-area',
              '@radix-ui/react-select',
              '@radix-ui/react-separator',
              '@radix-ui/react-slider',
              '@radix-ui/react-slot',
              '@radix-ui/react-switch',
              '@radix-ui/react-tabs',
              '@radix-ui/react-toast',
              '@radix-ui/react-toggle',
              '@radix-ui/react-toggle-group',
              '@radix-ui/react-tooltip'
            ],
            'supabase': ['@supabase/supabase-js'],
            'date-fns': ['date-fns'],
            'query': ['@tanstack/react-query']
          }
        },
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom']
    },
    define: {
      // Explicitly pass environment variables to the client
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify(env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY),
      'import.meta.env.VITE_N8N_AUTH_TOKEN': JSON.stringify(env.VITE_N8N_AUTH_TOKEN || process.env.VITE_N8N_AUTH_TOKEN),
      'import.meta.env.VITE_N8N_AUTH_HEADER_NAME': JSON.stringify(env.VITE_N8N_AUTH_HEADER_NAME || process.env.VITE_N8N_AUTH_HEADER_NAME),
      'import.meta.env.VITE_N8N_AUTH_HEADER_VALUE': JSON.stringify(env.VITE_N8N_AUTH_HEADER_VALUE || process.env.VITE_N8N_AUTH_HEADER_VALUE),
      'import.meta.env.VITE_N8N_PROXY_URL': JSON.stringify(env.VITE_N8N_PROXY_URL || process.env.VITE_N8N_PROXY_URL)
    }
  };
});
