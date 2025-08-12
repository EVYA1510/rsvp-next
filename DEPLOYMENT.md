# 🚀 Vercel Deployment Guide

## Prerequisites

- GitHub account
- Vercel account (free at [vercel.com](https://vercel.com))

## Step-by-Step Deployment

### 1. Push to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: RSVP Next.js app with Google Apps Script integration"

# Add your GitHub repository as remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/rsvp-next.git

# Push to GitHub
git push -u origin main
```

### 2. Connect to Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. **Click "New Project"**
3. **Import your GitHub repository**:
   - Select your `rsvp-next` repository
   - Vercel will auto-detect it's a Next.js project

### 3. Configure Project Settings

**Framework Preset**: Next.js (auto-detected)
**Root Directory**: `./` (default)
**Build Command**: `npm run build` (auto-detected)
**Output Directory**: `.next` (auto-detected)
**Install Command**: `npm install` (auto-detected)

### 4. Environment Variables (if needed)

If you have any environment variables, add them in the Vercel dashboard:

- Go to Project Settings → Environment Variables
- Add any `.env` variables you need

### 5. Deploy

1. **Click "Deploy"**
2. **Wait for build to complete** (usually 2-3 minutes)
3. **Your app will be live** at `https://your-project-name.vercel.app`

## Configuration Files Created

### `vercel.json`

- **Rewrites**: POST requests to `/api/submit` are forwarded to your Google Apps Script
- **Headers**: CORS headers for cross-origin requests
- **Security**: Proper access control headers

### Updated Frontend

- **API Endpoint**: Changed from direct Google Apps Script URL to `/api/submit`
- **CORS**: Handled by Vercel's proxy

## Post-Deployment

### 1. Test Your App

- Visit your Vercel URL
- Test the RSVP form submission
- Check your Google Sheet for new entries

### 2. Custom Domain (Optional)

- Go to Project Settings → Domains
- Add your custom domain
- Configure DNS as instructed

### 3. Environment Variables (if needed)

If you need to add environment variables later:

- Go to Project Settings → Environment Variables
- Add key-value pairs
- Redeploy the project

## Troubleshooting

### Build Errors

- Check the build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation

### API Errors

- Check that your Google Apps Script is deployed as a Web App
- Verify the script URL in `vercel.json`
- Test the script URL directly in browser

### CORS Issues

- The `vercel.json` should handle CORS automatically
- If issues persist, check the Google Apps Script permissions

## File Structure

```
rsvp-next/
├── src/
│   ├── app/
│   ├── components/
│   └── styles/
├── public/
├── package.json
├── vercel.json          # Vercel configuration
├── .gitignore          # Git ignore rules
├── next.config.ts      # Next.js config
├── tailwind.config.ts  # Tailwind config
└── tsconfig.json       # TypeScript config
```

## Success! 🎉

Your RSVP app is now deployed and should be working with:

- ✅ **Hebrew/English support**
- ✅ **Google Apps Script integration**
- ✅ **Responsive design**
- ✅ **Animations and UI effects**
- ✅ **Form validation and feedback**

Visit your Vercel URL to see your live RSVP application!
