const https = require('https');

// Test JWT token validation with Simple JWT Login
async function testJWTValidation() {
    console.log('🔐 Testing JWT token validation with Simple JWT Login...\n');
    
    // Get JWT token
    const jwtToken = await getJWTToken();
    
    if (!jwtToken) {
        console.log('❌ Failed to get JWT token');
        return;
    }
    
    console.log('✅ JWT token obtained successfully\n');
    
    // Test token validation
    await testTokenValidation(jwtToken);
    
    // Test if we can use the token for WordPress API calls
    await testWordPressAPIWithDifferentMethods(jwtToken);
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

async function testTokenValidation(jwtToken) {
    console.log('🧪 Testing JWT token validation...');
    
    try {
        // Test with Simple JWT Login validation endpoint
        const response = await makeRequest('https://info.digitaltrailheads.com/wp-json/simple-jwt-login/v1/auth/validate', 'POST', {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        });
        
        console.log('✅ Token Validation Status:', response.statusCode);
        console.log('📄 Validation Response:', JSON.stringify(response.data, null, 2));
        
        if (response.statusCode === 200) {
            console.log('🎉 JWT token is valid according to Simple JWT Login!');
        }
        
    } catch (error) {
        console.error('❌ Error validating token:', error.message);
    }
}

async function testWordPressAPIWithDifferentMethods(jwtToken) {
    console.log('\n🧪 Testing WordPress API with different authentication methods...');
    
    // Method 1: Bearer token in Authorization header
    console.log('\n📝 Method 1: Bearer token in Authorization header');
    await testAPICall(jwtToken, 'bearer');
    
    // Method 2: JWT token as query parameter
    console.log('\n📝 Method 2: JWT token as query parameter');
    await testAPICall(jwtToken, 'query');
    
    // Method 3: Custom header
    console.log('\n📝 Method 3: JWT token in custom header');
    await testAPICall(jwtToken, 'custom');
    
    // Method 4: Try with Application Password for comparison
    console.log('\n📝 Method 4: Application Password for comparison');
    await testAPICall('L8KI j5BY sssd fsfq hHwe yqEy', 'app_password');
}

async function testAPICall(token, method) {
    let url = 'https://info.digitaltrailheads.com/wp-json/wp/v2/users/me';
    let headers = { 'Content-Type': 'application/json' };
    
    switch (method) {
        case 'bearer':
            headers['Authorization'] = `Bearer ${token}`;
            break;
        case 'query':
            url += `?jwt=${encodeURIComponent(token)}`;
            break;
        case 'custom':
            headers['X-JWT-Token'] = token;
            break;
        case 'app_password':
            const credentials = Buffer.from(`phones2012:${token}`).toString('base64');
            headers['Authorization'] = `Basic ${credentials}`;
            break;
    }
    
    try {
        const response = await makeRequest(url, 'GET', headers);
        
        console.log(`   ✅ ${method} Status:`, response.statusCode);
        
        if (response.statusCode === 200) {
            console.log(`   🎉 ${method} method works!`);
            console.log(`   👤 User: ${response.data.name} (ID: ${response.data.id})`);
        } else {
            console.log(`   ❌ ${method} method failed:`, response.data.message || 'Unknown error');
        }
        
    } catch (error) {
        console.error(`   ❌ ${method} error:`, error.message);
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

testJWTValidation(); 