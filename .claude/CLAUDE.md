# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Violet-production is a React + TypeScript application built with Vite, using shadcn/ui components, Tailwind CSS for styling, and Supabase for backend services. The application includes authentication, dashboard functionality, and webhook integration with n8n.

## Core Commands

### Development
- `npm run dev` - Start Vite dev server on port 8080
- `npm run preview` - Preview production build locally

### Build & Production
- `npm run build` - Production build with environment checks (runs check-env script first)
- `npm run build:dev` - Development build mode for debugging

### Code Quality
- `npm run lint` - Run ESLint for code linting

### Environment Management
- `npm run check-env` - Validate environment variables before build

## Architecture Overview

### Directory Structure
- `/src/components` - Reusable UI components (shadcn/ui based)
- `/src/pages` - Page components (Auth, Dashboard, Profile, LandingPage, etc.)
- `/src/lib` - Utility functions and shared logic
- `/src/hooks` - Custom React hooks
- `/src/integrations` - External service integrations
- `/src/contexts` - React context providers
- `/src/types` - TypeScript type definitions

### Core Technologies
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast compilation
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **Styling**: Tailwind CSS with custom configuration
- **State Management**: React Query (@tanstack/react-query)
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation
- **Backend**: Supabase (Authentication & Database)
- **Webhooks**: n8n integration

### Key Integrations

#### Supabase Configuration
The app uses Supabase for authentication and database:
- Connection configured via `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
- Integration likely in `/src/integrations/supabase/`
- Auth flows handled in `/src/pages/Auth.tsx`

#### n8n Webhook Integration
External workflow automation via n8n:
- Webhook URL: `VITE_N8N_WEBHOOK_URL`
- Auth header configuration: `VITE_N8N_AUTH_HEADER_NAME` and `VITE_N8N_AUTH_HEADER_VALUE`
- Test files available: `test-webhook.html`, `test-contact-form.html`

### Path Aliasing
- `@/` maps to `./src/` directory for clean imports

### Component Library
The project uses shadcn/ui components configured in `components.json`:
- Style: New York
- Base color: Zinc
- CSS variables for theming enabled

### Build Optimization
The Vite configuration includes:
- Code splitting for vendor chunks (React, UI libraries, Supabase)
- Manual chunk configuration for optimal loading
- Component tagging in development (Lovable integration)

## Important Conventions

### Environment Variables
All client-side environment variables must be prefixed with `VITE_` to be accessible in the browser. The build process validates these variables using `scripts/check-env.js`.

### Component Development
When creating new components:
1. Use shadcn/ui components from `/src/components/ui/` as base
2. Follow TypeScript strict typing patterns
3. Use Tailwind CSS for styling (avoid inline styles)
4. Implement proper form validation with React Hook Form + Zod

### Authentication Flow
Auth is managed through Supabase with dedicated Auth page at `/src/pages/Auth.tsx`. Profile management is handled in `/src/pages/Profile.tsx`.

### Deployment
- Project originally created with Lovable (project ID: e1c4d02e-920d-45b5-ad9e-fc0c7d93b45c)
- Vercel configuration available (`vercel.json`)
- Build command validates environment before production build

## Claude Flow & MCP Configuration

The project includes Claude Flow orchestration with:
- `.claude-flow/` directory for flow configurations
- `.mcp.json` for MCP server configurations
- `.hive-mind/` and `.swarm/` for agent coordination
- `/coordination` and `/memory` directories for distributed processing

See the existing CLAUDE.md in the parent directory for comprehensive Claude Flow usage patterns and agent coordination protocols.