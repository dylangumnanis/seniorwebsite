# Deployment Guide for Senior Tech Connect

## Overview
This guide will help you deploy your Next.js blog application online so your cofounder can:
- Edit posts in WordPress admin
- View formatted blog posts online (not localhost)
- Keep bidirectional sync working

## Recommended: Vercel Deployment

### Prerequisites
1. GitHub repository with your code
2. Environment variables from your `.env.local` file

### Step 1: Prepare for Deployment

#### Update next.config.js for production
Add these optimizations to your `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: ['info.digitaltrailheads.com'] // Add your WordPress domain
  },
  env: {
    CUSTOM_NAME: process.env.CUSTOM_NAME,
  }
}

module.exports = nextConfig
```

#### Environment Variables Needed
Make sure you have these in your `.env.local` (you'll add them to Vercel):
- `WORDPRESS_API_URL`
- `WORDPRESS_API_KEY`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (will be your Vercel domain)
- Any database URLs if using Prisma

### Step 2: Deploy to Vercel

1. **Sign up/Login to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Your Project**
   - Click "New Project"
   - Import from GitHub
   - Select your repository

3. **Configure Environment Variables**
   - In project settings, add all your environment variables
   - Important: Set `NEXTAUTH_URL` to your Vercel domain (e.g., `https://your-app.vercel.app`)

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Get your live URL

### Step 3: Update WordPress Webhook (if needed)

If you're using webhooks, update your WordPress plugin to also trigger sync on your live site:

```php
// In your WordPress plugin
$endpoints = [
    'http://localhost:3000/api/webhook/wordpress', // Local
    'https://your-app.vercel.app/api/webhook/wordpress' // Production
];
```

## Alternative: Netlify Deployment

### Steps:
1. Push to GitHub
2. Connect Netlify to GitHub
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Add environment variables

## Post-Deployment Workflow

Your cofounder can now:

1. **Edit Posts**: Go to WordPress admin and edit posts
2. **View Posts**: Visit your live site at `https://your-app.vercel.app/blog`
3. **Sync**: Posts will automatically sync between WordPress and your live site

## Sync Considerations

### Automatic Sync Options:
1. **Webhook-based**: WordPress triggers sync when posts change
2. **Scheduled**: Set up cron job to sync every X minutes
3. **Manual**: API endpoints for manual sync

### Recommended: Webhook + Fallback
- Primary: WordPress webhooks trigger immediate sync
- Fallback: Scheduled sync every 15 minutes

## Testing Deployment

After deployment:
1. Visit `https://your-app.vercel.app/blog`
2. Test that posts load from WordPress
3. Edit a post in WordPress admin
4. Verify changes appear on live site
5. Test bidirectional sync if editing locally

## Troubleshooting

### Common Issues:
- **Environment variables**: Make sure all are set in Vercel
- **API endpoints**: Ensure WordPress API is accessible from internet
- **CORS**: May need to configure WordPress CORS for production domain
- **Build errors**: Check build logs in Vercel dashboard

### CORS Configuration
Add this to your WordPress functions.php if needed:

```php
function add_cors_http_header(){
    header("Access-Control-Allow-Origin: https://your-app.vercel.app");
    header("Access-Control-Allow-Headers: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
}
add_action('init','add_cors_http_header');
```

## Next Steps

1. Choose deployment platform (Vercel recommended)
2. Set up deployment
3. Configure environment variables
4. Test with cofounder
5. Set up any necessary webhooks/sync automation

## Benefits for Your Cofounder

✅ Edit posts in familiar WordPress admin  
✅ View beautifully formatted posts online  
✅ No need to run localhost  
✅ Automatic sync keeps everything updated  
✅ Can share links to specific posts  
✅ Mobile-friendly viewing 