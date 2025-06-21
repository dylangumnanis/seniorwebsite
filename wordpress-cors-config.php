<?php
// Add this code to your WordPress theme's functions.php file
// This allows your static Bluehost site to fetch content from WordPress

function senior_tech_cors_headers() {
    // Allow requests from your Bluehost domain
    // Replace 'yourdomain.com' with your actual domain
    $allowed_origins = [
        'https://yourdomain.com',
        'https://www.yourdomain.com',
        'http://yourdomain.com',  // HTTP fallback
        'http://www.yourdomain.com' // HTTP fallback
    ];
    
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
    }
    
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Credentials: true");
}

// Apply CORS headers to all requests
add_action('init', 'senior_tech_cors_headers');

// Handle preflight requests for CORS
add_action('wp_ajax_nopriv_cors_preflight', function() {
    senior_tech_cors_headers();
    wp_die();
});

add_action('wp_ajax_cors_preflight', function() {
    senior_tech_cors_headers();
    wp_die();
});

// Ensure CORS headers are sent with REST API responses
add_filter('rest_pre_serve_request', function($served, $result, $request, $server) {
    senior_tech_cors_headers();
    return $served;
}, 10, 4);

?> 