# 🎯 WordPress Webhook Solution - Complete Fix

## 🔍 **The Problem**

Your WordPress webhook wasn't working because WordPress was trying to send webhooks to your Next.js site, but Next.js is configured for static export which doesn't support API routes.

## ✅ **The Solution**

WordPress should send webhooks **directly to GitHub's API**, not to your website.

---

## 🛠️ **Method 1: WP Webhooks Plugin Configuration**

### Step 1: WordPress Admin Setup

1. **Go to**: WordPress Admin → Settings → WP Webhooks → Send Data
2. **Click**: "Add new webhook trigger" 
3. **Configure exactly as follows**:

#### Trigger Configuration:
```
Trigger Event: post_updated
Content Type: Posts
Trigger Name: GitHub Site Rebuild  
Status: Active
```

#### Webhook URL Configuration:
```
Webhook URL: https://api.github.com/repos/dylangumnanis/seniorwebsite/dispatches
HTTP Method: POST
```

#### Headers Configuration:
**Click "Add Header" for each of these:**

```
Header 1:
Name: Authorization
Value: Bearer [YOUR_GITHUB_TOKEN]

Header 2: 
Name: Accept
Value: application/vnd.github.v3+json

Header 3:
Name: Content-Type  
Value: application/json

Header 4:
Name: User-Agent
Value: WordPress-Webhook
```

#### Body/Payload Configuration:
**Select "Custom" and enter this JSON:**

```json
{
  "event_type": "wordpress-update",
  "client_payload": {
    "source": "wordpress",
    "post_id": "%post_id%",
    "post_title": "%post_title%",
    "timestamp": "%current_timestamp%"
  }
}
```

---

## 🔧 **Method 2: Custom WordPress Plugin**

If WP Webhooks plugin doesn't work, create this custom plugin:

### Create Custom Plugin File

1. **Create**: `/wp-content/plugins/github-webhook/github-webhook.php`

```php
<?php
/**
 * Plugin Name: GitHub Site Rebuild Webhook
 * Description: Triggers GitHub Actions when posts are updated
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

class GitHubWebhookTrigger {
    
    private $github_token = '[YOUR_GITHUB_TOKEN]';
    private $github_repo = 'dylangumnanis/seniorwebsite';
    
    public function __construct() {
        add_action('save_post', array($this, 'trigger_github_webhook'), 10, 3);
        add_action('publish_post', array($this, 'trigger_github_webhook'), 10, 3);
    }
    
    public function trigger_github_webhook($post_id, $post, $update) {
        if ($post->post_status !== 'publish' || $post->post_type !== 'post') {
            return;
        }
        
        if (wp_is_post_autosave($post_id) || wp_is_post_revision($post_id)) {
            return;
        }
        
        $webhook_url = 'https://api.github.com/repos/' . $this->github_repo . '/dispatches';
        
        $payload = array(
            'event_type' => 'wordpress-update',
            'client_payload' => array(
                'source' => 'wordpress-custom-plugin',
                'post_id' => $post_id,
                'post_title' => $post->post_title,
                'timestamp' => current_time('c')
            )
        );
        
        $args = array(
            'headers' => array(
                'Authorization' => 'Bearer ' . $this->github_token,
                'Accept' => 'application/vnd.github.v3+json',
                'Content-Type' => 'application/json',
                'User-Agent' => 'WordPress-Custom-Webhook'
            ),
            'body' => json_encode($payload),
            'method' => 'POST',
            'timeout' => 30
        );
        
        $response = wp_remote_request($webhook_url, $args);
        
        if (is_wp_error($response)) {
            error_log('GitHub Webhook Error: ' . $response->get_error_message());
        } else {
            $response_code = wp_remote_retrieve_response_code($response);
            if ($response_code === 204) {
                error_log('GitHub Webhook Success: Site rebuild triggered');
            } else {
                error_log('GitHub Webhook Failed: Response code ' . $response_code);
            }
        }
    }
}

new GitHubWebhookTrigger();
?>
```

2. **Activate the plugin** in WordPress Admin → Plugins

---

## 🧪 **Testing**

### Test Method 1: GitHub Actions Check
1. **Update a WordPress post**
2. **Go to**: https://github.com/dylangumnanis/seniorwebsite/actions
3. **You should see**: A new workflow run within 1-2 minutes

### Test Method 2: WordPress Debug Logs
1. **Add to wp-config.php**:
```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

2. **Update a post, then check**: `/wp-content/debug.log`

### Test Method 3: Browser Developer Tools
1. **Open WordPress admin**
2. **Press F12** to open developer tools
3. **Go to Network tab**
4. **Update a post**
5. **Look for**: POST request to `api.github.com` (should return 204)

---

## 🚨 **Troubleshooting**

### Issue 1: "Failed to connect to api.github.com"
**Solution**: Your hosting provider blocks outbound requests
- Contact your host to enable HTTPS requests to GitHub
- Check if port 443 is open

### Issue 2: "401 Unauthorized"
**Solution**: GitHub token issue
- Verify your token hasn't expired
- Ensure token has `repo` and `workflow` permissions
- Try regenerating the token

### Issue 3: "422 Unprocessable Entity"
**Solution**: Payload format issue
- Ensure `event_type` is exactly `wordpress-update`
- Verify JSON syntax is correct

### Issue 4: Webhook Fires But No GitHub Action
**Solution**: GitHub workflow issue
- Check workflow has `repository_dispatch` trigger
- Verify event type matches: `types: [wordpress-update]`

---

## 🎯 **Your GitHub Token Setup**

1. **Go to**: https://github.com/settings/tokens
2. **Generate new token (classic)**
3. **Select scopes**: `repo` and `workflow`
4. **Copy the token** and use it in the WordPress configuration
5. **Token format**: `ghp_...` (starts with ghp_)

---

## 🚀 **Expected Workflow**

After configuration:
1. **Cofounder edits WordPress post** ✍️
2. **WordPress sends webhook to GitHub** 📤
3. **GitHub Actions builds site** 🔄
4. **Site deploys to Bluehost** 🚀
5. **Site updates automatically** ✅

**No technical intervention required!**

---

## 📞 **Quick Start Instructions**

1. **Try Method 1 first** (WP Webhooks plugin - easier)
2. **If that fails, try Method 2** (custom plugin - more reliable)  
3. **Test by updating a WordPress post**
4. **Check GitHub Actions to confirm it works**
5. **Your cofounder can now manage content independently!**

---

**Key Insight**: WordPress webhooks must go directly to GitHub's API, not to your static Next.js site! 