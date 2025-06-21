const https = require('https');
const querystring = require('querystring');

// Test JWT Authentication with Simple JWT Login plugin
async function testJWTAuth() {
    console.log('🔐 Testing JWT Authentication with Simple JWT Login...\n');
    
    // Step 1: Get JWT Token
    const authParams = {
        username: 'phones2012',
        password: 'XRTvsI1&U@jjeuSTU$gxThL',
        AUTH_KEY: 'blog-sync-auth-2025'
    };
    
    const authUrl = `https://info.digitaltrailheads.com/?rest_route=/simple-jwt-login/v1/auth&${querystring.stringify(authParams)}`;
    
    console.log('📡 Requesting JWT token...');
    console.log('URL:', authUrl.replace(authParams.password, '[PASSWORD_HIDDEN]'));
    
    try {
        const authResponse = await makeRequest(authUrl, 'POST');
        console.log('✅ Auth Response Status:', authResponse.statusCode);
        console.log('📄 Auth Response:', authResponse.data);
        
        if (authResponse.statusCode === 200 && authResponse.data.success) {
            const jwtToken = authResponse.data.data.jwt;
            console.log('🎉 JWT Token received:', jwtToken.substring(0, 50) + '...');
            
            // Step 2: Test JWT token with WordPress API
            console.log('\n🧪 Testing JWT token with WordPress API...');
            await testJWTWithWordPressAPI(jwtToken);
            
        } else {
            console.log('❌ Failed to get JWT token');
            console.log('Response:', JSON.stringify(authResponse.data, null, 2));
        }
        
    } catch (error) {
        console.error('❌ Error during JWT authentication:', error.message);
    }
}

async function testJWTWithWordPressAPI(jwtToken) {
    const apiUrl = 'https://info.digitaltrailheads.com/wp-json/wp/v2/posts?per_page=1';
    
    try {
        const response = await makeRequest(apiUrl, 'GET', {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        });
        
        console.log('✅ WordPress API Response Status:', response.statusCode);
        
        if (response.statusCode === 200) {
            console.log('🎉 JWT Authentication successful!');
            console.log('📊 Retrieved', JSON.parse(response.data).length, 'posts');
            
            // Test creating a post (write operation)
            console.log('\n📝 Testing write operation with JWT...');
            await testCreatePost(jwtToken);
            
        } else {
            console.log('❌ JWT token validation failed');
            console.log('Response:', response.data);
        }
        
    } catch (error) {
        console.error('❌ Error testing JWT with WordPress API:', error.message);
    }
}

async function testCreatePost(jwtToken) {
    const createUrl = 'https://info.digitaltrailheads.com/wp-json/wp/v2/posts';
    const testPost = {
        title: 'JWT Test Post - ' + new Date().toISOString(),
        content: 'This is a test post created via JWT authentication.',
        status: 'draft' // Create as draft to avoid publishing
    };
    
    try {
        const response = await makeRequest(createUrl, 'POST', {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        }, JSON.stringify(testPost));
        
        console.log('✅ Create Post Response Status:', response.statusCode);
        
        if (response.statusCode === 201) {
            const createdPost = JSON.parse(response.data);
            console.log('🎉 Post created successfully!');
            console.log('📄 Post ID:', createdPost.id);
            console.log('📝 Post Title:', createdPost.title.rendered);
            
            // Clean up - delete the test post
            console.log('\n🧹 Cleaning up test post...');
            await deleteTestPost(jwtToken, createdPost.id);
            
        } else {
            console.log('❌ Failed to create post');
            console.log('Response:', response.data);
        }
        
    } catch (error) {
        console.error('❌ Error creating test post:', error.message);
    }
}

async function deleteTestPost(jwtToken, postId) {
    const deleteUrl = `https://info.digitaltrailheads.com/wp-json/wp/v2/posts/${postId}?force=true`;
    
    try {
        const response = await makeRequest(deleteUrl, 'DELETE', {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        });
        
        if (response.statusCode === 200) {
            console.log('✅ Test post deleted successfully');
        } else {
            console.log('⚠️  Test post deletion status:', response.statusCode);
        }
        
    } catch (error) {
        console.error('❌ Error deleting test post:', error.message);
    }
}

function makeRequest(url, method, headers = {}, data = null) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || 443,
            path: urlObj.pathname + urlObj.search,
            method: method,
            headers: headers
        };
        
        const req = https.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(responseData);
                    resolve({
                        statusCode: res.statusCode,
                        data: parsedData
                    });
                } catch (e) {
                    resolve({
                        statusCode: res.statusCode,
                        data: responseData
                    });
                }
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        if (data) {
            req.write(data);
        }
        
        req.end();
    });
}

// Run the test
testJWTAuth(); 