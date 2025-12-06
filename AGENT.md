# Agent Instructions for Senior Tech Connect

## Commands
- **Build**: `npm run build` (or `npm run build:vercel` for Vercel, `npm run build:bluehost` for Bluehost)
- **Dev server**: `npm run dev`
- **Lint**: `npm run lint`
- **Type check**: `npm run type-check`
- **Test API**: `npm run test:api`
- **Database**: `npx prisma migrate dev` (setup), `npx prisma generate` (after schema changes)

## Architecture
- **Framework**: Next.js 14 with App Router, TypeScript, and React 18
- **UI**: Chakra UI (primary) + Tailwind CSS (utilities)
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js with Prisma adapter
- **Key directories**: `/app` (pages/API routes), `/components` (reusable UI), `/lib` (utilities), `/prisma` (database)

## Code Style
- **Imports**: Use absolute paths with `@/` prefix, Chakra UI components first, then hooks/utils
- **Components**: Functional components with TypeScript interfaces, `'use client'` for client components
- **Naming**: camelCase for variables/functions, PascalCase for components, kebab-case for files
- **Types**: Strict TypeScript with interfaces defined inline or in separate files
- **Error handling**: Try-catch blocks with console.error, graceful fallbacks
- **WebRTC**: Uses custom `useWebRTC` hook for video calls, privacy-focused cleanup required
