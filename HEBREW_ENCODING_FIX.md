# Hebrew Text Encoding Fix - RSVP Form

## 🚨 Problem Description

**Issue**: Hebrew text was being stored as URL-encoded strings (like `%D7%90%D7%91%D7%99%D7%AA%D7%A8`) in the Google Sheet instead of readable Hebrew characters.

**Example from Google Sheet**:

- **Before**: `%D7%90%D7%91%D7%99%D7%AA%D7%A8%20%D7%9C%D7%99%D7%93%D7%A0%D7%99`
- **After**: `אביתר לידני`

## 🔍 Root Cause Analysis

The issue was **double encoding** happening in the data flow:

### 1. First Encoding (Automatic)

**Location**: `src/hooks/useRSVPForm.ts` lines 275-280

```typescript
const urlParams = new URLSearchParams();
urlParams.append("name", submissionName); // URLSearchParams automatically encodes
urlParams.append("status", formData.status);
// ... etc
```

### 2. Second Encoding (Manual - THE PROBLEM)

**Location**: `src/lib/googleScriptClient.ts` lines 25-30

```typescript
// ❌ PROBLEMATIC CODE - Double encoding
body: new URLSearchParams(
  Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      typeof value === 'string' ? encodeURIComponent(value) : value  // ❌ Double encoding!
    ])
  )
),
```

### 3. Google Apps Script (No Decoding)

**Location**: `קוד.js` line 7-12

```javascript
// ❌ No decoding - stores encoded data directly
const name = e.parameter.name; // Already encoded from double encoding above
const status = e.parameter.status;
```

## 🛠️ The Fix

### 1. Remove Double Encoding in Next.js

**File**: `src/lib/googleScriptClient.ts`

```typescript
// ✅ FIXED CODE - Single encoding only
body: new URLSearchParams(data),  // URLSearchParams handles encoding automatically
```

### 2. Add Decoding in Google Apps Script

**File**: `קוד.js`

```javascript
// ✅ FIXED CODE - Proper decoding
const name = decodeURIComponent(e.parameter.name || "");
const status = decodeURIComponent(e.parameter.status || "");
const blessing = decodeURIComponent(e.parameter.blessing || "");
```

## 📊 Data Flow Comparison

### Before Fix (Double Encoding)

```
Hebrew Text: "אביתר לידני"
↓ URLSearchParams.append() (1st encoding)
"אביתר%20לידני"
↓ encodeURIComponent() (2nd encoding) ❌
"%D7%90%D7%91%D7%99%D7%AA%D7%A8%20%D7%9C%D7%99%D7%93%D7%A0%D7%99"
↓ Google Apps Script (no decoding)
Stored in Sheet: "%D7%90%D7%91%D7%99%D7%AA%D7%A8%20%D7%9C%D7%99%D7%93%D7%A0%D7%99" ❌
```

### After Fix (Single Encoding + Decoding)

```
Hebrew Text: "אביתר לידני"
↓ URLSearchParams.append() (1st encoding)
"אביתר%20לידני"
↓ URLSearchParams(data) (no double encoding) ✅
"אביתר%20לידני"
↓ Google Apps Script decodeURIComponent() ✅
"אביתר לידני"
↓ Stored in Sheet: "אביתר לידני" ✅
```

## 🧪 Testing the Fix

### 1. Test with Hebrew Name

```bash
# Test the form with Hebrew name
curl -X POST "https://rsvp-next.vercel.app/api/submit" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "name=אביתר לידני" \
  --data-urlencode "status=מגיע" \
  --data-urlencode "guests=2" \
  --data-urlencode "id=rsvp_test_001"
```

### 2. Verify Google Sheet

Check that the name column shows readable Hebrew text instead of URL-encoded strings.

### 3. Test URL Parameter

The URL `https://rsvp-next.vercel.app/?name=%D7%90%D7%91%D7%99%D7%AA%D7%A8%20%D7%9C%D7%99%D7%93%D7%A0%D7%99` should now display correctly.

## 🔧 Files Modified

1. **`src/lib/googleScriptClient.ts`**

   - Removed double encoding in `submitToGoogleScript` function
   - Changed from manual `encodeURIComponent` to automatic `URLSearchParams`

2. **`קוד.js` (Google Apps Script)**
   - Added `decodeURIComponent()` for `name`, `status`, and `blessing` parameters
   - Added null safety with `|| ""` fallbacks

## ✅ Verification Checklist

- [x] Hebrew names display correctly in Google Sheet
- [x] URL parameters with Hebrew names work properly
- [x] Form submissions preserve Hebrew text
- [x] No breaking changes to existing functionality
- [x] Build passes without errors
- [x] Production deployment successful

## 🚀 Deployment Status

**Production URL**: `https://rsvp-next-dzr3wslol-evyatars-projects-b9a23384.vercel.app`
**Status**: ✅ Deployed successfully
**Build**: ✅ Passed without errors

## 📝 Notes

- The fix maintains backward compatibility
- Existing encoded data in the sheet will remain encoded (manual cleanup may be needed)
- New submissions will display Hebrew text correctly
- The fix also improves handling of special characters and spaces

## 🔗 Related Links

- [URL Encoding Reference](https://developer.mozilla.org/en-US/docs/Glossary/percent-encoding)
- [URLSearchParams Documentation](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
- [Google Apps Script doPost Documentation](https://developers.google.com/apps-script/guides/web)

