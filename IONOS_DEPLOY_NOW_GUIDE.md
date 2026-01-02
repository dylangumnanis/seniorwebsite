# IONOS Deploy Now - Deployment Guide

This guide will help you deploy your Senior Tech Connect app to IONOS Deploy Now.

## Prerequisites

1. **IONOS Account** with Deploy Now access
2. **GitHub Repository** (already set up: `dylangumnanis/seniorwebsite`)
3. **PostgreSQL Database** (see Database Options below)

---

## Step 1: Set Up a Database

IONOS Deploy Now doesn't include a database, so you need one externally. Options:

### Option A: IONOS Database (Recommended)
1. Go to your IONOS Control Panel
2. Navigate to **Hosting → Databases**
3. Create a new **PostgreSQL** database
4. Note down: Host, Port, Database name, Username, Password

### Option B: Free Hosted Database
- **Neon** (https://neon.tech) - Free PostgreSQL, easy setup
- **Supabase** (https://supabase.com) - Free tier available
- **Railway** (https://railway.app) - Free database tier

---

## Step 2: Deploy to IONOS Deploy Now

### 2.1 Go to IONOS Deploy Now
1. Visit: https://www.ionos.com/hosting/deploy-now
2. Sign in to your IONOS account
3. Click **"New Project"** or **"Add Project"**

### 2.2 Connect GitHub
1. Click **"Connect with GitHub"**
2. Authorize IONOS to access your repositories
3. Select the repository: **`seniorwebsite`**
4. Select the branch: **`main`**

### 2.3 Configure Build Settings
IONOS should auto-detect Next.js, but verify these settings:

| Setting | Value |
|---------|-------|
| **Framework** | Next.js |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` |
| **Install Command** | `npm ci` |
| **Node Version** | 18 |

### 2.4 Configure Environment Variables

Add these environment variables in the IONOS Deploy Now settings:

```
DATABASE_URL=postgresql://username:password@host:5432/database_name
NEXTAUTH_SECRET=<generate-a-random-32-char-string>
NEXTAUTH_URL=https://your-ionos-domain.com
NEXT_PUBLIC_WORDPRESS_CUSTOM_API_URL=https://info.digitaltrailheads.com/wp-json/dt-sync/v1
NEXT_PUBLIC_WORDPRESS_CUSTOM_API_KEY=dt-sync-ca08675eb5ec2c49f2cd06e139be7bd0
```

**To generate NEXTAUTH_SECRET**, run this in PowerShell:
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

---

## Step 3: Initialize the Database

After the first deployment, you need to set up the database tables.

### Option A: Using Prisma Migrate (Recommended)
Add this to your build command in IONOS:
```
npm run build && npx prisma migrate deploy
```

### Option B: Manual Migration
Run locally with your production DATABASE_URL:
```bash
npx prisma migrate deploy
```

---

## Step 4: Connect Your Custom Domain

1. In IONOS Deploy Now, go to **Settings → Domains**
2. Click **"Add Domain"**
3. Select your IONOS domain
4. IONOS will automatically configure DNS

---

## Step 5: Verify Deployment

After deployment completes:

1. ✅ Visit your domain - homepage should load
2. ✅ Try `/login` - authentication page should appear
3. ✅ Try `/register` - registration should work
4. ✅ Try `/blog` - blog posts should load from WordPress

---

## Troubleshooting

### Build Fails
- Check that all environment variables are set
- Verify Node.js version is 18
- Check build logs for specific errors

### Database Connection Issues
- Verify DATABASE_URL format: `postgresql://user:pass@host:port/dbname`
- Ensure database is accessible from IONOS servers
- Check if SSL is required (add `?sslmode=require` to URL)

### Authentication Not Working
- Verify NEXTAUTH_URL matches your deployed domain exactly
- Check that NEXTAUTH_SECRET is set
- Ensure cookies are being set (check browser dev tools)

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | ✅ Yes | Random secret for session encryption |
| `NEXTAUTH_URL` | ✅ Yes | Your deployed site URL |
| `NEXT_PUBLIC_WORDPRESS_CUSTOM_API_URL` | Optional | WordPress API endpoint |
| `NEXT_PUBLIC_WORDPRESS_CUSTOM_API_KEY` | Optional | WordPress API key |
| `WORDPRESS_WEBHOOK_SECRET` | Optional | For WordPress webhook |
| `PERSONAL_ACCESS_TOKEN` | Optional | GitHub token for auto-rebuild |

---

## Support

If you encounter issues:
1. Check IONOS Deploy Now logs
2. Verify environment variables
3. Test database connectivity
4. Check browser console for client-side errors


