const https = require('https');

// Test JWT with regular WordPress password
async function testJWTWithRegularPassword() {
    console.log('🔍 Testing JWT with regular WordPress password...\n');
    
    console.log('⚠️  Note: This will use your regular WordPress login password');
    console.log('🔐 If this works, it means Simple JWT Login expects regular passwords, not application passwords\n');
    
    // You'll need to provide your regular WordPress password here
    // For security, I'm not including it in the code
    console.log('❓ Please manually test with your regular WordPress password');
    console.log('📝 Use this URL format:');
    console.log('POST: https://info.digitaltrailheads.com/?rest_route=/simple-jwt-login/v1/auth');
    console.log('Body: username=phones2012&password=YOUR_REGULAR_PASSWORD&AUTH_KEY=blog-sync-auth-2025');
    
    // Alternative: Let's check what authentication methods are available
    console.log('\n🔍 Checking available authentication endpoints...');
    await checkAuthEndpoints();
    
    // Let's also check if there are any server restrictions
    console.log('\n🔍 Checking server capabilities...');
    await checkServerCapabilities();
}

async function checkAuthEndpoints() {
    try {
        // Check Simple JWT Login endpoints
        const response = await makeRequest('https://info.digitaltrailheads.com/?rest_route=/simple-jwt-login/v1', 'GET');
        console.log('✅ Simple JWT Login Status:', response.statusCode);
        console.log('📄 Available endpoints:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('❌ Error checking endpoints:', error.message);
    }
}

async function checkServerCapabilities() {
    try {
        // Check WordPress REST API root
        const response = await makeRequest('https://info.digitaltrailheads.com/wp-json/', 'GET');
        console.log('✅ WordPress REST API Status:', response.statusCode);
        
        if (response.data.authentication) {
            console.log('🔐 Available authentication methods:', response.data.authentication);
        }
        
        if (response.data.routes) {
            const jwtRoutes = Object.keys(response.data.routes).filter(route => 
                route.includes('jwt') || route.includes('auth')
            );
            console.log('🛣️  Available auth routes:', jwtRoutes);
        }
        
    } catch (error) {
        console.error('❌ Error checking server capabilities:', error.message);
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

testJWTWithRegularPassword(); 