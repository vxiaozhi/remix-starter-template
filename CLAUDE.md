# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Remix full-stack application built for Cloudflare Workers deployment. The application currently serves as a Chinese birthday celebration page with customizable features, including personalized greetings and background music.

## Technology Stack

- **Framework**: Remix 2.17.2 with Vite
- **Runtime**: Cloudflare Workers
- **Language**: TypeScript
- **Styling**: Tailwind CSS with PostCSS
- **UI**: React 18 with client-side features

## Development Commands

```bash
# Development server with hot reload
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Build for production
npm run build

# Deploy to Cloudflare Workers
npm run deploy

# Generate Cloudflare binding types
npm run typegen

# Full check (typecheck + build + dry-run deploy)
npm run check
```

## Architecture

### Remix Configuration
- Uses Remix's Vite plugin with Cloudflare Workers proxy
- Configured with Remix v3 features enabled including `v3_singleFetch`
- Path alias `~/*` maps to `./app/*`

### Application Structure
- `app/root.tsx`: Root layout with Tailwind CSS imports and Google Fonts (Inter)
- `app/routes/_index.tsx`: Main birthday celebration page component
- `app/entry.server.tsx`: Server-side rendering entry point
- `app/entry.client.tsx`: Client-side hydration entry point
- `load-context.ts`: Cloudflare Workers load context configuration

### Key Features
The main application is a birthday celebration page with:
- Personalized name input stored in localStorage
- Background music URL configuration and playback controls
- Animated SVG birthday cake with floating effects
- Chinese language interface with customizable settings
- Dark mode support via Tailwind classes
- Responsive design for mobile and desktop

### Deployment Configuration
- `wrangler.json`: Cloudflare Workers configuration
- Assets served from `./build/client` directory
- Source maps and observability enabled

## Development Notes

### Styling
- Uses Tailwind CSS with custom animations
- Component includes inline CSS for marquee effects
- Dark mode classes implemented throughout
- Responsive breakpoints with `md:` and `lg:` prefixes

### State Management
- Uses React hooks for local state
- localStorage persistence for user settings (name, music URL)
- Audio playback controlled with useRef and useState

### Internationalization
- All UI text is in Chinese (Simplified)
- Component includes hardcoded Chinese labels and messages

## File Context

The project contains a single interactive birthday page component with extensive SVG animations and customization options. When working with this codebase:

- Be aware that all user-facing text is in Chinese
- The application is designed for client-side interactions (localStorage, audio playback)
- Tailwind classes are used extensively for styling and animations
- The main component is large (350+ lines) with inline SVG animations