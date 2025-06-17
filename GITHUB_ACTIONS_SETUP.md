# GitHub Actions Automated Deployment Setup

This guide will help you set up automated deployment of your Next.js website to Bluehost whenever WordPress posts are updated.

## Overview

The setup includes:
1. **GitHub Actions workflow** - Builds and deploys your site
2. **WordPress webhook** - Triggers rebuilds when posts are updated
3. **Bluehost FTP deployment** - Uploads the built site to your hosting

## Step 1: Configure GitHub Repository Secrets

In your GitHub repository, go to **Settings > Secrets and variables > Actions** and add these secrets:

### Required Secrets

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `FTP_HOST` | Your Bluehost FTP hostname | `ftp.yourdomain.com` |
| `FTP_USERNAME` | Your Bluehost FTP username | `username@yourdomain.com` |
| `FTP_PASSWORD` | Your Bluehost FTP password | `your-ftp-password` |
| `FTP_SERVER_DIR` | Directory on your server | `/public_html/` or `/public_html/subdirectory/` |
| `NEXT_PUBLIC_WORDPRESS_API_URL` | Your WordPress API URL | `https://info.digitaltrailheads.com/wp-json/wp/v2` |
| `NEXTAUTH_SECRET` | NextAuth secret key | Generate with: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your production site URL | `https://yourdomain.com` |
| `GITHUB_TOKEN` | GitHub Personal Access Token | Create at github.com/settings/tokens |
| `GITHUB_REPO_OWNER` | Your GitHub username | `yourusername` |
| `GITHUB_REPO_NAME` | Your repository name | `seniorwebsite` |
| `WORDPRESS_WEBHOOK_SECRET` | Secret for webhook security | Generate random string |

### Finding Your Bluehost FTP Details

1. **Login to Bluehost cPanel**
2. **Go to "File Manager" or "FTP Accounts"**
3. **Find your FTP details:**
   - Host: Usually `ftp.yourdomain.com` or `yourdomain.com`
   - Username: Your cPanel username or email
   - Server directory: Usually `/public_html/` for main domain

## Step 2: Create GitHub Personal Access Token

1. **Go to GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)**
2. **Click "Generate new token"**
3. **Select these scopes:**
   - `repo` (Full control of private repositories)
   - `workflow` (Update GitHub Action workflows)
4. **Copy the token** and save it as the `GITHUB_TOKEN` secret

## Step 3: Test the GitHub Actions Workflow

1. **Push your code to the main branch**
2. **Go to GitHub Actions tab** in your repository
3. **Watch the "Build and Deploy to Bluehost" workflow run**
4. **Check your Bluehost site** to verify deployment

## Step 4: Set Up WordPress Webhook

### Option A: Using a Plugin (Recommended)

1. **Install the "WP Webhooks" plugin** in your WordPress admin
2. **Go to Settings > WP Webhooks > Send Data**
3. **Add a new webhook trigger:**
   - **Trigger:** `post_update` and `post_create`
   - **Webhook URL:** `https://yourdomain.com/api/webhook/wordpress`
   - **Add header:** `x-webhook-secret` with your `WORDPRESS_WEBHOOK_SECRET` value
4. **Test the webhook** by updating a post

### Option B: Custom WordPress Code

Add this to your WordPress theme's `functions.php`:

```php
// Add webhook trigger for post updates
function trigger_nextjs_rebuild($post_id) {
    $post = get_post($post_id);
    
    // Only trigger for published posts
    if ($post->post_status !== 'publish' || $post->post_type !== 'post') {
        return;
    }
    
    $webhook_url = 'https://yourdomain.com/api/webhook/wordpress';
    $webhook_secret = 'your-webhook-secret-here';
    
    $payload = array(
        'action' => 'post_updated',
        'post' => array(
            'ID' => $post->ID,
            'post_title' => $post->post_title,
            'post_status' => $post->post_status,
            'post_modified' => $post->post_modified
        )
    );
    
    wp_remote_post($webhook_url, array(
        'headers' => array(
            'Content-Type' => 'application/json',
            'x-webhook-secret' => $webhook_secret
        ),
        'body' => json_encode($payload),
        'timeout' => 30
    ));
}

// Hook into post save events
add_action('save_post', 'trigger_nextjs_rebuild');
add_action('publish_post', 'trigger_nextjs_rebuild');
```

## Step 5: Environment Variables for Production

Update your `.env.local` file with production values:

```env
NEXT_PUBLIC_WORDPRESS_API_URL=https://info.digitaltrailheads.com/wp-json/wp/v2
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://yourdomain.com
GITHUB_TOKEN=your-github-token
GITHUB_REPO_OWNER=yourusername
GITHUB_REPO_NAME=seniorwebsite
WORDPRESS_WEBHOOK_SECRET=your-webhook-secret
```

## Step 6: Testing the Complete Setup

1. **Create or update a WordPress post**
2. **Check GitHub Actions** - Should see a new workflow run triggered
3. **Verify deployment** - Your site should update with the new content
4. **Check logs** - Look at GitHub Actions logs for any errors

## Troubleshooting

### Common Issues

**1. FTP Connection Failed**
- Verify FTP credentials in Bluehost cPanel
- Check if your server requires SFTP instead of FTP
- Ensure the server directory path is correct

**2. Webhook Not Triggering**
- Verify the webhook URL is accessible
- Check the webhook secret matches
- Look at WordPress error logs

**3. Build Failures**
- Check Node.js version compatibility
- Verify all environment variables are set
- Review build logs in GitHub Actions

**4. GitHub Token Issues**
- Ensure token has correct permissions
- Check if token has expired
- Verify repository owner/name are correct

### Monitoring Deployments

- **GitHub Actions tab** - See all deployment runs
- **Bluehost File Manager** - Verify files are uploaded
- **Browser Network tab** - Check if new content loads

## Security Notes

- **Keep secrets secure** - Never commit secrets to your repository
- **Use strong webhook secrets** - Generate random, complex strings
- **Limit token permissions** - Only grant necessary GitHub permissions
- **Monitor webhook logs** - Watch for unauthorized attempts

## Deployment Frequency

- **Automatic:** Triggered by WordPress post updates
- **Manual:** Can be triggered from GitHub Actions tab
- **On push:** Automatically runs when you push to main branch

Your site will now automatically update whenever you publish or update WordPress posts! 