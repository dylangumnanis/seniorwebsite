const https = require('https');

// Test JWT user information and capabilities
async function testJWTUserInfo() {
    console.log('🔐 Testing JWT User Information and Capabilities...\n');
    
    // Get JWT token
    const jwtToken = await getJWTToken();
    
    if (!jwtToken) {
        console.log('❌ Failed to get JWT token');
        return;
    }
    
    console.log('✅ JWT token obtained successfully\n');
    
    // Test user info endpoint
    await testUserInfoEndpoint(jwtToken);
    
    // Test current user endpoint
    await testCurrentUserEndpoint(jwtToken);
    
    // Test user capabilities directly
    await testUserCapabilities(jwtToken);
}

async function getJWTToken() {
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
        
        if (response.statusCode === 200 && response.data.success) {
            return response.data.data.jwt;
        } else {
            console.log('❌ Failed to get JWT token:', response.data);
        }
    } catch (error) {
        console.error('❌ Error getting JWT token:', error.message);
    }
    return null;
}

async function testUserInfoEndpoint(jwtToken) {
    console.log('👤 Testing /wp/v2/users/me endpoint...');
    
    try {
        const response = await makeRequest('https://info.digitaltrailheads.com/wp-json/wp/v2/users/me', 'GET', {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        });
        
        console.log('✅ Users/me Status:', response.statusCode);
        
        if (response.statusCode === 200) {
            console.log('🎉 JWT works for user info!');
            console.log('👤 User:', response.data.name, '(ID:', response.data.id + ')');
            console.log('🔐 Roles:', response.data.roles);
            console.log('📧 Email:', response.data.email);
            
            // Check capabilities
            const caps = response.data.capabilities || {};
            console.log('\n✨ User Capabilities:');
            console.log('   - publish_posts:', caps.publish_posts || false);
            console.log('   - edit_posts:', caps.edit_posts || false);
            console.log('   - delete_posts:', caps.delete_posts || false);
            console.log('   - manage_options:', caps.manage_options || false);
            console.log('   - edit_others_posts:', caps.edit_others_posts || false);
            console.log('   - create_posts:', caps.create_posts || false);
            
            // Show all capabilities
            console.log('\n📋 All Capabilities:', Object.keys(caps).join(', '));
            
            return true;
        } else {
            console.log('❌ Failed to get user info');
            console.log('📄 Response:', JSON.stringify(response.data, null, 2));
        }
    } catch (error) {
        console.error('❌ Error testing user info:', error.message);
    }
    return false;
}

async function testCurrentUserEndpoint(jwtToken) {
    console.log('\n👤 Testing /wp/v2/users/1 endpoint (direct user ID)...');
    
    try {
        const response = await makeRequest('https://info.digitaltrailheads.com/wp-json/wp/v2/users/1', 'GET', {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        });
        
        console.log('✅ Users/1 Status:', response.statusCode);
        
        if (response.statusCode === 200) {
            console.log('🎉 JWT works for direct user access!');
            console.log('👤 User:', response.data.name);
        } else {
            console.log('❌ Failed to get user by ID');
            console.log('📄 Response:', response.data.message || 'Unknown error');
        }
    } catch (error) {
        console.error('❌ Error testing direct user access:', error.message);
    }
}

async function testUserCapabilities(jwtToken) {
    console.log('\n🔍 Testing specific post creation scenarios...');
    
    // Test 1: Try creating a post with author explicitly set
    console.log('\n📝 Test 1: Creating post with explicit author...');
    const postWithAuthor = {
        title: 'JWT Test with Author - ' + new Date().toISOString(),
        content: 'Test post with explicit author',
        status: 'draft',
        author: 1
    };
    
    await testCreateSpecificPost(jwtToken, postWithAuthor, 'with explicit author');
    
    // Test 2: Try creating a post without author
    console.log('\n📝 Test 2: Creating post without author...');
    const postWithoutAuthor = {
        title: 'JWT Test no Author - ' + new Date().toISOString(),
        content: 'Test post without author',
        status: 'draft'
    };
    
    await testCreateSpecificPost(jwtToken, postWithoutAuthor, 'without author');
    
    // Test 3: Try creating a private post
    console.log('\n📝 Test 3: Creating private post...');
    const privatePost = {
        title: 'JWT Private Test - ' + new Date().toISOString(),
        content: 'Private test post',
        status: 'private'
    };
    
    await testCreateSpecificPost(jwtToken, privatePost, 'private post');
}

async function testCreateSpecificPost(jwtToken, postData, description) {
    try {
        const response = await makeRequest('https://info.digitaltrailheads.com/wp-json/wp/v2/posts', 'POST', {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        }, JSON.stringify(postData));
        
        console.log(`   ✅ Create ${description} Status:`, response.statusCode);
        
        if (response.statusCode === 201) {
            console.log(`   🎉 Successfully created ${description}!`);
            console.log(`   📄 Post ID: ${response.data.id}`);
            
            // Clean up
            await deleteTestPost(jwtToken, response.data.id);
        } else {
            console.log(`   ❌ Failed to create ${description}`);
            console.log(`   📄 Error: ${response.data.message || response.data.code || 'Unknown error'}`);
        }
    } catch (error) {
        console.error(`   ❌ Error creating ${description}:`, error.message);
    }
}

async function deleteTestPost(jwtToken, postId) {
    try {
        const response = await makeRequest(`https://info.digitaltrailheads.com/wp-json/wp/v2/posts/${postId}?force=true`, 'DELETE', {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        });
        
        if (response.statusCode === 200) {
            console.log('   ✅ Test post deleted successfully');
        }
    } catch (error) {
        console.error('   ❌ Error deleting test post:', error.message);
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

testJWTUserInfo(); 