<?php
/**
 * Plugin Name: GitHub Site Rebuild Webhook
 * Description: Triggers GitHub Actions when posts are updated
 * Version: 1.0
 * Author: Digital Trailheads
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class GitHubWebhookTrigger {
    
    // Replace YOUR_GITHUB_TOKEN_HERE with your actual GitHub token
    private $github_token = 'YOUR_GITHUB_TOKEN_HERE';
    private $github_repo = 'dylangumnanis/seniorwebsite';
    
    public function __construct() {
        // Hook into WordPress post save events
        add_action('save_post', array($this, 'trigger_github_webhook'), 10, 3);
        add_action('publish_post', array($this, 'trigger_github_webhook'), 10, 3);
        add_action('wp_insert_post', array($this, 'trigger_github_webhook'), 10, 3);
    }
    
    public function trigger_github_webhook($post_id, $post, $update) {
        // Only trigger for published posts
        if ($post->post_status !== 'publish' || $post->post_type !== 'post') {
            return;
        }
        
        // Don't trigger for autosaves or revisions
        if (wp_is_post_autosave($post_id) || wp_is_post_revision($post_id)) {
            return;
        }
        
        // GitHub API endpoint for repository dispatch
        $webhook_url = 'https://api.github.com/repos/' . $this->github_repo . '/dispatches';
        
        // Prepare the payload
        $payload = array(
            'event_type' => 'wordpress-update',
            'client_payload' => array(
                'source' => 'wordpress-custom-plugin',
                'post_id' => $post_id,
                'post_title' => $post->post_title,
                'post_status' => $post->post_status,
                'post_url' => get_permalink($post_id),
                'timestamp' => current_time('c'),
                'action' => $update ? 'post_updated' : 'post_created'
            )
        );
        
        // Prepare the request arguments
        $args = array(
            'headers' => array(
                'Authorization' => 'Bearer ' . $this->github_token,
                'Accept' => 'application/vnd.github.v3+json',
                'Content-Type' => 'application/json',
                'User-Agent' => 'WordPress-GitHub-Webhook/1.0'
            ),
            'body' => json_encode($payload),
            'method' => 'POST',
            'timeout' => 30
        );
        
        // Send the webhook
        $response = wp_remote_request($webhook_url, $args);
        
        // Log the result for debugging
        if (is_wp_error($response)) {
            error_log('GitHub Webhook Error: ' . $response->get_error_message());
        } else {
            $response_code = wp_remote_retrieve_response_code($response);
            if ($response_code === 204) {
                error_log('GitHub Webhook Success: Site rebuild triggered for post "' . $post->post_title . '" (ID: ' . $post_id . ')');
            } else {
                error_log('GitHub Webhook Failed: Response code ' . $response_code . ' for post ' . $post_id);
                error_log('GitHub Webhook Response: ' . wp_remote_retrieve_body($response));
            }
        }
    }
}

// Initialize the plugin
new GitHubWebhookTrigger();

// Add admin notice to remind about token setup
add_action('admin_notices', function() {
    $plugin_data = get_plugin_data(__FILE__);
    if (strpos(file_get_contents(__FILE__), 'YOUR_GITHUB_TOKEN_HERE') !== false) {
        echo '<div class="notice notice-warning"><p><strong>GitHub Webhook Plugin:</strong> Please replace YOUR_GITHUB_TOKEN_HERE with your actual GitHub token in the plugin file.</p></div>';
    }
});
?> 