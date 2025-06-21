<?php
/*
Plugin Name: Simple GitHub Webhook
Description: Triggers GitHub Actions when WordPress posts are updated
Version: 1.0
*/

// Prevent direct access
if (!defined('ABSPATH')) exit;

// Hook into post save
add_action('save_post', 'trigger_github_rebuild');
add_action('publish_post', 'trigger_github_rebuild');

function trigger_github_rebuild($post_id) {
    // Only for published posts
    $post = get_post($post_id);
    if ($post->post_status !== 'publish' || $post->post_type !== 'post') {
        return;
    }
    
    // Don't trigger for autosaves
    if (wp_is_post_autosave($post_id) || wp_is_post_revision($post_id)) {
        return;
    }
    
    // GitHub settings - REPLACE YOUR_TOKEN_HERE with your actual token
    $github_token = 'YOUR_TOKEN_HERE';
    $repo = 'dylangumnanis/seniorwebsite';
    
    if ($github_token === 'YOUR_TOKEN_HERE') {
        error_log('GitHub Webhook: Please set your token in the plugin file');
        return;
    }
    
    // Send webhook to GitHub
    $url = "https://api.github.com/repos/$repo/dispatches";
    $data = json_encode([
        'event_type' => 'wordpress-update',
        'client_payload' => [
            'post_id' => $post_id,
            'post_title' => $post->post_title,
            'timestamp' => date('c')
        ]
    ]);
    
    $response = wp_remote_post($url, [
        'headers' => [
            'Authorization' => "Bearer $github_token",
            'Accept' => 'application/vnd.github.v3+json',
            'Content-Type' => 'application/json'
        ],
        'body' => $data,
        'timeout' => 30
    ]);
    
    // Log result
    if (is_wp_error($response)) {
        error_log('GitHub Webhook Error: ' . $response->get_error_message());
    } else {
        $code = wp_remote_retrieve_response_code($response);
        if ($code === 204) {
            error_log("GitHub Webhook Success: Triggered rebuild for '$post->post_title'");
        } else {
            error_log("GitHub Webhook Failed: HTTP $code");
        }
    }
}

// Add admin notice
add_action('admin_notices', function() {
    if (strpos(file_get_contents(__FILE__), 'YOUR_TOKEN_HERE') !== false) {
        echo '<div class="notice notice-warning"><p><strong>Simple GitHub Webhook:</strong> Please edit the plugin file and replace YOUR_TOKEN_HERE with your GitHub token.</p></div>';
    }
});
?> 