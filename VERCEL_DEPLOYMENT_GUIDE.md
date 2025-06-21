# Vercel Deployment Guide

## Overview
This guide will help you deploy your Senior Tech Connect blog from Bluehost to Vercel for better performance and easier management.

## Pre-Deployment Steps

### 1. Fix Current Issues
The development issues you're experiencing are now fixed:
- ✅ Blog post loading error (now uses API routes instead of direct WordPress calls)
- ✅ Dashboard static rendering error (converted to client-side rendering)
- ✅ Next.js config optimized for Vercel

### 2. Environment Setup
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update the environment variables in `.env.local` with your actual values:
   ```env
   WORDPRESS_USERNAME=your_username
   WORDPRESS_PASSWORD=your_password
   WORDPRESS_AUTH_TOKEN=your_app_password
   ```

## Vercel Deployment

### Option 1: Deploy via Vercel CLI
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   npm run deploy:vercel
   ```

### Option 2: Deploy via GitHub (Recommended)
1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. Connect to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js and use optimal settings

3. Configure Environment Variables in Vercel:
   - Go to your project settings in Vercel
   - Add these environment variables:
     ```
     NEXT_PUBLIC_WORDPRESS_API_URL=https://info.digitaltrailheads.com/wp-json/wp/v2
     NEXT_PUBLIC_WORDPRESS_CUSTOM_API_URL=https://info.digitaltrailheads.com/wp-json/dt-sync/v1
     NEXT_PUBLIC_WORDPRESS_CUSTOM_API_KEY=dt-sync-ca08675eb5ec2c49f2cd06e139be7bd0
     WORDPRESS_USERNAME=your_username
     WORDPRESS_PASSWORD=your_password
     WORDPRESS_AUTH_TOKEN=your_app_password
     ```

## Post-Deployment Configuration

### 1. Update WordPress Webhook
Update your WordPress webhook URL to point to your new Vercel domain:
- Old: `https://info.digitaltrailheads.com/seniortechconnect/api/sync`
- New: `https://your-vercel-domain.vercel.app/api/sync`

### 2. Test the Deployment
1. Visit your new Vercel URL
2. Check that blog posts load correctly
3. Test the dashboard sync functionality
4. Verify the WordPress integration

### 3. Custom Domain (Optional)
1. In Vercel dashboard, go to your project
2. Click "Domains" tab
3. Add your custom domain
4. Update DNS records as instructed

## Benefits of Vercel vs Bluehost

| Feature | Bluehost | Vercel |
|---------|----------|--------|
| **Performance** | Slower, shared hosting | ⚡ Edge network, global CDN |
| **Deployment** | Manual uploads | 🚀 Git-based, automatic |
| **Scaling** | Limited | ♾️ Auto-scaling |
| **API Routes** | PHP required | ✅ Native Next.js support |
| **HTTPS** | Manual setup | 🔒 Automatic SSL |
| **Environment Variables** | Manual | 🔧 Dashboard management |
| **Build Process** | Manual | 🤖 Automatic optimization |

## Troubleshooting

### Common Issues:
1. **API Routes Not Working**: Ensure environment variables are set in Vercel
2. **WordPress Connection Failed**: Check API key and WordPress plugin status
3. **Build Errors**: Run `npm run type-check` locally first

### Testing Commands:
```bash
# Test local development
npm run dev

# Test API endpoints
npm run test:api

# Test sync functionality
npm run sync:from-wp
```

## Migration Checklist
- [ ] Fix development issues
- [ ] Update Next.js config for Vercel
- [ ] Set up environment variables
- [ ] Deploy to Vercel
- [ ] Update WordPress webhook URL
- [ ] Test all functionality
- [ ] Configure custom domain (optional)
- [ ] Update DNS records (if using custom domain)

## Support
If you encounter issues:
1. Check Vercel deployment logs
2. Test API endpoints locally
3. Verify WordPress plugin is active
4. Check environment variables in Vercel dashboard 