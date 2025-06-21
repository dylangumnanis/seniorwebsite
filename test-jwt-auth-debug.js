const https = require('https');
const querystring = require('querystring');

// Debug JWT Authentication with different methods
async function debugJWTAuth() {
    console.log('🔍 Debugging JWT Authentication...\n');
    
    // Test 1: URL parameters method
    console.log('🧪 Test 1: URL Parameters Method');
    await testURLParams();
    
    // Test 2: POST body method
    console.log('\n🧪 Test 2: POST Body Method');
    await testPOSTBody();
    
    // Test 3: Different password format
    console.log('\n🧪 Test 3: URL Encoded Password');
    await testURLEncodedPassword();
}

async function testURLParams() {
    const authParams = {
        username: 'phones2012',
        password: 'XRTvsI1&U@jjeuSTU$gxThL',
        AUTH_KEY: 'blog-sync-auth-2025'
    };
    
    const authUrl = `https://info.digitaltrailheads.com/?rest_route=/simple-jwt-login/v1/auth&${querystring.stringify(authParams)}`;
    
    console.log('📡 URL:', authUrl.replace(authParams.password, '[HIDDEN]'));
    
    try {
        const response = await makeRequest(authUrl, 'POST');
        console.log('✅ Status:', response.statusCode);
        console.log('📄 Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

async function testPOSTBody() {
    const authUrl = 'https://info.digitaltrailheads.com/?rest_route=/simple-jwt-login/v1/auth';
    const postData = querystring.stringify({
        username: 'phones2012',
        password: 'XRTvsI1&U@jjeuSTU$gxThL',
        AUTH_KEY: 'blog-sync-auth-2025'
    });
    
    console.log('📡 URL:', authUrl);
    console.log('📦 POST Data:', postData.replace('XRTvsI1&U@jjeuSTU$gxThL', '[HIDDEN]'));
    
    try {
        const response = await makeRequest(authUrl, 'POST', {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
        }, postData);
        
        console.log('✅ Status:', response.statusCode);
        console.log('📄 Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

async function testURLEncodedPassword() {
    // Try with URL encoded password
    const password = encodeURIComponent('XRTvsI1&U@jjeuSTU$gxThL');
    const authParams = {
        username: 'phones2012',
        password: password,
        AUTH_KEY: 'blog-sync-auth-2025'
    };
    
    const authUrl = `https://info.digitaltrailheads.com/?rest_route=/simple-jwt-login/v1/auth&${querystring.stringify(authParams)}`;
    
    console.log('📡 URL with encoded password:', authUrl.replace(password, '[HIDDEN]'));
    
    try {
        const response = await makeRequest(authUrl, 'POST');
        console.log('✅ Status:', response.statusCode);
        console.log('📄 Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('❌ Error:', error.message);
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

// Run the debug tests
debugJWTAuth(); 