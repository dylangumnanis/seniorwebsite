const https = require('https');

// Test JWT Authentication with actual WordPress password
async function testJWTAuthentication() {
    console.log('🔐 Testing JWT Authentication with WordPress password...\n');
    
    // Test JWT authentication
    const success = await testJWTAuth();
    
    if (success) {
        console.log('\n🎉 SUCCESS! JWT authentication is working!');
        console.log('✅ Ready to update the bi-directional sync system');
    } else {
        console.log('\n❌ JWT authentication failed');
        console.log('🔍 Let\'s try some troubleshooting...');
        await troubleshootJWT();
    }
}

async function testJWTAuth() {
    console.log('🧪 Testing JWT authentication...');
    
    const authUrl = 'https://info.digitaltrailheads.com/wp-json/simple-jwt-login/v1/auth';
    const postData = new URLSearchParams({
        username: 'phones2012',
        password: 'sbkb^&L&oaLqL)WuF&g)&1Gz',
        AUTH_KEY: 'blog-sync-auth-2025'
    }).toString();
    
    try {
        const response = await makeRequest(authUrl, 'POST', {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
        }, postData);
        
        console.log('✅ JWT Auth Status:', response.statusCode);
        console.log('📄 JWT Response:', JSON.stringify(response.data, null, 2));
        
        if (response.statusCode === 200 && response.data.success) {
            console.log('🎉 JWT Authentication successful!');
            const jwtToken = response.data.data.jwt;
            console.log('🔑 JWT Token received:', jwtToken.substring(0, 50) + '...');
            
            // Test the JWT token with WordPress API
            const apiSuccess = await testJWTWithWordPressAPI(jwtToken);
            return apiSuccess;
        } else {
            console.log('❌ JWT Authentication failed');
            return false;
        }
        
    } catch (error) {
        console.error('❌ JWT Error:', error.message);
        return false;
    }
}

async function testJWTWithWordPressAPI(jwtToken) {
    console.log('\n🧪 Testing JWT token with WordPress API...');
    
    try {
        // Test reading posts
        const readResponse = await makeRequest('https://info.digitaltrailheads.com/wp-json/wp/v2/posts?per_page=1', 'GET', {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        });
        
        console.log('✅ Read Posts Status:', readResponse.statusCode);
        
        if (readResponse.statusCode === 200) {
            console.log('🎉 JWT token works for reading posts!');
            console.log('📊 Retrieved', readResponse.data.length, 'posts');
            
            // Test creating a post
            console.log('\n📝 Testing post creation with JWT...');
            const createSuccess = await testCreatePostWithJWT(jwtToken);
            return createSuccess;
        } else {
            console.log('❌ JWT token failed for reading posts');
            console.log('📄 Response:', JSON.stringify(readResponse.data, null, 2));
            return false;
        }
        
    } catch (error) {
        console.error('❌ Error testing JWT with WordPress API:', error.message);
        return false;
    }
}

async function testCreatePostWithJWT(jwtToken) {
    const testPost = {
        title: 'JWT Success Test - ' + new Date().toISOString(),
        content: 'This post confirms JWT authentication is working perfectly!',
        status: 'draft'
    };
    
    try {
        const response = await makeRequest('https://info.digitaltrailheads.com/wp-json/wp/v2/posts', 'POST', {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        }, JSON.stringify(testPost));
        
        console.log('✅ Create Post Status:', response.statusCode);
        
        if (response.statusCode === 201) {
            console.log('🎉 Post created successfully with JWT!');
            console.log('📄 Post ID:', response.data.id);
            console.log('📝 Post Title:', response.data.title.rendered);
            
            // Clean up the test post
            console.log('\n🧹 Cleaning up test post...');
            await deleteTestPost(jwtToken, response.data.id);
            
            console.log('\n🎊 COMPLETE SUCCESS! JWT authentication is fully functional!');
            console.log('✅ Ready to implement bi-directional sync');
            return true;
        } else {
            console.log('❌ Failed to create post with JWT');
            console.log('📄 Response:', JSON.stringify(response.data, null, 2));
            return false;
        }
        
    } catch (error) {
        console.error('❌ Error creating post with JWT:', error.message);
        return false;
    }
}

async function deleteTestPost(jwtToken, postId) {
    try {
        const response = await makeRequest(`https://info.digitaltrailheads.com/wp-json/wp/v2/posts/${postId}?force=true`, 'DELETE', {
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

async function troubleshootJWT() {
    console.log('🔍 Troubleshooting JWT issues...');
    
    // Try different parameter formats
    console.log('\n🧪 Trying URL parameters instead of POST body...');
    const authParams = new URLSearchParams({
        username: 'phones2012',
        password: 'sbkb^&L&oaLqL)WuF&g)&1Gz',
        AUTH_KEY: 'blog-sync-auth-2025'
    });
    
    const authUrl = `https://info.digitaltrailheads.com/wp-json/simple-jwt-login/v1/auth?${authParams.toString()}`;
    
    try {
        const response = await makeRequest(authUrl, 'POST');
        console.log('✅ URL Params Status:', response.statusCode);
        console.log('📄 URL Params Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('❌ URL Params Error:', error.message);
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

testJWTAuthentication(); 