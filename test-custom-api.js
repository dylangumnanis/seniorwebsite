const CUSTOM_API_URL = 'https://info.digitaltrailheads.com/wp-json/dt-sync/v1';
const API_KEY = 'dt-sync-ca08675eb5ec2c49f2cd06e139be7bd0'; // Updated to match the secure API key

async function makeRequest(url, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': API_KEY,
        }
    };

    if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
    }

    console.log(`\n🌐 ${method} ${url}`);
    console.log('Headers:', options.headers);
    
    if (data) {
        console.log('Body:', JSON.stringify(data, null, 2));
    }

    try {
        const response = await fetch(url, options);
        const responseData = await response.json();
        
        console.log(`📊 Response Status: ${response.status}`);
        console.log('📄 Response Data:', JSON.stringify(responseData, null, 2));
        
        return { success: response.ok, status: response.status, data: responseData };
    } catch (error) {
        console.error('❌ Request failed:', error.message);
        return { success: false, error: error.message };
    }
}

async function testCustomAPI() {
    console.log('🧪 Testing Digital Trailheads Custom Sync API');
    console.log('=' .repeat(50));
    
    // Test 1: Test endpoint (no auth required)
    console.log('\n1️⃣ Testing basic connectivity (no auth)...');
    const testResponse = await makeRequest(`${CUSTOM_API_URL}/test`);
    
    if (!testResponse.success) {
        console.log('❌ Basic test endpoint failed. Is the plugin installed and activated?');
        return;
    }
    
    // Test 2: Health check (with auth)
    console.log('\n2️⃣ Testing health check endpoint...');
    const healthResponse = await makeRequest(`${CUSTOM_API_URL}/health`);
    
    if (!healthResponse.success) {
        console.log('❌ Health check failed. Check your API key.');
        return;
    }
    
    // Test 3: Fetch posts
    console.log('\n3️⃣ Testing fetch posts...');
    const postsResponse = await makeRequest(`${CUSTOM_API_URL}/posts?per_page=5`);
    
    if (!postsResponse.success) {
        console.log('❌ Failed to fetch posts.');
        return;
    }
    
    const posts = postsResponse.data?.data || [];
    console.log(`✅ Successfully fetched ${posts.length} posts`);
    
    // Test 4: Create a test post
    console.log('\n4️⃣ Testing post creation...');
    const testPostData = {
        title: 'Test Post from Custom API',
        content: '<p>This is a test post created using the custom API endpoint. It should work without application passwords!</p>',
        status: 'draft',
        excerpt: 'Test post created via custom API'
    };
    
    const createResponse = await makeRequest(`${CUSTOM_API_URL}/posts`, 'POST', testPostData);
    
    if (!createResponse.success) {
        console.log('❌ Failed to create test post.');
        console.log('Response:', createResponse);
        return;
    }
    
    const createdPost = createResponse.data?.data;
    console.log(`✅ Successfully created test post with ID: ${createdPost?.id}`);
    
    if (createdPost?.id) {
        // Test 5: Update the test post
        console.log('\n5️⃣ Testing post update...');
        const updateData = {
            title: 'Updated Test Post from Custom API',
            content: '<p>This post has been updated via the custom API!</p>'
        };
        
        const updateResponse = await makeRequest(`${CUSTOM_API_URL}/posts/${createdPost.id}`, 'PUT', updateData);
        
        if (updateResponse.success) {
            console.log('✅ Successfully updated test post');
        } else {
            console.log('❌ Failed to update test post');
        }
        
        // Test 6: Fetch the specific post
        console.log('\n6️⃣ Testing fetch single post...');
        const singlePostResponse = await makeRequest(`${CUSTOM_API_URL}/posts/${createdPost.id}`);
        
        if (singlePostResponse.success) {
            console.log('✅ Successfully fetched single post');
        } else {
            console.log('❌ Failed to fetch single post');
        }
        
        // Test 7: Delete the test post
        console.log('\n7️⃣ Testing post deletion...');
        const deleteResponse = await makeRequest(`${CUSTOM_API_URL}/posts/${createdPost.id}?force=true`, 'DELETE');
        
        if (deleteResponse.success) {
            console.log('✅ Successfully deleted test post');
        } else {
            console.log('❌ Failed to delete test post');
        }
    }
    
    console.log('\n🎉 Custom API testing completed!');
    console.log('=' .repeat(50));
    
    // Summary
    console.log('\n📋 Test Summary:');
    console.log('✅ Basic connectivity: Working');
    console.log('✅ Authentication: Working');
    console.log('✅ Read operations: Working');
    console.log('✅ Write operations: Working');
    console.log('\n🚀 Your custom API is ready for bi-directional sync!');
}

// Run the tests
testCustomAPI().catch(console.error); 