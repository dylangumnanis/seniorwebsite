const https = require('https');

// Debug WordPress authentication issues
async function debugWordPressAuth() {
    console.log('🔍 Testing NEW Application Password...\n');
    
    // Test the new application password
    console.log('🧪 Testing new application password: L8KI j5BY sssd fsfq hHwe yqEy');
    const success = await testAppPassword('L8KI j5BY sssd fsfq hHwe yqEy');
    
    if (success) {
        console.log('\n🎉 SUCCESS! Now testing JWT authentication with working credentials...');
        await testJWTWithWorkingCredentials();
    }
}

async function testAppPassword(password) {
    const credentials = Buffer.from(`phones2012:${password}`).toString('base64');
    
    try {
        const response = await makeRequest('https://info.digitaltrailheads.com/wp-json/wp/v2/users/me', 'GET', {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json'
        });
        
        console.log('✅ Status:', response.statusCode);
        console.log('🔑 Password format:', password.includes(' ') ? 'with spaces' : 'without spaces');
        
        if (response.statusCode === 200) {
            console.log('🎉 SUCCESS! Application password works!');
            console.log('👤 User:', response.data.name, '(ID:', response.data.id + ')');
            console.log('📧 Email:', response.data.email);
            console.log('🔐 Roles:', response.data.roles);
            return true;
        } else {
            console.log('❌ Failed');
            console.log('📄 Response:', response.data.message || JSON.stringify(response.data, null, 2));
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
    return false;
}

async function testJWTWithWorkingCredentials() {
    console.log('\n🔐 Testing JWT Authentication with working credentials...');
    
    const authUrl = 'https://info.digitaltrailheads.com/?rest_route=/simple-jwt-login/v1/auth';
    const postData = new URLSearchParams({
        username: 'phones2012',
        password: 'L8KI j5BY sssd fsfq hHwe yqEy',
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
            console.log('🔑 JWT Token received:', response.data.data.jwt.substring(0, 50) + '...');
            
            // Test the JWT token with WordPress API
            await testJWTToken(response.data.data.jwt);
        } else {
            console.log('❌ JWT Authentication failed');
        }
        
    } catch (error) {
        console.error('❌ JWT Error:', error.message);
    }
}

async function testJWTToken(jwtToken) {
    console.log('\n🧪 Testing JWT token with WordPress API...');
    
    try {
        const response = await makeRequest('https://info.digitaltrailheads.com/wp-json/wp/v2/posts?per_page=1', 'GET', {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        });
        
        console.log('✅ WordPress API Status:', response.statusCode);
        
        if (response.statusCode === 200) {
            console.log('🎉 JWT token works with WordPress API!');
            console.log('📊 Retrieved', response.data.length, 'posts');
            
            // Test creating a post
            await testCreatePostWithJWT(jwtToken);
        } else {
            console.log('❌ JWT token failed with WordPress API');
            console.log('📄 Response:', JSON.stringify(response.data, null, 2));
        }
        
    } catch (error) {
        console.error('❌ Error testing JWT token:', error.message);
    }
}

async function testCreatePostWithJWT(jwtToken) {
    console.log('\n📝 Testing post creation with JWT...');
    
    const testPost = {
        title: 'JWT Test Post - ' + new Date().toISOString(),
        content: 'This is a test post created via JWT authentication.',
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
            
            // Clean up
            console.log('\n🧹 Cleaning up test post...');
            await deleteTestPost(jwtToken, response.data.id);
            
            console.log('\n🎊 ALL TESTS PASSED! JWT authentication is working perfectly!');
        } else {
            console.log('❌ Failed to create post with JWT');
            console.log('📄 Response:', JSON.stringify(response.data, null, 2));
        }
        
    } catch (error) {
        console.error('❌ Error creating post with JWT:', error.message);
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

debugWordPressAuth(); 