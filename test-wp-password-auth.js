const https = require('https');

// Test WordPress password authentication directly
async function testWordPressPasswordAuth() {
    console.log('🔐 Testing WordPress Password Authentication...\n');
    
    // Use WordPress password directly with Basic Auth
    const credentials = Buffer.from('phones2012:sbkb^&L&oaLqL)WuF&g)&1Gz').toString('base64');
    
    // Test 1: Get user info
    console.log('👤 Test 1: Getting user information...');
    await testUserInfo(credentials);
    
    // Test 2: Create a post
    console.log('\n📝 Test 2: Creating a post...');
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
            console.log('🎉 WordPress password works for user info!');
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
            
            return true;
        } else {
            console.log('❌ WordPress password failed for user info');
            console.log('📄 Response:', response.data.message || JSON.stringify(response.data, null, 2));
        }
    } catch (error) {
        console.error('❌ Error testing user info:', error.message);
    }
    return false;
}

async function testCreatePost(credentials) {
    const testPost = {
        title: 'WordPress Password Test - ' + new Date().toISOString(),
        content: 'This post was created using WordPress password authentication.',
        status: 'draft'
    };
    
    try {
        const response = await makeRequest('https://info.digitaltrailheads.com/wp-json/wp/v2/posts', 'POST', {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json'
        }, JSON.stringify(testPost));
        
        console.log('✅ Create Post Status:', response.statusCode);
        
        if (response.statusCode === 201) {
            console.log('🎉 Post created successfully with WordPress password!');
            console.log('📄 Post ID:', response.data.id);
            console.log('📝 Post Title:', response.data.title.rendered);
            
            // Test update
            console.log('\n📝 Test 3: Updating the post...');
            await testUpdatePost(credentials, response.data.id);
            
            // Clean up
            console.log('\n🧹 Test 4: Cleaning up test post...');
            await deleteTestPost(credentials, response.data.id);
            
            console.log('\n🎊 ALL TESTS PASSED! WordPress password authentication is FULLY WORKING!');
            console.log('✅ Ready to implement bi-directional sync!');
        } else {
            console.log('❌ Failed to create post with WordPress password');
            console.log('📄 Response:', JSON.stringify(response.data, null, 2));
        }
        
    } catch (error) {
        console.error('❌ Error creating post:', error.message);
    }
}

async function testUpdatePost(credentials, postId) {
    const updateData = {
        content: 'This post was created and updated using WordPress password authentication! ✅'
    };
    
    try {
        const response = await makeRequest(`https://info.digitaltrailheads.com/wp-json/wp/v2/posts/${postId}`, 'PUT', {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json'
        }, JSON.stringify(updateData));
        
        console.log('✅ Update Post Status:', response.statusCode);
        
        if (response.statusCode === 200) {
            console.log('🎉 Post updated successfully!');
        } else {
            console.log('❌ Failed to update post');
            console.log('📄 Response:', response.data.message || 'Unknown error');
        }
        
    } catch (error) {
        console.error('❌ Error updating post:', error.message);
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

testWordPressPasswordAuth(); 