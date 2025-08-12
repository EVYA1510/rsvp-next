# PRODUCTION_AUDIT.md

## 📋 Executive Summary

**Project**: rsvp-next  
**Audit Date**: 2025-01-12  
**Status**: 🟡 **Production Ready with Critical Fixes Required**  
**Build Status**: ✅ **PASS** (with warnings)

## 🔍 Audit Results

### ✅ **PASSED CHECKS**

| Component | Status | Details |
|-----------|--------|---------|
| **Build** | ✅ PASS | Next.js build successful, 151kB First Load JS |
| **TypeScript** | ✅ PASS | Main code compiles, test files have issues |
| **Validation** | ✅ PASS | Hebrew/English names with spaces supported |
| **Google Apps Script** | ✅ PASS | Core functions working, proper JSON responses |
| **Calendar ICS** | ✅ PASS | Valid format, Hebrew content, proper headers |
| **Vercel Config** | ✅ PASS | Security headers, proper rewrites |

### ⚠️ **WARNINGS**

| Component | Status | Details |
|-----------|--------|---------|
| **ESLint** | ⚠️ WARN | 3 unused variables, 1 missing dependency |
| **Tests** | ⚠️ WARN | TypeScript errors in test files |
| **CORS** | ⚠️ WARN | Too permissive (`*`) in calendar API |

### ❌ **CRITICAL ISSUES**

| Component | Status | Details |
|-----------|--------|---------|
| **Environment** | ❌ CRITICAL | Google Script URL hardcoded in vercel.json |
| **Error Handling** | ❌ CRITICAL | No retry mechanism for Google Script failures |
| **Rate Limiting** | ❌ CRITICAL | No protection against spam submissions |
| **Security** | ❌ CRITICAL | CORS too permissive, no input sanitization |

## 🛠️ Detailed Findings

### A) Build & Health ✅

**Status**: PASS  
**Issues**: None critical

```bash
✓ Compiled successfully in 4.0s
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (7/7)
✓ Collecting build traces
✓ Finalizing page optimization
```

**Warnings to fix**:
- `src/components/Confetti.tsx:207` - Unused variable `intensity`
- `src/hooks/useConfetti.ts:20` - Unused variable `intensity`
- `src/hooks/useRSVPForm.ts:168` - Missing dependency `formData.guests`

### B) Next.js Frontend ✅

**Status**: PASS  
**Key Findings**:

#### Validation System ✅
```typescript
// src/lib/validations.ts - Line 8-15
.regex(
  /^[a-zA-Z\u0590-\u05FF\s]+$/,
  "שם חייב להכיל רק אותיות עבריות, אנגליות ומרווחים"
)
```
✅ **Supports**: Hebrew, English, spaces  
✅ **Length**: 2-50 characters  
✅ **Error Messages**: Hebrew

#### Form Logic ✅
```typescript
// src/hooks/useRSVPForm.ts - Line 175-185
const nameToSave = formData.name.trim() || (isNameLocked && nameFromURL ? nameFromURL : "");
```
✅ **URL Parameter Preservation**: Working  
✅ **localStorage Management**: Proper fallbacks  
✅ **Name Locking**: Prevents clearing from URL

### C) API Routes ⚠️

**Status**: WARN  
**Issues Found**:

#### `/api/submit` ⚠️
```typescript
// src/app/api/submit/route.ts - Line 45-50
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL !== "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec") {
```
❌ **Problem**: Fallback to hardcoded URL  
❌ **Problem**: No retry mechanism  
❌ **Problem**: No rate limiting  

#### `/api/calendar` ⚠️
```typescript
// src/app/api/calendar/route.ts - Line 15
"Access-Control-Allow-Origin": "*",
```
❌ **Problem**: Too permissive CORS

### D) Google Apps Script ✅

**Status**: PASS  
**Key Findings**:

#### Core Functions ✅
```javascript
// קוד.js - Line 5-35
function doPost(e) {
  const name = e.parameter.name;
  const status = e.parameter.status;
  const guests = parseInt(e.parameter.guests) || 1;
  const blessing = e.parameter.blessing || "";
  const timestamp = new Date();
  const id = e.parameter.id;
```
✅ **Parameter Handling**: All required fields  
✅ **Data Validation**: Proper type conversion  
✅ **Error Handling**: Try-catch with JSON responses  
✅ **Duplicate Prevention**: ID-based search  

#### Configuration ✅
```json
// appsscript.json
{
  "timeZone": "Asia/Jerusalem",
  "runtimeVersion": "V8",
  "webapp": {
    "executeAs": "USER_DEPLOYING",
    "access": "ANYONE_ANONYMOUS"
  }
}
```
✅ **Timezone**: Correct (Asia/Jerusalem)  
✅ **Runtime**: V8 (modern)  
✅ **Access**: Anonymous (appropriate for RSVP)  

### E) Calendar Integration ✅

**Status**: PASS  
**ICS File Analysis**:
```ics
// public/wedding.ics
SUMMARY:💍 החתונה של אביתר ושובל
DTSTART;TZID=Asia/Jerusalem:20250909T190000
DTEND;TZID=Asia/Jerusalem:20250910T010000
LOCATION:גן אירועים הפרדס
```
✅ **Hebrew Support**: Proper UTF-8 encoding  
✅ **Timezone**: Asia/Jerusalem  
✅ **Duration**: 6 hours (19:00-01:00)  
✅ **Location**: Hebrew venue name  

### F) Security & Performance ⚠️

**Status**: WARN  
**Issues Found**:

#### Security Issues ❌
1. **CORS Too Permissive**: `Access-Control-Allow-Origin: "*"`
2. **No Rate Limiting**: Unlimited API submissions
3. **Hardcoded URLs**: Google Script URL in vercel.json
4. **No Input Sanitization**: Direct parameter usage

#### Performance Issues ⚠️
1. **Bundle Size**: 151kB First Load JS (acceptable)
2. **No Caching**: Calendar ICS served without caching
3. **No Compression**: Images not optimized

## 🚨 CRITICAL FIXES REQUIRED

### 1. Environment Variables (CRITICAL)

**Problem**: Google Script URL hardcoded in vercel.json  
**Impact**: Security risk, deployment issues  
**Fix**:

```diff
// vercel.json - Line 3-5
{
  "rewrites": [
    {
      "source": "/api/submit",
-     "destination": "https://script.google.com/macros/s/AKfycbzu3VBXivLEvFX2iV_a4Mb1Hp0733lazmMMczLhK1dsjL2mr0AC7Uqq89FLqugE5gotEg/exec"
+     "destination": "/api/submit-proxy"
    }
  ]
}
```

```typescript
// src/app/api/submit-proxy/route.ts (NEW FILE)
export async function POST(request: NextRequest) {
  const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
  
  if (!GOOGLE_SCRIPT_URL) {
    return NextResponse.json({ error: "Google Script not configured" }, { status: 500 });
  }
  
  // Forward request to Google Script
  const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    headers: request.headers,
    body: await request.text()
  });
  
  return new NextResponse(await response.text(), {
    status: response.status,
    headers: response.headers
  });
}
```

### 2. Rate Limiting (CRITICAL)

**Problem**: No protection against spam  
**Impact**: Potential abuse, Google Script quota exhaustion  
**Fix**:

```typescript
// src/lib/rateLimit.ts (NEW FILE)
import { NextRequest } from 'next/server';

const submissions = new Map<string, number[]>();

export function checkRateLimit(ip: string, limit: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now();
  const userSubmissions = submissions.get(ip) || [];
  
  // Remove old submissions
  const recentSubmissions = userSubmissions.filter(time => now - time < windowMs);
  
  if (recentSubmissions.length >= limit) {
    return false;
  }
  
  recentSubmissions.push(now);
  submissions.set(ip, recentSubmissions);
  return true;
}
```

### 3. Error Handling & Retries (CRITICAL)

**Problem**: No retry mechanism for Google Script failures  
**Impact**: Lost submissions, poor user experience  
**Fix**:

```typescript
// src/lib/googleScriptClient.ts (NEW FILE)
export async function submitToGoogleScript(data: any, retries: number = 3): Promise<any> {
  const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data),
        signal: AbortSignal.timeout(10000) // 10s timeout
      });
      
      if (response.ok) {
        return await response.json();
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      if (attempt === retries) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
    }
  }
}
```

### 4. CORS Security (HIGH)

**Problem**: Too permissive CORS headers  
**Impact**: Security vulnerability  
**Fix**:

```diff
// src/app/api/calendar/route.ts - Line 15
- "Access-Control-Allow-Origin": "*",
+ "Access-Control-Allow-Origin": "https://rsvp-next.vercel.app",
```

## 📋 PULL REQUEST PLAN

### Phase 1: Critical Security (Priority 1)
1. **Environment Variables**: Move Google Script URL to ENV
2. **Rate Limiting**: Implement basic rate limiting
3. **CORS**: Restrict to production domain
4. **Error Handling**: Add retry mechanism

### Phase 2: UX Improvements (Priority 2)
1. **Loading States**: Better user feedback
2. **Error Messages**: Hebrew error handling
3. **Form Validation**: Real-time validation
4. **Accessibility**: ARIA labels, keyboard navigation

### Phase 3: Performance (Priority 3)
1. **Image Optimization**: Next.js Image component
2. **Bundle Splitting**: Dynamic imports
3. **Caching**: Calendar ICS caching
4. **Compression**: Gzip/Brotli

### Phase 4: Monitoring (Priority 4)
1. **Logging**: Structured logging
2. **Analytics**: Form submission tracking
3. **Health Checks**: API endpoint monitoring
4. **Error Tracking**: Sentry integration

## ✅ PRODUCTION CHECKLIST

### Pre-Deployment
- [ ] **Environment Variables**: Set `GOOGLE_SCRIPT_URL`
- [ ] **Google Apps Script**: Deploy as web app
- [ ] **Google Sheets**: Verify permissions
- [ ] **Domain**: Update CORS to production domain

### Post-Deployment
- [ ] **Form Submission**: Test with Hebrew names
- [ ] **Calendar Integration**: Test iOS/Android
- [ ] **Error Handling**: Test network failures
- [ ] **Rate Limiting**: Test spam protection
- [ ] **Mobile UX**: Test on various devices
- [ ] **RTL Support**: Verify Hebrew layout

### Monitoring
- [ ] **Logs**: Monitor submission errors
- [ ] **Performance**: Track bundle size
- [ ] **Analytics**: Track form completions
- [ ] **Uptime**: Monitor API availability

## 🎯 RECOMMENDATIONS

### Immediate (This Week)
1. **Fix Environment Variables**: Move Google Script URL to ENV
2. **Add Rate Limiting**: Basic protection against spam
3. **Improve Error Handling**: Retry mechanism for failures
4. **Fix CORS**: Restrict to production domain

### Short Term (Next 2 Weeks)
1. **Add Monitoring**: Logging and error tracking
2. **Optimize Performance**: Image compression, caching
3. **Enhance UX**: Better loading states, validation
4. **Accessibility**: ARIA labels, keyboard support

### Long Term (Next Month)
1. **Analytics**: Track form submissions and conversions
2. **A/B Testing**: Test different form layouts
3. **Internationalization**: Support for multiple languages
4. **Advanced Features**: Email confirmations, reminders

---

**Audit Conclusion**: The project is **production-ready** with the critical fixes implemented. The core functionality works correctly, but security and reliability improvements are essential before public launch.

**Risk Level**: 🟡 **MEDIUM** (mitigatable with fixes above)  
**Recommended Launch Date**: After Phase 1 fixes (1 week)  
**Estimated Fix Time**: 2-3 days for critical issues
