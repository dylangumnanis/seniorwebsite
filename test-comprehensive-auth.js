const https = require('https');

// Comprehensive authentication diagnostics
async function runComprehensiveAuthDiagnostics() {
    console.log('🔍 Running Comprehensive Authentication Diagnostics...\n');
    
    // Test 1: Check WordPress REST API capabilities
    console.log('🧪 Test 1: WordPress REST API Capabilities');
    await checkWordPressRESTAPI();
    
    // Test 2: Check authentication methods supported
    console.log('\n🧪 Test 2: Authentication Methods');
    await checkAuthenticationMethods();
    
    // Test 3: Test Basic Auth header support
    console.log('\n🧪 Test 3: Basic Auth Header Support');
    await testBasicAuthSupport();
    
    // Test 4: Check if it's a server configuration issue
    console.log('\n🧪 Test 4: Server Configuration Check');
    await checkServerConfiguration();
    
    // Test 5: Alternative authentication approaches
    console.log('\n🧪 Test 5: Alternative Authentication');
    await testAlternativeAuth();
}

async function checkWordPressRESTAPI() {
    try {
        const response = await makeRequest('https://info.digitaltrailheads.com/wp-json/', 'GET');
        
        console.log('✅ WordPress REST API Status:', response.statusCode);
        
        if (response.statusCode === 200) {
            console.log('📊 WordPress Version:', response.data.gmt_offset);
            console.log('🔐 Authentication:', JSON.stringify(response.data.authentication, null, 2));
            console.log('🛣️  Available namespaces:', response.data.namespaces?.slice(0, 5) || 'Not available');
            
            // Check if application passwords are supported
            if (response.data.authentication?.['application-passwords']) {
                console.log('✅ Application Passwords are supported');
                console.log('🔗 Authorization URL:', response.data.authentication['application-passwords'].endpoints?.authorization);
            } else {
                console.log('❌ Application Passwords might not be supported');
            }
        }
    } catch (error) {
        console.error('❌ Error checking WordPress REST API:', error.message);
    }
}

async function checkAuthenticationMethods() {
    // Test different authentication headers
    const tests = [
        {
            name: 'Application Password (current)',
            headers: {
                'Authorization': 'Basic ' + Buffer.from('phones2012:L8KI j5BY sssd fsfq hHwe yqEy').toString('base64')
            }
        },
        {
            name: 'Application Password (no spaces)',
            headers: {
                'Authorization': 'Basic ' + Buffer.from('phones2012:L8KIj5BYsssdfsfqhHweyqEy').toString('base64')
            }
        },
        {
            name: 'Test with different user agent',
            headers: {
                'Authorization': 'Basic ' + Buffer.from('phones2012:L8KI j5BY sssd fsfq hHwe yqEy').toString('base64'),
                'User-Agent': 'WordPress/6.0; https://info.digitaltrailheads.com'
            }
        }
    ];
    
    for (const test of tests) {
        console.log(`\n   Testing: ${test.name}`);
        try {
            const response = await makeRequest('https://info.digitaltrailheads.com/wp-json/wp/v2/users/me', 'GET', test.headers);
            console.log(`   ✅ Status: ${response.statusCode}`);
            
            if (response.statusCode === 200) {
                console.log(`   🎉 SUCCESS with ${test.name}!`);
                console.log(`   👤 User: ${response.data.name}`);
                return; // Stop testing if we find a working method
            } else {
                console.log(`   ❌ Failed: ${response.data.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
        }
    }
}

async function testBasicAuthSupport() {
    try {
        // Test if the server supports Authorization header at all
        const response = await makeRequest('https://info.digitaltrailheads.com/wp-json/wp/v2/users/me', 'GET', {
            'Authorization': 'Basic dGVzdDp0ZXN0' // test:test in base64
        });
        
        console.log('✅ Basic Auth Test Status:', response.statusCode);
        
        if (response.statusCode === 401) {
            console.log('✅ Server recognizes Authorization header (expected 401 for invalid credentials)');
        } else if (response.statusCode === 403) {
            console.log('⚠️  Server might be blocking Authorization header');
        } else {
            console.log('📄 Response:', response.data.message || 'Unexpected response');
        }
        
    } catch (error) {
        console.error('❌ Error testing Basic Auth support:', error.message);
    }
}

async function checkServerConfiguration() {
    try {
        // Check for common server issues
        const response = await makeRequest('https://info.digitaltrailheads.com/wp-json/wp/v2/posts?per_page=1', 'GET');
        
        console.log('✅ Public API Status:', response.statusCode);
        
        if (response.statusCode === 200) {
            console.log('✅ WordPress REST API is working for public endpoints');
            console.log('📊 Retrieved posts:', response.data.length);
        }
        
        // Check server headers for clues
        console.log('\nChecking for server-specific issues...');
        
        // Test with different HTTP methods
        const methods = ['GET', 'POST', 'PUT', 'DELETE'];
        for (const method of methods) {
            try {
                const testResponse = await makeRequest('https://info.digitaltrailheads.com/wp-json/wp/v2/posts', method, {
                    'Authorization': 'Basic ' + Buffer.from('phones2012:L8KI j5BY sssd fsfq hHwe yqEy').toString('base64')
                });
                console.log(`   ${method}: ${testResponse.statusCode}`);
            } catch (error) {
                console.log(`   ${method}: Error - ${error.message}`);
            }
        }
        
    } catch (error) {
        console.error('❌ Error checking server configuration:', error.message);
    }
}

async function testAlternativeAuth() {
    console.log('Testing alternative authentication methods...');
    
    // Test 1: Try creating a new application password programmatically
    console.log('\n   📝 Test: Check current application passwords');
    try {
        const response = await makeRequest('https://info.digitaltrailheads.com/wp-json/wp/v2/users/me/application-passwords', 'GET', {
            'Authorization': 'Basic ' + Buffer.from('phones2012:L8KI j5BY sssd fsfq hHwe yqEy').toString('base64')
        });
        
        console.log('   ✅ App Passwords Endpoint Status:', response.statusCode);
        if (response.statusCode === 200) {
            console.log('   🎉 Application passwords endpoint is accessible!');
            console.log('   📊 Current app passwords:', response.data.length);
        } else {
            console.log('   📄 Response:', response.data.message || 'Unknown error');
        }
    } catch (error) {
        console.log('   ❌ Error:', error.message);
    }
    
    // Test 2: Check if there are any WordPress plugins interfering
    console.log('\n   🔌 Test: Check for plugin interference');
    try {
        const response = await makeRequest('https://info.digitaltrailheads.com/wp-json/wp/v2/plugins', 'GET');
        console.log('   ✅ Plugins Endpoint Status:', response.statusCode);
        
        if (response.statusCode === 401) {
            console.log('   ✅ Plugins endpoint requires authentication (normal)');
        }
    } catch (error) {
        console.log('   ❌ Error:', error.message);
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
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Blog-Sync-Tool/1.0',
                ...headers
            }
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
                        headers: res.headers,
                        data: parsedData
                    });
                } catch (e) {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
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

runComprehensiveAuthDiagnostics(); 