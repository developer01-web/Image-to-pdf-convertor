# Image to PDF Converter

## Overview

A modern web application that converts image files (JPEG, PNG, BMP, WEBP) to PDF documents. The application is built as a full-stack solution with a React frontend and Express backend, featuring client-side PDF generation for enhanced security and privacy.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom design tokens and dark mode support
- **State Management**: TanStack Query for server state and React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **PDF Generation**: Client-side PDF creation using pdf-lib library

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Neon serverless database
- **ORM**: Drizzle ORM for type-safe database operations
- **Development**: Vite middleware integration for hot reloading
- **Data Tracking**: Conversion analytics and usage statistics stored in database

### Design System
- **Component Library**: Custom shadcn/ui components built on Radix UI primitives
- **Theme**: "New York" style variant with neutral base colors
- **Typography**: Inter font family for consistent branding
- **Responsive Design**: Mobile-first approach with breakpoint utilities

## Key Components

### PDF Conversion Engine
- **Client-side Processing**: All PDF generation happens in the browser for privacy
- **Image Processing**: Support for JPEG, PNG, BMP, and WEBP formats
- **Format Conversion**: Automatic PNG conversion for non-JPEG images
- **Quality Control**: Configurable compression settings

### User Interface Components
- **Upload Zone**: Drag-and-drop file upload with validation
- **File Management**: List view with remove functionality
- **Image Reordering**: Drag-and-drop reordering of images
- **Settings Panel**: Comprehensive PDF customization options
- **Preview Modal**: PDF preview before download

### Settings & Customization
- **Page Orientation**: Portrait or landscape options
- **Image Fitting**: Multiple scaling modes (contain, cover, stretch, center)
- **Margins**: Adjustable page margins
- **Headers/Footers**: Custom text content
- **Watermarks**: Optional text overlays
- **Quality Settings**: High, medium, low compression levels

## Data Flow

1. **File Upload**: Users drag/drop or select image files
2. **Validation**: Client-side validation for file types and sizes
3. **Preview**: Optional PDF preview generation
4. **Processing**: Client-side PDF creation with user settings
5. **Download**: Generated PDF delivered directly to user

## External Dependencies

### Production Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database queries
- **pdf-lib**: Client-side PDF generation
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: UI component primitives
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **Vite**: Fast build tool and dev server
- **TypeScript**: Type safety and development experience
- **ESBuild**: Fast JavaScript bundler for production
- **PostCSS**: CSS processing pipeline

### External Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Google AdSense**: Monetization through advertisements
- **Google Fonts**: Web font delivery (Inter family)

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: ESBuild bundles Express server to `dist/index.js`
- **Assets**: Static files served from build directory

### Environment Requirements
- **Node.js**: ES modules support required
- **Database**: PostgreSQL connection via `DATABASE_URL`
- **Migrations**: Drizzle migrations in `./migrations` directory

### Performance Optimizations
- **Code Splitting**: Automatic chunk splitting by Vite
- **Asset Optimization**: Image and font optimization
- **Caching**: Browser caching for static assets
- **Bundle Analysis**: Production bundle size monitoring

## Changelog
- June 28, 2025: Initial setup with complete Image to PDF Converter
- June 28, 2025: Moved ad banner positioning below upload section per user request
- June 28, 2025: Ensured all features are free with "Mr 1" attribution throughout
- June 28, 2025: Added PostgreSQL database integration for tracking conversions and analytics
- July 2, 2025: Implemented comprehensive SEO optimization with structured data and meta tags
- July 2, 2025: Added responsive ad placements following Google AdSense best practices
- July 2, 2025: Created interstitial ads that display after successful conversions
- July 2, 2025: Optimized ad sizes for desktop (728x90) and mobile (320x100) platforms

## User Preferences

Preferred communication style: Simple, everyday language.
- All conversion tools should be completely free with no upgrade prompts
- Ad banner positioning: Strategic placement following Google AdSense best practices
- Attribution: "Mr 1" should appear throughout the site
- SEO optimization: Comprehensive meta tags and structured data for better visibility
- Ad monetization: Responsive ad placements with desktop (728x90) and mobile (320x100) formats
- User experience: Interstitial ads only after successful conversions to maximize engagement