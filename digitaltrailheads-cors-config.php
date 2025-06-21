<?php
// CORS Configuration for Digital Trailheads Blog
// Add this code to your WordPress theme's functions.php file
// This allows your blog at digitaltrailheads.com to fetch content from info.digitaltrailheads.com

function digitaltrailheads_cors_headers() {
    // Allow requests from your main domain
    $allowed_origins = [
        'https://digitaltrailheads.com',
        'https://www.digitaltrailheads.com',
        'http://digitaltrailheads.com',  // HTTP fallback
        'http://www.digitaltrailheads.com', // HTTP fallback
        'https://info.digitaltrailheads.com', // Same subdomain
        'http://info.digitaltrailheads.com'   // HTTP fallback
    ];
    
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
    }
    
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Allow-Credentials: true");
    
    // Handle preflight requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

// Apply CORS headers to all requests
add_action('init', 'digitaltrailheads_cors_headers');

// Ensure CORS headers are sent with REST API responses
add_filter('rest_pre_serve_request', function($served, $result, $request, $server) {
    digitaltrailheads_cors_headers();
    return $served;
}, 10, 4);

// Handle preflight requests for custom API endpoints
add_action('wp_ajax_nopriv_cors_preflight', function() {
    digitaltrailheads_cors_headers();
    wp_die();
});

add_action('wp_ajax_cors_preflight', function() {
    digitaltrailheads_cors_headers();
    wp_die();
});

?> 