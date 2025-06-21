# Digital Trailheads Custom Sync API Setup Guide

## 🎯 Overview

This guide helps you set up a custom WordPress plugin that provides API endpoints for bi-directional content sync **without requiring application passwords**. This solves the Bluehost authentication issues you've been experiencing.

## 📁 Files Created

1. **`dt-sync-api-plugin.php`** - The WordPress plugin file
2. **`test-custom-api.js`** - Test script to verify the API works
3. **`lib/wordpress-custom.ts`** - Updated API client for your Next.js app

## 🚀 Installation Steps

### Step 1: Install the WordPress Plugin

1. **Upload the plugin file:**
   - Copy the `dt-sync-api-plugin.php` file
   - Upload it to your WordPress site at: `/wp-content/plugins/dt-sync-api-plugin.php`
   - OR create a folder `/wp-content/plugins/dt-sync-api/` and put the file inside as `dt-sync-api.php`

2. **Activate the plugin:**
   - Go to WordPress Admin → Plugins
   - Find "Digital Trailheads Sync API"
   - Click "Activate"

3. **Configure the API key:**
   - Go to WordPress Admin → Settings → DT Sync API
   - Change the default API key to something secure (recommended: generate a random 32-character string)
   - Save the settings

### Step 2: Test the API

1. **Basic connectivity test:**
   ```bash
   curl "https://info.digitaltrailheads.com/wp-json/dt-sync/v1/test"
   ```
   Expected response: `{"success":true,"message":"API endpoint is accessible",...}`

2. **Authentication test:**
   ```bash
   curl -H "X-API-Key: your-api-key-here" \
        "https://info.digitaltrailheads.com/wp-json/dt-sync/v1/health"
   ```

3. **Run the comprehensive test:**
   ```bash
   node test-custom-api.js
   ```

### Step 3: Update Your Next.js Application

1. **Set environment variables:**
   Add to your `.env.local`:
   ```bash
   NEXT_PUBLIC_WORDPRESS_CUSTOM_API_URL=https://info.digitaltrailheads.com/wp-json/dt-sync/v1
   WORDPRESS_CUSTOM_API_KEY=your-secure-api-key-here
   ```

2. **Update your sync system:**
   - Import the new custom API client: `import { customWpApi } from '@/lib/wordpress-custom'`
   - Replace calls to the old API with the new one

## 🔗 API Endpoints

Base URL: `https://info.digitaltrailheads.com/wp-json/dt-sync/v1`

### Available Endpoints:

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/test` | Basic connectivity test | ❌ No |
| `GET` | `/health` | Health check with auth | ✅ Yes |
| `GET` | `/posts` | Get all posts (paginated) | ✅ Yes |
| `GET` | `/posts/{id}` | Get single post by ID | ✅ Yes |
| `GET` | `/posts/slug/{slug}` | Get post by slug | ✅ Yes |
| `POST` | `/posts` | Create new post | ✅ Yes |
| `PUT` | `/posts/{id}` | Update existing post | ✅ Yes |
| `DELETE` | `/posts/{id}` | Delete post | ✅ Yes |

### Authentication Methods:

**Option 1: Header (Recommended)**
```javascript
headers: {
  'X-API-Key': 'your-api-key'
}
```

**Option 2: Query Parameter**
```
?api_key=your-api-key
```

## 📝 Usage Examples

### Fetch Posts
```javascript
// Get recent posts
const response = await fetch('https://info.digitaltrailheads.com/wp-json/dt-sync/v1/posts?per_page=10', {
  headers: { 'X-API-Key': 'your-api-key' }
});
const data = await response.json();
console.log(data.data); // Array of posts
```

### Create Post
```javascript
const postData = {
  title: 'My New Post',
  content: '<p>Post content here...</p>',
  status: 'draft',
  excerpt: 'Short description'
};

const response = await fetch('https://info.digitaltrailheads.com/wp-json/dt-sync/v1/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your-api-key'
  },
  body: JSON.stringify(postData)
});
```

### Update Post
```javascript
const updateData = {
  title: 'Updated Title',
  content: '<p>Updated content...</p>'
};

const response = await fetch('https://info.digitaltrailheads.com/wp-json/dt-sync/v1/posts/123', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your-api-key'
  },
  body: JSON.stringify(updateData)
});
```

## 🔒 Security Features

1. **API Key Authentication**: Simple and reliable
2. **WordPress Sanitization**: All inputs are properly sanitized
3. **Permission Checks**: Only authenticated requests can modify content
4. **Error Handling**: Proper error responses for debugging

## 🔧 Troubleshooting

### Plugin Not Working?

1. **Check plugin activation:**
   - Go to Plugins page in WordPress admin
   - Ensure "Digital Trailheads Sync API" is activated

2. **Test basic endpoint:**
   ```bash
   curl "https://info.digitaltrailheads.com/wp-json/dt-sync/v1/test"
   ```

3. **Check WordPress REST API:**
   ```bash
   curl "https://info.digitaltrailheads.com/wp-json/"
   ```

### Authentication Issues?

1. **Verify API key:**
   - Go to Settings → DT Sync API in WordPress admin
   - Make sure the API key matches what you're using

2. **Check headers:**
   - Ensure you're sending `X-API-Key` header
   - Verify the key value is correct

### 403 Forbidden Errors?

1. **Bluehost Security:**
   - The custom plugin bypasses most security restrictions
   - If still blocked, contact Bluehost support about REST API access

2. **WordPress Permissions:**
   - The plugin requires WordPress to be functioning normally
   - Check for any WordPress-level restrictions

## 🚀 Migration from Application Passwords

1. **Update your API client:**
   ```typescript
   // Old way
   import { wpApi } from '@/lib/wordpress';
   
   // New way
   import { customWpApi } from '@/lib/wordpress-custom';
   ```

2. **Update environment variables:**
   ```bash
   # Add these new variables
   NEXT_PUBLIC_WORDPRESS_CUSTOM_API_URL=https://info.digitaltrailheads.com/wp-json/dt-sync/v1
   WORDPRESS_CUSTOM_API_KEY=your-secure-api-key
   ```

3. **Test thoroughly:**
   - Run `node test-custom-api.js`
   - Verify both read and write operations work
   - Test your sync functionality

## ✅ Success Indicators

When everything is working correctly, you should see:

- ✅ Test endpoint returns success without authentication
- ✅ Health check works with API key
- ✅ Can fetch, create, update, and delete posts
- ✅ All sync operations work in your dashboard
- ✅ No more application password errors

## 🆘 Need Help?

If you encounter issues:

1. Check the WordPress error logs
2. Verify the plugin is properly activated
3. Test the basic endpoints with curl
4. Ensure your API key is correct
5. Contact Bluehost if REST API access is still blocked

## 🎉 Benefits of This Solution

- ✅ **No Application Passwords Required**: Bypasses Bluehost restrictions
- ✅ **Simple Authentication**: API key-based, easy to manage
- ✅ **Full Functionality**: Create, read, update, delete posts
- ✅ **WordPress Compatible**: Uses standard WordPress functions
- ✅ **Error Handling**: Clear error messages for debugging
- ✅ **Secure**: Proper input sanitization and validation
- ✅ **Future Proof**: Not dependent on WordPress auth changes 