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
        
        // Add admin menu for easy token management
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'handle_token_update'));
    }
    
    public function add_admin_menu() {
        add_options_page(
            'GitHub Webhook Settings',
            'GitHub Webhook',
            'manage_options',
            'github-webhook',
            array($this, 'admin_page')
        );
    }
    
    public function admin_page() {
        $current_token = $this->github_token;
        $token_set = ($current_token !== 'YOUR_GITHUB_TOKEN_HERE');
        
        echo '<div class="wrap">';
        echo '<h1>GitHub Webhook Settings</h1>';
        
        if ($token_set) {
            echo '<div class="notice notice-success"><p><strong>✅ GitHub token is configured!</strong></p></div>';
        } else {
            echo '<div class="notice notice-warning"><p><strong>⚠️ Please set your GitHub token below</strong></p></div>';
        }
        
        echo '<form method="post">';
        echo '<table class="form-table">';
        echo '<tr><th>GitHub Token</th><td>';
        echo '<input type="password" name="github_token" style="width: 300px;" placeholder="ghp_..." />';
        echo '<p class="description">Get your token from: <a href="https://github.com/settings/tokens" target="_blank">GitHub Settings</a></p>';
        echo '</td></tr>';
        echo '<tr><th>Repository</th><td>';
        echo '<input type="text" value="' . $this->github_repo . '" readonly style="width: 300px;" />';
        echo '</td></tr>';
        echo '</table>';
        echo '<p><input type="submit" name="update_token" class="button-primary" value="Update Token" /></p>';
        echo '</form>';
        
        // Test section
        echo '<h2>Test Webhook</h2>';
        echo '<p>Click the button below to test if your webhook is working:</p>';
        echo '<form method="post">';
        echo '<input type="submit" name="test_webhook" class="button" value="Test Webhook Now" />';
        echo '</form>';
        
        echo '</div>';
    }
    
    public function handle_token_update() {
        if (isset($_POST['update_token']) && !empty($_POST['github_token'])) {
            // This is a simplified version - in production, you'd store in wp_options
            $token = sanitize_text_field($_POST['github_token']);
            echo '<div class="notice notice-info"><p>To update the token, edit the plugin file and replace YOUR_GITHUB_TOKEN_HERE with: <code>' . esc_html($token) . '</code></p></div>';
        }
        
        if (isset($_POST['test_webhook'])) {
            $this->test_webhook();
        }
    }
    
    public function test_webhook() {
        $result = $this->send_webhook_request(array(
            'source' => 'manual-test',
            'test' => true,
            'timestamp' => current_time('c')
        ));
        
        if ($result) {
            echo '<div class="notice notice-success"><p><strong>✅ Test webhook sent successfully!</strong> Check your GitHub Actions.</p></div>';
        } else {
            echo '<div class="notice notice-error"><p><strong>❌ Test webhook failed.</strong> Check your token and try again.</p></div>';
        }
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
        
        $payload = array(
            'source' => 'wordpress-post-update',
            'post_id' => $post_id,
            'post_title' => $post->post_title,
            'post_status' => $post->post_status,
            'post_url' => get_permalink($post_id),
            'timestamp' => current_time('c'),
            'action' => $update ? 'post_updated' : 'post_created'
        );
        
        $this->send_webhook_request($payload);
    }
    
    private function send_webhook_request($client_payload) {
        // Check if token is set
        if ($this->github_token === 'YOUR_GITHUB_TOKEN_HERE') {
            error_log('GitHub Webhook Error: Token not configured');
            return false;
        }
        
        $webhook_url = 'https://api.github.com/repos/' . $this->github_repo . '/dispatches';
        
        $payload = array(
            'event_type' => 'wordpress-update',
            'client_payload' => $client_payload
        );
        
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
        
        $response = wp_remote_request($webhook_url, $args);
        
        if (is_wp_error($response)) {
            error_log('GitHub Webhook Error: ' . $response->get_error_message());
            return false;
        } else {
            $response_code = wp_remote_retrieve_response_code($response);
            if ($response_code === 204) {
                error_log('GitHub Webhook Success: Site rebuild triggered');
                return true;
            } else {
                error_log('GitHub Webhook Failed: Response code ' . $response_code);
                error_log('GitHub Webhook Response: ' . wp_remote_retrieve_body($response));
                return false;
            }
        }
    }
}

// Initialize the plugin
new GitHubWebhookTrigger();
?> 