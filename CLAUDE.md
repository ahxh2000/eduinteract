# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EduInteract is an interactive educational tools platform built with Next.js 14 and React 18. It provides teachers and students with 120+ interactive educational tools across multiple subjects (math, physics, chemistry, biology, geography, history, Chinese, English). The platform includes both a public-facing interface for browsing tools and an admin backend for managing them.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

### Frontend Structure
- **App Router**: Uses Next.js 14 app directory structure
- **Components**: Located in `src/components/`
- **Pages**: Admin routes in `src/app/admin/`, public routes in `src/app/`
- **TypeScript**: Strict TypeScript configuration with database types in `src/types/database.ts`

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
Hardcoded subject mapping in components (see `src/app/page.tsx:11-18`):
- Colors and labels are defined locally, not stored in database
- Subject keys: math, physics, chemistry, biology, geography, history, chinese, english, other

### Admin Authentication
- Uses `AdminAuth` component wrapper for admin routes
- Simple session-based authentication (implementation details in `AdminAuth.tsx`)

## Important Implementation Details

### Subject Handling
- Database stores only subject keys (e.g., "math", "physics")
- UI components map keys to display labels and colors
- Subject configuration is hardcoded in frontend components

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

## Development Notes

### Styling
- Uses Tailwind CSS for styling
- Custom color scheme with primary, secondary, tertiary colors
- Responsive design with mobile-first approach

### Chinese Language Support
- UI text is in Chinese
- Date formatting uses Chinese locale (`zh-CN`)
- Subject labels are in Chinese

### Pending Features
Based on README.md, the following features are planned:
- Advanced tool filtering and search
- Batch operations for tools
- Usage statistics and analytics
- Operation logging
- Tool approval workflow