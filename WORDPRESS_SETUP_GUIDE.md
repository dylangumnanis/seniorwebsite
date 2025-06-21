# WordPress Headless CMS Setup Guide

## Overview
This guide will help you integrate WordPress as a headless CMS with your existing Next.js site, allowing your cofounder to manage blog content while keeping your modern frontend.

## Step 1: WordPress Installation

### Option A: WordPress on Bluehost (Recommended)

1. **Create a subdomain** in your Bluehost control panel:
   - Go to Subdomains section
   - Create: `cms.yoursite.com` or `blog.yoursite.com`

2. **Install WordPress** on the subdomain:
   - Use Bluehost's one-click WordPress installer
   - Install it in the subdomain directory

3. **Configure WordPress**:
   - Complete the basic WordPress setup
   - Choose a simple theme (the theme doesn't matter for headless use)
   - Create an admin account for your cofounder

### Option B: WordPress.com or Managed WordPress
- Sign up for WordPress.com Business plan (required for REST API)
- Or use a managed WordPress service like WP Engine

## Step 2: Enable WordPress REST API

The WordPress REST API is enabled by default in WordPress 4.7+, but you may need to configure it:

1. **Install recommended plugins**:
   ```
   - WP REST API V2 (if using older WordPress)
   - Application Passwords (for authentication)
   - Advanced Custom Fields (for custom content)
   ```

2. **Test the API**:
   Visit: `https://cms.yoursite.com/wp-json/wp/v2/posts`
   You should see a JSON response with posts

## Step 3: Configure Your Next.js Site

1. **Set the WordPress API URL**:
   Create a `.env.local` file in your project root:
   ```
   NEXT_PUBLIC_WORDPRESS_API_URL=https://cms.yoursite.com/wp-json/wp/v2
   ```

2. **Add Blog to Navigation**:
   You'll need to manually add the blog link to your navigation. 
   In `app/components/Navigation.tsx`, add to the NAV_ITEMS array:
   ```typescript
   {
     label: 'Blog',
     href: '/blog',
   },
   ```

## Step 4: Test the Integration

1. **Create test content** in WordPress:
   - Add a few blog posts with featured images
   - Use categories and tags
   - Add author information

2. **Test the blog pages**:
   ```bash
   npm run dev
   ```
   Visit: `http://localhost:3000/blog`

## Step 5: Content Management Workflow

### For Your Cofounder (Content Creator):
1. **Login to WordPress admin**: `https://cms.yoursite.com/wp-admin`
2. **Create/Edit Posts**: Use the familiar WordPress editor
3. **Add Featured Images**: These will appear on your Next.js site
4. **Use Categories/Tags**: For content organization
5. **Preview**: Changes appear immediately on the live site

### For You (Developer):
- The Next.js site automatically fetches content from WordPress
- No manual updates needed for content changes
- You maintain control over design and functionality

## Step 6: Deployment

### Current Static Setup:
Your current static site will work with this setup! The WordPress content is fetched client-side, so:

1. **Build and deploy** your updated site with the blog pages
2. **WordPress runs separately** on your subdomain
3. **Content updates** happen automatically without rebuilding

### Environment Variables:
Make sure to set the production environment variable:
- In your hosting provider's dashboard
- Or in your build configuration
- `NEXT_PUBLIC_WORDPRESS_API_URL=https://cms.yoursite.com/wp-json/wp/v2`

## Step 7: Advanced Features (Optional)

### Custom Post Types:
Add custom content types like "Success Stories" or "Volunteer Spotlights":

```php
// In WordPress functions.php
function create_custom_post_types() {
    register_post_type('success_story', array(
        'public' => true,
        'show_in_rest' => true, // Important for REST API
        'label' => 'Success Stories'
    ));
}
add_action('init', 'create_custom_post_types');
```

### Authentication (Future):
For private content or admin features:
- Install Application Passwords plugin
- Use WordPress user authentication
- Protect certain API endpoints

## Troubleshooting

### Common Issues:

1. **CORS Errors**:
   Add to WordPress functions.php:
   ```php
   function add_cors_http_header(){
       header("Access-Control-Allow-Origin: *");
   }
   add_action('init','add_cors_http_header');
   ```

2. **API Not Working**:
   - Check if WordPress REST API is enabled
   - Verify the URL: `yoursite.com/wp-json/wp/v2`
   - Check for plugin conflicts

3. **Images Not Loading**:
   - Ensure featured images are set in WordPress
   - Check image URLs in the API response
   - Verify image permissions

## Benefits of This Setup

✅ **Easy Content Management**: Familiar WordPress interface for your cofounder
✅ **Maintains Performance**: Static site with dynamic content
✅ **Cost Effective**: Uses existing Bluehost hosting
✅ **Scalable**: Can add more content types and features
✅ **SEO Friendly**: Content is rendered client-side with proper meta tags
✅ **Backup & Security**: WordPress handles content backup automatically

## Next Steps

1. Set up the WordPress subdomain
2. Install and configure WordPress
3. Add the environment variable
4. Test the blog functionality
5. Train your cofounder on WordPress
6. Deploy the updated site

Need help with any step? The WordPress REST API documentation is excellent: https://developer.wordpress.org/rest-api/ 