# Dashboard Troubleshooting Guide

## Issue: "ERR_TOO_MANY_REDIRECTS" on Dashboard

### Current Situation:
- ✅ **Sync API Working**: Posts are loading successfully (3 posts detected)
- ✅ **Server-side API Working**: `curl http://localhost:3000/api/test` returns 200 OK
- ❌ **Browser Cache Issue**: `/api/test` endpoint getting redirect loop in browser

### Quick Fix Solutions:

#### Option 1: Hard Refresh (Recommended)
1. Go to `http://localhost:3000/dashboard/content`
2. Press **Ctrl+F5** (Windows) or **Cmd+Shift+R** (Mac) for hard refresh
3. This clears browser cache and should fix the redirect loop

#### Option 2: Clear Browser Cache
1. Open Developer Tools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

#### Option 3: Use the Dashboard Button
1. On the dashboard, you'll see a red error message
2. Click the "Clear Cache & Reload" button
3. The page will refresh automatically

#### Option 4: Incognito/Private Mode
1. Open an incognito/private browser window
2. Navigate to `http://localhost:3000/dashboard/content`
3. This bypasses all cached data

### Why This Happened:
The redirect loop was caused by cached responses from when the server had compilation errors. The experimental CSS optimization was causing module loading issues, which created bad cached responses in the browser.

### Verification:
After clearing cache, you should see:
- ✅ "WordPress: ✅ Connected" badge
- ✅ All sync buttons enabled and working
- ✅ No error messages in the console

### If Still Not Working:
1. Check the browser console for any remaining errors
2. Verify the server is running on `http://localhost:3000`
3. Try a different browser
4. Restart the development server: `npm run dev` 