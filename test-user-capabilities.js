const https = require('https');

// Test user capabilities and permissions
async function testUserCapabilities() {
    console.log('🔐 Testing user capabilities and permissions...\n');
    
    // First get JWT token
    const jwtToken = await getJWTToken();
    
    if (jwtToken) {
        console.log('✅ JWT token obtained successfully\n');
        
        // Test user info
        await testUserInfo(jwtToken);
        
        // Test different post creation methods
        await testPostCreationMethods(jwtToken);
    } else {
        console.log('❌ Failed to get JWT token');
    }
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
        }
    } catch (error) {
        console.error('❌ Error getting JWT token:', error.message);
    }
    return null;
}

async function testUserInfo(jwtToken) {
    console.log('👤 Testing user information and capabilities...');
    
    try {
        const response = await makeRequest('https://info.digitaltrailheads.com/wp-json/wp/v2/users/me', 'GET', {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        });
        
        console.log('✅ User Info Status:', response.statusCode);
        
        if (response.statusCode === 200) {
            console.log('📊 User Details:');
            console.log('   - ID:', response.data.id);
            console.log('   - Name:', response.data.name);
            console.log('   - Username:', response.data.username);
            console.log('   - Email:', response.data.email);
            console.log('   - Roles:', response.data.roles);
            console.log('   - Capabilities:', Object.keys(response.data.capabilities || {}));
            
            // Check specific capabilities
            const caps = response.data.capabilities || {};
            console.log('\n🔍 Key Capabilities:');
            console.log('   - publish_posts:', caps.publish_posts || false);
            console.log('   - edit_posts:', caps.edit_posts || false);
            console.log('   - delete_posts:', caps.delete_posts || false);
            console.log('   - manage_options:', caps.manage_options || false);
            
        } else {
            console.log('❌ Failed to get user info');
            console.log('📄 Response:', JSON.stringify(response.data, null, 2));
        }
    } catch (error) {
        console.error('❌ Error getting user info:', error.message);
    }
}

async function testPostCreationMethods(jwtToken) {
    console.log('\n📝 Testing different post creation methods...');
    
    // Method 1: Create as draft
    console.log('\n🧪 Method 1: Creating as draft');
    await testCreatePost(jwtToken, 'draft');
    
    // Method 2: Create as private
    console.log('\n🧪 Method 2: Creating as private');
    await testCreatePost(jwtToken, 'private');
    
    // Method 3: Create with minimal data
    console.log('\n🧪 Method 3: Creating with minimal data');
    await testCreateMinimalPost(jwtToken);
}

async function testCreatePost(jwtToken, status) {
    const testPost = {
        title: `JWT Test Post (${status}) - ${new Date().toISOString()}`,
        content: `This is a test post with status: ${status}`,
        status: status
    };
    
    try {
        const response = await makeRequest('https://info.digitaltrailheads.com/wp-json/wp/v2/posts', 'POST', {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        }, JSON.stringify(testPost));
        
        console.log(`✅ Create Post (${status}) Status:`, response.statusCode);
        
        if (response.statusCode === 201) {
            console.log(`🎉 Post created successfully as ${status}!`);
            console.log('📄 Post ID:', response.data.id);
            
            // Clean up
            await deleteTestPost(jwtToken, response.data.id);
        } else {
            console.log(`❌ Failed to create post as ${status}`);
            console.log('📄 Response:', JSON.stringify(response.data, null, 2));
        }
        
    } catch (error) {
        console.error(`❌ Error creating post as ${status}:`, error.message);
    }
}

async function testCreateMinimalPost(jwtToken) {
    const testPost = {
        title: 'Minimal Test Post',
        status: 'draft'
    };
    
    try {
        const response = await makeRequest('https://info.digitaltrailheads.com/wp-json/wp/v2/posts', 'POST', {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        }, JSON.stringify(testPost));
        
        console.log('✅ Create Minimal Post Status:', response.statusCode);
        
        if (response.statusCode === 201) {
            console.log('🎉 Minimal post created successfully!');
            console.log('📄 Post ID:', response.data.id);
            
            // Clean up
            await deleteTestPost(jwtToken, response.data.id);
        } else {
            console.log('❌ Failed to create minimal post');
            console.log('📄 Response:', JSON.stringify(response.data, null, 2));
        }
        
    } catch (error) {
        console.error('❌ Error creating minimal post:', error.message);
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

testUserCapabilities(); 