const https = require('https');

// Test WordPress credentials with standard REST API
async function testWordPressCredentials() {
    console.log('🔍 Testing WordPress credentials with standard REST API...\n');
    
    // Test 1: Basic authentication with username/application password
    console.log('🧪 Test 1: Basic Auth with username/application password');
    const credentials = Buffer.from('phones2012:3lwg fWmm hCRw pjiM A6hS tISW').toString('base64');
    
    try {
        const response = await makeRequest('https://info.digitaltrailheads.com/wp-json/wp/v2/users/me', 'GET', {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json'
        });
        
        console.log('✅ Status:', response.statusCode);
        console.log('📄 Response:', JSON.stringify(response.data, null, 2));
        
        if (response.statusCode === 200) {
            console.log('🎉 WordPress credentials are VALID!');
            console.log('👤 User:', response.data.name, '(ID:', response.data.id + ')');
            
            // Test creating a post with these credentials
            console.log('\n🧪 Test 2: Creating a test post with valid credentials');
            await testCreatePostWithBasicAuth(credentials);
        } else {
            console.log('❌ WordPress credentials are INVALID');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

async function testCreatePostWithBasicAuth(credentials) {
    const testPost = {
        title: 'Credential Test Post - ' + new Date().toISOString(),
        content: 'This is a test post to verify credentials work.',
        status: 'draft'
    };
    
    try {
        const response = await makeRequest('https://info.digitaltrailheads.com/wp-json/wp/v2/posts', 'POST', {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json'
        }, JSON.stringify(testPost));
        
        console.log('✅ Create Post Status:', response.statusCode);
        
        if (response.statusCode === 201) {
            console.log('🎉 Post created successfully with basic auth!');
            console.log('📄 Post ID:', response.data.id);
            
            // Clean up
            await deleteTestPost(credentials, response.data.id);
        } else {
            console.log('❌ Failed to create post');
            console.log('📄 Response:', JSON.stringify(response.data, null, 2));
        }
        
    } catch (error) {
        console.error('❌ Error creating post:', error.message);
    }
}

async function deleteTestPost(credentials, postId) {
    try {
        const response = await makeRequest(`https://info.digitaltrailheads.com/wp-json/wp/v2/posts/${postId}?force=true`, 'DELETE', {
            'Authorization': `Basic ${credentials}`,
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

testWordPressCredentials(); 