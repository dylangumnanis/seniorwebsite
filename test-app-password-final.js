const https = require('https');

// Test application password authentication as comparison
async function testApplicationPassword() {
    console.log('🔐 Testing Application Password Authentication...\n');
    
    // Test with the latest application password
    const credentials = Buffer.from('phones2012:L8KI j5BY sssd fsfq hHwe yqEy').toString('base64');
    
    // Test 1: Get user info
    console.log('👤 Testing user info with application password...');
    await testUserInfo(credentials);
    
    // Test 2: Create a post
    console.log('\n📝 Testing post creation with application password...');
    await testCreatePost(credentials);
}

async function testUserInfo(credentials) {
    try {
        const response = await makeRequest('https://info.digitaltrailheads.com/wp-json/wp/v2/users/me', 'GET', {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json'
        });
        
        console.log('✅ User Info Status:', response.statusCode);
        
        if (response.statusCode === 200) {
            console.log('🎉 Application password works for user info!');
            console.log('👤 User:', response.data.name, '(ID:', response.data.id + ')');
            console.log('🔐 Roles:', response.data.roles);
            console.log('📧 Email:', response.data.email);
            
            // Check capabilities
            const caps = response.data.capabilities || {};
            console.log('✨ Key Capabilities:');
            console.log('   - publish_posts:', caps.publish_posts || false);
            console.log('   - edit_posts:', caps.edit_posts || false);
            console.log('   - delete_posts:', caps.delete_posts || false);
            console.log('   - manage_options:', caps.manage_options || false);
        } else {
            console.log('❌ Application password failed for user info');
            console.log('📄 Response:', response.data.message || JSON.stringify(response.data, null, 2));
        }
    } catch (error) {
        console.error('❌ Error testing user info:', error.message);
    }
}

async function testCreatePost(credentials) {
    const testPost = {
        title: 'App Password Test - ' + new Date().toISOString(),
        content: 'This is a test post created with application password.',
        status: 'draft'
    };
    
    try {
        const response = await makeRequest('https://info.digitaltrailheads.com/wp-json/wp/v2/posts', 'POST', {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json'
        }, JSON.stringify(testPost));
        
        console.log('✅ Create Post Status:', response.statusCode);
        
        if (response.statusCode === 201) {
            console.log('🎉 Post created successfully with application password!');
            console.log('📄 Post ID:', response.data.id);
            console.log('📝 Post Title:', response.data.title.rendered);
            
            // Clean up
            console.log('\n🧹 Cleaning up test post...');
            await deleteTestPost(credentials, response.data.id);
            
            console.log('\n✅ Application password authentication is FULLY WORKING!');
        } else {
            console.log('❌ Failed to create post with application password');
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

testApplicationPassword(); 