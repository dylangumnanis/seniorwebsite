# Environment Variables Setup for Custom WordPress API

## 📋 Required Environment Variables

Add these variables to your `.env.local` file (create it if it doesn't exist):

```bash
# WordPress Custom API Configuration (New - No Application Passwords Required)
NEXT_PUBLIC_WORDPRESS_CUSTOM_API_URL=https://info.digitaltrailheads.com/wp-json/dt-sync/v1
WORDPRESS_CUSTOM_API_KEY=dt-sync-2025-secure-key-blog

# Legacy WordPress Configuration (Keep for backup/fallback if needed)
NEXT_PUBLIC_WORDPRESS_API_URL=https://info.digitaltrailheads.com/wp-json/wp/v2
WORDPRESS_USERNAME=phones2012
WORDPRESS_AUTH_TOKEN=cTjq q5bK JNro cXoP dl8b pKYv

# Database Configuration (if using Prisma)
DATABASE_URL="file:./dev.db"

# Security (for NextAuth if using authentication)
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

## 🔧 Steps to Set Up:

1. **Create or edit `.env.local` file** in your project root:
   ```bash
   # In your project root directory (seniorwebsite/)
   touch .env.local
   ```

2. **Add the environment variables** shown above to the file

3. **Important: Change the API key** to something secure:
   - Generate a random 32-character string
   - Update both the `.env.local` file and your WordPress plugin settings
   - Go to WordPress Admin → Settings → DT Sync API to update the key

4. **Restart your development server**:
   ```bash
   npm run dev
   ```

## 🔒 Security Notes:

- **Never commit `.env.local` to git** (it should be in your .gitignore)
- **Use a strong, unique API key** in production
- **Keep your API key secret** - don't share it or expose it in client-side code

## 🧪 Testing Your Setup:

After setting up the environment variables, you can test the system:

1. **Test the WordPress plugin directly**:
   ```bash
   node test-custom-api.js
   ```

2. **Test the updated Next.js sync system**:
   ```bash
   npm run dev
   # Then in another terminal:
   node test-updated-sync.js
   ```

3. **Test via the API endpoints**:
   - Visit: `http://localhost:3000/api/test`
   - Should return success if everything is configured correctly

## ✅ Success Indicators:

When everything is set up correctly, you should see:
- ✅ WordPress plugin responding to API calls
- ✅ Next.js application can connect to WordPress
- ✅ Sync operations work without application password errors
- ✅ All CRUD operations (Create, Read, Update, Delete) function properly

## 🚨 Troubleshooting:

If you encounter issues:

1. **Check WordPress plugin**: Ensure it's activated in WordPress admin
2. **Verify API key**: Make sure it matches between .env.local and WordPress settings  
3. **Check URL**: Confirm the API URL is correct and accessible
4. **Test connectivity**: Use curl or browser to test the test endpoint
5. **Review logs**: Check browser console and terminal for error messages 