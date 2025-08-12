# PROJECT_SNAPSHOT.md

## 📋 Project Overview

**Project Name**: rsvp-next  
**Type**: Next.js RSVP Form Application with Google Apps Script Backend  
**Root Path**: `/Users/evyatarlidani/Desktop/rsvp-next`  
**Git Root**: `/Users/evyatarlidani/Desktop/rsvp-next`

## 🗂️ Directory Structure (Essential Files Only)

```
rsvp-next/
├── .clasp.json                    # Google Apps Script configuration
├── appsscript.json                # Google Apps Script manifest
├── קוד.js                         # Google Apps Script main code
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── api/                   # API Routes
│   │   │   ├── submit/route.ts    # RSVP submission endpoint
│   │   │   └── calendar/route.ts  # Calendar integration
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Main page
│   ├── components/                # React components
│   │   ├── forms/                 # Form components
│   │   ├── ui/                    # UI components
│   │   ├── RSVPForm.tsx           # Main RSVP form
│   │   ├── WeddingInvitation.tsx  # Wedding invitation
│   │   └── ...                    # Other components
│   ├── hooks/                     # Custom React hooks
│   │   ├── useRSVPForm.ts         # RSVP form logic
│   │   └── useConfetti.ts         # Confetti animation
│   ├── lib/                       # Utility libraries
│   │   ├── validations.ts         # Zod validation schemas
│   │   ├── googleSheets.ts        # Google Sheets integration
│   │   └── confetti.ts            # Confetti utilities
│   ├── utils/                     # Utility functions
│   └── styles/                    # Global styles
├── public/                        # Static assets
│   ├── site.webmanifest           # PWA manifest
│   ├── favicon.ico                # Favicon
│   └── ...                        # Images and assets
├── package.json                   # Dependencies and scripts
├── next.config.ts                 # Next.js configuration
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── vercel.json                    # Vercel deployment configuration
└── postcss.config.mjs             # PostCSS configuration
```

## ⚙️ Configuration Files Summary

### package.json

- **Framework**: Next.js 15.4.5 (React 19.1.0)
- **Key Dependencies**: framer-motion, react-hot-toast, zod, canvas-confetti
- **Testing**: Jest, Playwright, Testing Library
- **Scripts**: dev, build, test, test:e2e, analyze

### next.config.ts

- **Experimental**: Package import optimization
- **Performance**: Compression, tree shaking, image optimization
- **Headers**: Custom headers for webmanifest and security
- **Webpack**: Bundle optimization for production

### tsconfig.json

- **Target**: ES2017
- **Paths**: `@/*` alias to `./src/*`
- **Strict**: Enabled
- **JSX**: Preserve mode

### tailwind.config.ts

- **Custom Screens**: xs, sm, md, lg, xl, 2xl
- **Custom Animations**: fade-in, slide-up, scale-in, bounce-gentle
- **Custom Colors**: CSS variables for theme
- **Content**: src/pages, src/components, src/app

### vercel.json

- **Rewrites**: `/api/submit` → Google Apps Script endpoint
- **Headers**: Security headers (XSS, frame options)
- **Manifest**: Proper Content-Type for webmanifest

### appsscript.json (Google Apps Script)

- **Timezone**: Asia/Jerusalem
- **Runtime**: V8
- **Web App**: Anonymous access, user deploying execution
- **Logging**: Stackdriver exception logging

## 🛣️ Routes & API Endpoints

### Frontend Routes

- **`/`** → `src/app/page.tsx` (Main RSVP form page)
- **Layout** → `src/app/layout.tsx` (Root layout with error boundary)

### API Routes

- **`/api/submit`** → `src/app/api/submit/route.ts` (RSVP form submission)
- **`/api/calendar`** → `src/app/api/calendar/route.ts` (Calendar integration)

## 🧩 Components & Logic

### Core Components

- **RSVPForm.tsx**: Main form component with validation
- **WeddingInvitation.tsx**: Wedding invitation display
- **WeddingCountdown.tsx**: Countdown timer component
- **Confetti.tsx**: Confetti animation component
- **ErrorBoundary.tsx**: Error handling wrapper

### Custom Hooks

- **useRSVPForm.ts**: Form state management and submission logic
- **useConfetti.ts**: Confetti animation hook

### Libraries

- **validations.ts**: Zod schemas for form validation
- **googleSheets.ts**: Google Sheets integration utilities
- **confetti.ts**: Confetti animation utilities

## 🔧 Google Apps Script Integration

### Files Location

- **Root Directory**: `.clasp.json`, `appsscript.json`, `קוד.js`

### Main Functions

- **doPost()**: Handles RSVP form submissions
- **doGet()**: Retrieves existing RSVP data
- **findRowById()**: Searches for existing entries
- **onEdit()**: Auto-updates timestamps

### Configuration

- **Sheet ID**: `1CVsub2vsHRFPGV-9Hh_nmWIi2A6_Yhq4gUDf-9-a1go`
- **Sheet Name**: "RSVP Responses"
- **Access**: Anonymous, executes as deploying user

## 🛠️ Development Environment

### Versions

- **Node.js**: v20.19.3
- **npm**: 10.8.2
- **Next.js**: 15.4.5 (upgrade to 15.4.6 recommended)
- **React**: 19.1.0
- **TypeScript**: 5.9.2

### Platform

- **OS**: macOS (Darwin 24.6.0)
- **Architecture**: arm64
- **Memory**: 16GB available
- **CPU**: 8 cores

## 🔑 Key Paths (YAML)

```yaml
key_paths:
  next_root: "/Users/evyatarlidani/Desktop/rsvp-next"
  app_dir: "src/app"
  pages_dir: null
  api_dir: "src/app/api"
  components_dir: "src/components"
  hooks_dir: "src/hooks"
  lib_dir: "src/lib"
  utils_dir: "src/utils"
  apps_script_dir: "."
  env_files: []
  vercel_config: "vercel.json"
  public_dir: "public"
  styles_dir: "src/styles"
  tests_dir: "src/components/__tests__,src/hooks/__tests__,src/lib/__tests__,src/app/api/__tests__"
```

## 📊 Production Readiness Checklist

### ✅ Completed

- [x] Next.js App Router setup
- [x] TypeScript configuration
- [x] Tailwind CSS styling
- [x] Form validation with Zod
- [x] Google Apps Script integration
- [x] Vercel deployment configuration
- [x] Error boundaries
- [x] Testing setup (Jest + Playwright)
- [x] PWA manifest
- [x] Security headers

### ⚠️ Recommendations

- [ ] Upgrade Next.js to 15.4.6
- [ ] Add environment variables for Google Apps Script URL
- [ ] Implement rate limiting for API endpoints
- [ ] Add monitoring and analytics
- [ ] Set up CI/CD pipeline
- [ ] Add accessibility testing
- [ ] Implement caching strategies

## 🔗 External Integrations

### Google Services

- **Google Apps Script**: Form submission backend
- **Google Sheets**: Data storage (Sheet ID: 1CVsub2vsHRFPGV-9Hh_nmWIi2A6_Yhq4gUDf-9-a1go)
- **Google Calendar**: Event integration

### Deployment

- **Vercel**: Production hosting
- **Git**: Version control

---

_Generated on: 2025-01-12_  
_Project Status: Production Ready_  
_Last Updated: Current session_
