<?php
/**
 * Plugin Name: Vercel Revalidation Webhook
 * Description: Automatically triggers Vercel ISR revalidation when posts are created, updated, or deleted
 * Version: 1.0
 * Author: Digital Trailheads
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class VercelRevalidationWebhook {
    
    private $vercel_webhook_url;
    private $webhook_secret;
    
    public function __construct() {
        // Configure your Vercel revalidation endpoint
        $this->vercel_webhook_url = 'https://your-blog.vercel.app/api/revalidate';
        $this->webhook_secret = 'temp-secret-for-testing'; // Change this to match your REVALIDATE_SECRET
        
        // Hook into WordPress post actions
        add_action('save_post', array($this, 'trigger_revalidation'), 10, 2);
        add_action('delete_post', array($this, 'trigger_revalidation_on_delete'), 10, 1);
        add_action('transition_post_status', array($this, 'trigger_revalidation_on_status_change'), 10, 3);
        
        // Add admin settings
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'admin_init'));
    }
    
    /**
     * Trigger revalidation when a post is saved or updated
     */
    public function trigger_revalidation($post_id, $post) {
        // Only revalidate for published posts
        if ($post->post_status !== 'publish' || $post->post_type !== 'post') {
            return;
        }
        
        // Avoid revalidation during auto-saves and revisions
        if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
            return;
        }
        
        $this->send_revalidation_request($post->post_name, 'post');
    }
    
    /**
     * Trigger revalidation when a post is deleted
     */
    public function trigger_revalidation_on_delete($post_id) {
        $post = get_post($post_id);
        if ($post && $post->post_type === 'post') {
            $this->send_revalidation_request($post->post_name, 'post');
        }
    }
    
    /**
     * Trigger revalidation when post status changes
     */
    public function trigger_revalidation_on_status_change($new_status, $old_status, $post) {
        if ($post->post_type !== 'post') {
            return;
        }
        
        // Revalidate when post is published or unpublished
        if ($new_status === 'publish' || $old_status === 'publish') {
            $this->send_revalidation_request($post->post_name, 'post');
        }
    }
    
    /**
     * Send revalidation request to Vercel
     */
    private function send_revalidation_request($slug, $type) {
        $url = $this->vercel_webhook_url . '?secret=' . urlencode($this->webhook_secret);
        
        $body = json_encode(array(
            'slug' => $slug,
            'type' => $type,
            'timestamp' => current_time('mysql'),
            'site_url' => get_site_url()
        ));
        
        $args = array(
            'body' => $body,
            'headers' => array(
                'Content-Type' => 'application/json',
            ),
            'timeout' => 10,
            'method' => 'POST'
        );
        
        $response = wp_remote_post($url, $args);
        
        if (is_wp_error($response)) {
            error_log('Vercel revalidation failed: ' . $response->get_error_message());
        } else {
            $response_code = wp_remote_retrieve_response_code($response);
            $response_body = wp_remote_retrieve_body($response);
            
            if ($response_code === 200) {
                error_log("✅ Vercel revalidation successful for slug: {$slug}");
            } else {
                error_log("❌ Vercel revalidation failed with code {$response_code}: {$response_body}");
            }
        }
    }
    
    /**
     * Add admin menu for settings
     */
    public function add_admin_menu() {
        add_options_page(
            'Vercel Revalidation Settings',
            'Vercel Revalidation',
            'manage_options',
            'vercel-revalidation',
            array($this, 'admin_page')
        );
    }
    
    /**
     * Initialize admin settings
     */
    public function admin_init() {
        register_setting('vercel_revalidation', 'vercel_webhook_url');
        register_setting('vercel_revalidation', 'vercel_webhook_secret');
        
        add_settings_section(
            'vercel_revalidation_section',
            'Vercel Revalidation Settings',
            null,
            'vercel-revalidation'
        );
        
        add_settings_field(
            'vercel_webhook_url',
            'Vercel Webhook URL',
            array($this, 'webhook_url_field'),
            'vercel-revalidation',
            'vercel_revalidation_section'
        );
        
        add_settings_field(
            'vercel_webhook_secret',
            'Webhook Secret',
            array($this, 'webhook_secret_field'),
            'vercel-revalidation',
            'vercel_revalidation_section'
        );
    }
    
    /**
     * Admin page content
     */
    public function admin_page() {
        ?>
        <div class="wrap">
            <h1>Vercel Revalidation Settings</h1>
            <form method="post" action="options.php">
                <?php
                settings_fields('vercel_revalidation');
                do_settings_sections('vercel-revalidation');
                ?>
                <p><strong>Current Configuration:</strong></p>
                <ul>
                    <li>Webhook URL: <code><?php echo esc_html($this->vercel_webhook_url); ?></code></li>
                    <li>Secret: <code><?php echo esc_html($this->webhook_secret); ?></code></li>
                </ul>
                
                <h3>Test Revalidation</h3>
                <p>Click the button below to test if revalidation is working:</p>
                <button type="button" onclick="testRevalidation()" class="button button-secondary">Test Revalidation</button>
                
                <script>
                function testRevalidation() {
                    fetch('<?php echo $this->vercel_webhook_url; ?>?secret=<?php echo urlencode($this->webhook_secret); ?>&slug=test', {
                        method: 'GET'
                    })
                    .then(response => response.json())
                    .then(data => {
                        alert('Test result: ' + JSON.stringify(data));
                    })
                    .catch(error => {
                        alert('Test failed: ' + error);
                    });
                }
                </script>
                
                <?php submit_button(); ?>
            </form>
        </div>
        <?php
    }
    
    public function webhook_url_field() {
        $value = get_option('vercel_webhook_url', $this->vercel_webhook_url);
        echo '<input type="url" name="vercel_webhook_url" value="' . esc_attr($value) . '" class="regular-text" />';
        echo '<p class="description">Full URL to your Vercel revalidation endpoint</p>';
    }
    
    public function webhook_secret_field() {
        $value = get_option('vercel_webhook_secret', $this->webhook_secret);
        echo '<input type="text" name="vercel_webhook_secret" value="' . esc_attr($value) . '" class="regular-text" />';
        echo '<p class="description">Secret key for webhook authentication</p>';
    }
}

// Initialize the plugin
new VercelRevalidationWebhook();

?> 