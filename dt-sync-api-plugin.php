<?php
/**
 * Plugin Name: Digital Trailheads Sync API
 * Description: Custom API endpoints for bi-directional content sync without application passwords
 * Version: 1.0.0
 * Author: Digital Trailheads
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class DigitalTrailheadsSyncAPI {
    
    private $api_key = 'seniortech_sync_api_key_12345'; // Change this to a secure random key
    
    public function __construct() {
        add_action('rest_api_init', array($this, 'register_routes'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'admin_init'));
    }
    
    /**
     * Register custom REST API routes
     */
    public function register_routes() {
        // Get posts endpoint
        register_rest_route('dt-sync/v1', '/posts', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_posts'),
            'permission_callback' => array($this, 'verify_api_key'),
        ));
        
        // Get single post by ID
        register_rest_route('dt-sync/v1', '/posts/(?P<id>\d+)', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_post'),
            'permission_callback' => array($this, 'verify_api_key'),
        ));
        
        // Get post by slug
        register_rest_route('dt-sync/v1', '/posts/slug/(?P<slug>[a-zA-Z0-9\-]+)', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_post_by_slug'),
            'permission_callback' => array($this, 'verify_api_key'),
        ));
        
        // Create new post
        register_rest_route('dt-sync/v1', '/posts', array(
            'methods' => 'POST',
            'callback' => array($this, 'create_post'),
            'permission_callback' => array($this, 'verify_api_key'),
        ));
        
        // Update existing post
        register_rest_route('dt-sync/v1', '/posts/(?P<id>\d+)', array(
            'methods' => 'PUT',
            'callback' => array($this, 'update_post'),
            'permission_callback' => array($this, 'verify_api_key'),
        ));
        
        // Delete post
        register_rest_route('dt-sync/v1', '/posts/(?P<id>\d+)', array(
            'methods' => 'DELETE',
            'callback' => array($this, 'delete_post'),
            'permission_callback' => array($this, 'verify_api_key'),
        ));
        
        // Health check endpoint
        register_rest_route('dt-sync/v1', '/health', array(
            'methods' => 'GET',
            'callback' => array($this, 'health_check'),
            'permission_callback' => array($this, 'verify_api_key'),
        ));
        
        // Test endpoint (no auth required)
        register_rest_route('dt-sync/v1', '/test', array(
            'methods' => 'GET',
            'callback' => array($this, 'test_endpoint'),
            'permission_callback' => '__return_true',
        ));
    }
    
    /**
     * Verify API key authentication
     */
    public function verify_api_key($request) {
        $api_key = $request->get_header('X-API-Key');
        
        // Also check Authorization header for Bearer token
        if (!$api_key) {
            $auth_header = $request->get_header('Authorization');
            if ($auth_header && strpos($auth_header, 'Bearer ') === 0) {
                $api_key = substr($auth_header, 7); // Remove 'Bearer ' prefix
            }
        }
        
        // Fallback to URL parameter
        if (!$api_key) {
            $api_key = $request->get_param('api_key');
        }
        
        $stored_key = get_option('dt_sync_api_key', $this->api_key);
        
        return $api_key === $stored_key;
    }
    
    /**
     * Get posts with pagination and filtering
     */
    public function get_posts($request) {
        $per_page = $request->get_param('per_page') ?: 10;
        $page = $request->get_param('page') ?: 1;
        $search = $request->get_param('search');
        $status = $request->get_param('status') ?: 'publish';
        
        $args = array(
            'post_type' => 'post',
            'post_status' => $status,
            'posts_per_page' => min($per_page, 100), // Limit to 100 per page
            'paged' => $page,
            'orderby' => 'modified',
            'order' => 'DESC'
        );
        
        if ($search) {
            $args['s'] = $search;
        }
        
        $query = new WP_Query($args);
        $posts = array();
        
        foreach ($query->posts as $post) {
            $posts[] = $this->format_post($post);
        }
        
        return new WP_REST_Response(array(
            'success' => true,
            'data' => $posts,
            'pagination' => array(
                'page' => $page,
                'per_page' => $per_page,
                'total' => $query->found_posts,
                'total_pages' => $query->max_num_pages
            )
        ), 200);
    }
    
    /**
     * Get single post by ID
     */
    public function get_post($request) {
        $id = $request->get_param('id');
        $post = get_post($id);
        
        if (!$post || $post->post_type !== 'post') {
            return new WP_REST_Response(array(
                'success' => false,
                'message' => 'Post not found'
            ), 404);
        }
        
        return new WP_REST_Response(array(
            'success' => true,
            'data' => $this->format_post($post)
        ), 200);
    }
    
    /**
     * Get post by slug
     */
    public function get_post_by_slug($request) {
        $slug = $request->get_param('slug');
        $post = get_page_by_path($slug, OBJECT, 'post');
        
        if (!$post) {
            return new WP_REST_Response(array(
                'success' => false,
                'message' => 'Post not found'
            ), 404);
        }
        
        return new WP_REST_Response(array(
            'success' => true,
            'data' => $this->format_post($post)
        ), 200);
    }
    
    /**
     * Create new post
     */
    public function create_post($request) {
        $data = $request->get_json_params();
        
        if (!isset($data['title']) || !isset($data['content'])) {
            return new WP_REST_Response(array(
                'success' => false,
                'message' => 'Title and content are required'
            ), 400);
        }
        
        $post_data = array(
            'post_title' => sanitize_text_field($data['title']),
            'post_content' => wp_kses_post($data['content']),
            'post_status' => isset($data['status']) ? $data['status'] : 'draft',
            'post_type' => 'post'
        );
        
        if (isset($data['slug'])) {
            $post_data['post_name'] = sanitize_title($data['slug']);
        }
        
        if (isset($data['excerpt'])) {
            $post_data['post_excerpt'] = sanitize_text_field($data['excerpt']);
        }
        
        $post_id = wp_insert_post($post_data);
        
        if (is_wp_error($post_id)) {
            return new WP_REST_Response(array(
                'success' => false,
                'message' => 'Failed to create post: ' . $post_id->get_error_message()
            ), 500);
        }
        
        // Handle categories
        if (isset($data['categories']) && is_array($data['categories'])) {
            wp_set_post_categories($post_id, $data['categories']);
        }
        
        // Handle tags
        if (isset($data['tags']) && is_array($data['tags'])) {
            wp_set_post_tags($post_id, $data['tags']);
        }
        
        // Handle featured media
        if (isset($data['featured_media']) && is_numeric($data['featured_media'])) {
            set_post_thumbnail($post_id, $data['featured_media']);
        }
        
        $post = get_post($post_id);
        
        return new WP_REST_Response(array(
            'success' => true,
            'data' => $this->format_post($post),
            'message' => 'Post created successfully'
        ), 201);
    }
    
    /**
     * Update existing post
     */
    public function update_post($request) {
        $id = $request->get_param('id');
        $data = $request->get_json_params();
        
        $post = get_post($id);
        if (!$post || $post->post_type !== 'post') {
            return new WP_REST_Response(array(
                'success' => false,
                'message' => 'Post not found'
            ), 404);
        }
        
        $post_data = array(
            'ID' => $id
        );
        
        if (isset($data['title'])) {
            $post_data['post_title'] = sanitize_text_field($data['title']);
        }
        
        if (isset($data['content'])) {
            $post_data['post_content'] = wp_kses_post($data['content']);
        }
        
        if (isset($data['status'])) {
            $post_data['post_status'] = $data['status'];
        }
        
        if (isset($data['slug'])) {
            $post_data['post_name'] = sanitize_title($data['slug']);
        }
        
        if (isset($data['excerpt'])) {
            $post_data['post_excerpt'] = sanitize_text_field($data['excerpt']);
        }
        
        $result = wp_update_post($post_data);
        
        if (is_wp_error($result)) {
            return new WP_REST_Response(array(
                'success' => false,
                'message' => 'Failed to update post: ' . $result->get_error_message()
            ), 500);
        }
        
        // Handle categories
        if (isset($data['categories']) && is_array($data['categories'])) {
            wp_set_post_categories($id, $data['categories']);
        }
        
        // Handle tags
        if (isset($data['tags']) && is_array($data['tags'])) {
            wp_set_post_tags($id, $data['tags']);
        }
        
        // Handle featured media
        if (isset($data['featured_media'])) {
            if (is_numeric($data['featured_media'])) {
                set_post_thumbnail($id, $data['featured_media']);
            } else {
                delete_post_thumbnail($id);
            }
        }
        
        $updated_post = get_post($id);
        
        return new WP_REST_Response(array(
            'success' => true,
            'data' => $this->format_post($updated_post),
            'message' => 'Post updated successfully'
        ), 200);
    }
    
    /**
     * Delete post
     */
    public function delete_post($request) {
        $id = $request->get_param('id');
        $force = $request->get_param('force') === 'true';
        
        $post = get_post($id);
        if (!$post || $post->post_type !== 'post') {
            return new WP_REST_Response(array(
                'success' => false,
                'message' => 'Post not found'
            ), 404);
        }
        
        $result = wp_delete_post($id, $force);
        
        if (!$result) {
            return new WP_REST_Response(array(
                'success' => false,
                'message' => 'Failed to delete post'
            ), 500);
        }
        
        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'Post deleted successfully'
        ), 200);
    }
    
    /**
     * Health check endpoint
     */
    public function health_check($request) {
        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'Digital Trailheads Sync API is working',
            'timestamp' => current_time('mysql'),
            'wordpress_version' => get_bloginfo('version'),
            'plugin_version' => '1.0.0'
        ), 200);
    }
    
    /**
     * Test endpoint (no authentication required)
     */
    public function test_endpoint($request) {
        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'API endpoint is accessible',
            'timestamp' => current_time('mysql')
        ), 200);
    }
    
    /**
     * Format post data for API response
     */
    private function format_post($post) {
        $categories = wp_get_post_categories($post->ID, array('fields' => 'all'));
        $tags = wp_get_post_tags($post->ID, array('fields' => 'all'));
        $featured_media = get_post_thumbnail_id($post->ID);
        
        $featured_image_url = null;
        if ($featured_media) {
            $featured_image_url = wp_get_attachment_image_url($featured_media, 'full');
        }
        
        return array(
            'id' => $post->ID,
            'title' => array(
                'rendered' => get_the_title($post->ID)
            ),
            'content' => array(
                'rendered' => apply_filters('the_content', $post->post_content)
            ),
            'excerpt' => array(
                'rendered' => get_the_excerpt($post->ID)
            ),
            'slug' => $post->post_name,
            'date' => $post->post_date,
            'modified' => $post->post_modified,
            'status' => $post->post_status,
            'author' => $post->post_author,
            'featured_media' => $featured_media,
            'featured_image_url' => $featured_image_url,
            'categories' => array_map(function($cat) {
                return array(
                    'id' => $cat->term_id,
                    'name' => $cat->name,
                    'slug' => $cat->slug
                );
            }, $categories),
            'tags' => array_map(function($tag) {
                return array(
                    'id' => $tag->term_id,
                    'name' => $tag->name,
                    'slug' => $tag->slug
                );
            }, $tags),
            'link' => get_permalink($post->ID)
        );
    }
    
    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        add_options_page(
            'DT Sync API Settings',
            'DT Sync API',
            'manage_options',
            'dt-sync-api',
            array($this, 'admin_page')
        );
    }
    
    /**
     * Admin page initialization
     */
    public function admin_init() {
        register_setting('dt_sync_api_settings', 'dt_sync_api_key');
        
        add_settings_section(
            'dt_sync_api_section',
            'API Settings',
            null,
            'dt-sync-api'
        );
        
        add_settings_field(
            'dt_sync_api_key',
            'API Key',
            array($this, 'api_key_field'),
            'dt-sync-api',
            'dt_sync_api_section'
        );
    }
    
    /**
     * API key field callback
     */
    public function api_key_field() {
        $value = get_option('dt_sync_api_key', $this->api_key);
        echo '<input type="text" name="dt_sync_api_key" value="' . esc_attr($value) . '" size="50" />';
        echo '<p class="description">Change this to a secure random string for production use.</p>';
    }
    
    /**
     * Admin page content
     */
    public function admin_page() {
        ?>
        <div class="wrap">
            <h1>Digital Trailheads Sync API Settings</h1>
            
            <form method="post" action="options.php">
                <?php
                settings_fields('dt_sync_api_settings');
                do_settings_sections('dt-sync-api');
                submit_button();
                ?>
            </form>
            
            <div style="margin-top: 30px; padding: 20px; background: #f9f9f9; border-left: 4px solid #0073aa;">
                <h2>API Endpoints</h2>
                <p><strong>Base URL:</strong> <code><?php echo home_url('/wp-json/dt-sync/v1'); ?></code></p>
                
                <h3>Available Endpoints:</h3>
                <ul>
                    <li><code>GET /posts</code> - Get all posts (with pagination)</li>
                    <li><code>GET /posts/{id}</code> - Get single post by ID</li>
                    <li><code>GET /posts/slug/{slug}</code> - Get post by slug</li>
                    <li><code>POST /posts</code> - Create new post</li>
                    <li><code>PUT /posts/{id}</code> - Update existing post</li>
                    <li><code>DELETE /posts/{id}</code> - Delete post</li>
                    <li><code>GET /health</code> - Health check</li>
                    <li><code>GET /test</code> - Test endpoint (no auth required)</li>
                </ul>
                
                <h3>Authentication:</h3>
                <p>Include your API key in requests using one of these methods:</p>
                <ul>
                    <li>Header: <code>X-API-Key: your-api-key</code></li>
                    <li>Query parameter: <code>?api_key=your-api-key</code></li>
                </ul>
                
                <h3>Test Your API:</h3>
                <p>Test endpoint (no auth): <a href="<?php echo home_url('/wp-json/dt-sync/v1/test'); ?>" target="_blank"><?php echo home_url('/wp-json/dt-sync/v1/test'); ?></a></p>
            </div>
        </div>
        <?php
    }
}

// Initialize the plugin
new DigitalTrailheadsSyncAPI(); 