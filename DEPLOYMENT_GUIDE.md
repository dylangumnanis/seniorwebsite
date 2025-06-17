# Bluehost Deployment Guide for Senior Tech Connect

## Overview
This guide will help you deploy your Senior Tech Connect website to Bluehost hosting.

## Prerequisites
- Bluehost hosting account
- FTP client (FileZilla recommended) or access to Bluehost File Manager
- Your website files (built using `npm run build`)

## Step 1: Build Your Website for Production

1. Open your terminal/command prompt in the project directory
2. Run the build command:
   ```bash
   npm run build
   ```
3. This creates an `out` folder with all your static files

## Step 2: Prepare Files for Upload

After building, you'll find these important folders/files:
- `out/` - Contains all your website files
- `out/index.html` - Your homepage
- `out/_next/` - Contains CSS, JavaScript, and other assets
- `out/about/` - About page
- `out/login/` - Login page
- `out/register/` - Registration page

## Step 3: Upload to Bluehost

### Option A: Using Bluehost File Manager
1. Log into your Bluehost control panel
2. Go to "File Manager"
3. Navigate to `public_html` folder (this is your website's root)
4. Delete any existing files (like default index.html)
5. Upload all contents from the `out` folder to `public_html`

### Option B: Using FTP Client (FileZilla)
1. Download and install FileZilla
2. Get your FTP credentials from Bluehost:
   - Host: Your domain name or server IP
   - Username: Your cPanel username
   - Password: Your cPanel password
   - Port: 21
3. Connect to your server
4. Navigate to `public_html` folder
5. Upload all contents from the `out` folder

## Step 4: Configure Domain

1. In Bluehost control panel, go to "Domains"
2. Make sure your domain points to the `public_html` folder
3. If using a subdomain, create it and point it to the correct folder

## Step 5: Test Your Website

1. Visit your domain in a web browser
2. Test all pages:
   - Homepage (/)
   - About page (/about/)
   - Login page (/login/)
   - Register page (/register/)
3. Check that all images and styling load correctly

## Important Notes

### Static Website Limitations
Since this is now a static website, some features are limited:
- **Authentication**: Currently shows demo messages. For real authentication, integrate with:
  - Auth0
  - Firebase Authentication
  - Supabase Auth
- **Database**: No server-side database. Consider:
  - Firebase Firestore
  - Supabase
  - Airtable
- **Contact Forms**: Use services like:
  - Formspree
  - Netlify Forms
  - EmailJS

### File Structure on Server
```
public_html/
├── index.html (Homepage)
├── about/
│   └── index.html
├── login/
│   └── index.html
├── register/
│   └── index.html
├── _next/ (CSS, JS, and other assets)
└── images and other static files
```

## Troubleshooting

### Common Issues:

1. **404 Errors**: Make sure all files are in the correct directories
2. **Missing Styles**: Ensure the `_next` folder is uploaded completely
3. **Images Not Loading**: Check that image files are in the correct paths
4. **Blank Pages**: Check browser console for JavaScript errors

### Performance Optimization:
- Enable Gzip compression in Bluehost
- Use Bluehost's CDN if available
- Optimize images before uploading

## Future Enhancements

To add dynamic functionality later:
1. **Contact Form**: Integrate with Formspree or EmailJS
2. **User Authentication**: Add Auth0 or Firebase Auth
3. **Database**: Use Firebase or Supabase for user data
4. **Blog/CMS**: Consider headless CMS like Strapi or Contentful

## Support

If you encounter issues:
1. Check Bluehost documentation
2. Contact Bluehost support
3. Verify all files are uploaded correctly
4. Check browser developer tools for errors

Your Senior Tech Connect website is now ready for the world! 🎉 