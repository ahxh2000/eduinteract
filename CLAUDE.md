# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EduInteract is an interactive educational tools platform built with Next.js 15 and React 18. It provides teachers and students with 120+ interactive educational tools across multiple subjects (math, physics, chemistry, biology, geography, history, Chinese, English). The platform includes both a public-facing interface for browsing tools and an admin backend for managing them.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:cloudflare` - Build for Cloudflare Pages deployment
- `npm run start` - Start production server
- `npm run preview` - Preview Cloudflare Pages build locally (wrangler pages dev)
- `npm run lint` - Run ESLint

## Architecture

### Frontend Structure
- **App Router**: Uses Next.js 15 app directory structure
- **Components**: Located in `src/components/`
- **Pages**: Admin routes in `src/app/admin/`, public routes in `src/app/`
- **TypeScript**: Strict TypeScript configuration with database types in `src/types/database.ts`
- **Path Alias**: `@/*` maps to `./src/*` for cleaner imports (configured in tsconfig.json)

### Key Features
1. **Public Interface** (`src/app/page.tsx`):
   - Tool browsing with subject filtering
   - Subject categories: math, physics, chemistry, biology, geography, history, chinese, english
   - Grid/masonry layout for tool cards
   - Search functionality (UI only, backend integration pending)

2. **Admin System**:
   - Admin authentication via `AdminAuth` component
   - Admin layout with sidebar navigation (`AdminLayout`)
   - Tool management: CRUD operations, status control (active/inactive)
   - Tool upload functionality
   - Pagination and filtering in admin tools list

### Database Schema
The main `Tool` interface (src/types/database.ts:1-12):
```typescript
interface Tool {
  id: string
  title: string
  subject: string  // subject key only (math, physics, etc.)
  description: string
  file_url: string
  views: number
  created_at: string
  updated_at: string
  is_active: boolean
}
```

### Subject Configuration
Centralized subject mapping in `src/lib/subjectConfig.ts`:
- Colors and labels are defined in `subjectConfig` export, not stored in database
- Subject keys: math, physics, chemistry, biology, geography, history, chinese, english
- Includes TypeScript type `SubjectKey` for type safety

### Admin Authentication
- Uses `AdminAuth` component wrapper for admin routes
- Simple session-based authentication (implementation details in `AdminAuth.tsx`)

## Important Implementation Details

### Subject Handling
- Database stores only subject keys (e.g., "math", "physics")
- UI components use centralized `subjectConfig` from `src/lib/subjectConfig.ts` to map keys to display labels and colors
- Components import `SubjectKey` type for type-safe subject references

### File Management
- Tools have `file_url` pointing to hosted interactive tool files
- Admin interface includes file upload functionality
- File deletion is handled when deleting tools

### Admin Routes Structure
- `/admin/login` - Admin login page
- `/admin/dashboard` - Admin dashboard
- `/admin/tools` - Tool management list
- `/admin/tools/upload` - Upload new tools
- `/admin/tools/[id]` - Tool details
- `/admin/tools/[id]/edit` - Edit existing tools

### API Integration
- Uses `/api/tools` endpoint for tool data
- Admin requests include `X-Request-Source: admin` header
- Implements standard REST operations (GET, POST, PUT, DELETE)
- Edge Runtime enabled for all API routes for Cloudflare compatibility
- In-memory caching system for public requests (2-minute cache duration)
- Admin requests bypass cache to ensure real-time data

### API Structure
The application includes several API endpoints:
- `/api/tools` - Main tools endpoint with caching and admin support
- `/api/tools/[id]` - Individual tool operations (GET, PUT, DELETE)
- `/api/upload` - File upload handling
- `/api/files` - File management operations
- `/api/admin/login` - Admin authentication
- `/api/admin/verify` - Admin session verification

### Caching System
- In-memory caching for public API requests (2-minute duration)
- Cache bypassed for admin requests (`X-Request-Source: admin` header)
- Automatic cache cleanup and invalidation
- Cache keys based on subject filtering
- DELETE endpoint available for manual cache clearing

### Edge Runtime Configuration
- All API routes use `export const runtime = 'edge'`
- In-memory caching implemented for edge environment compatibility
- External packages configured: `@supabase/supabase-js`
- Cache cleanup and validation optimized for edge runtime constraints
- Supabase client configured with `persistSession: false` and `autoRefreshToken: false` for edge compatibility (see `src/lib/supabase.ts`)

## Development Notes

### Cloudflare Pages Deployment
- Project is configured for Cloudflare Pages deployment
- Uses `@cloudflare/next-on-pages` adapter
- Edge Runtime is enabled for all API routes (see `export const runtime = 'edge'`)
- Image optimization is disabled (`unoptimized: true`) for Cloudflare compatibility
- R2 storage bucket URLs need to be configured in `next.config.js`

### Styling
- Uses Tailwind CSS for styling
- Custom color scheme with primary, secondary, tertiary colors
- Responsive design with mobile-first approach

### Chinese Language Support
- UI text is in Chinese
- Date formatting uses Chinese locale (`zh-CN`)
- Subject labels are in Chinese

### Storage Configuration
- Uses AWS S3 SDK for file storage operations
- Configured for Cloudflare R2 storage (compatibility mode)
- File upload and management through dedicated API endpoints
- Storage bucket URLs need configuration in `next.config.js`

### Pending Features
Based on README.md, the following features are planned:
- Advanced tool filtering and search
- Batch operations for tools
- Usage statistics and analytics
- Operation logging
- Tool approval workflow

## Environment Variables

Required environment variables (see `.env.example`):
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `R2_ACCOUNT_ID` - Cloudflare R2 account ID
- `R2_ACCESS_KEY_ID` - R2 access key ID
- `R2_SECRET_ACCESS_KEY` - R2 secret access key
- `R2_BUCKET_NAME` - R2 bucket name
- `FILE_BASE_URL` - Base URL for serving uploaded files
- `ADMIN_PASSWORD` - Optional admin authentication password