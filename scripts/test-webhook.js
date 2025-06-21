// Test script to validate GitHub repository dispatch webhook
// Using built-in fetch (Node 18+) or https module for compatibility
const https = require('https');

async function testGitHubWebhook() {
  console.log('🔧 Testing GitHub Repository Dispatch Webhook...\n');

  // Replace these with your actual values
  const GITHUB_TOKEN = 'YOUR_GITHUB_TOKEN_HERE'; // Your Personal Access Token - REPLACE THIS
  const REPO_OWNER = 'dylangumnanis';
  const REPO_NAME = 'seniorwebsite';

  const payload = {
    event_type: 'wordpress-update',
    client_payload: {
      source: 'wordpress',
      timestamp: new Date().toISOString(),
      message: 'Test webhook from script'
    }
  };

  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/dispatches`;

  try {
    console.log('📤 Sending test webhook to:', url);
    console.log('📦 Payload:', JSON.stringify(payload, null, 2));
    
    // Use Node.js built-in https module for better compatibility
    const postData = JSON.stringify(payload);
    const urlParts = new URL(url);
    
    const options = {
      hostname: urlParts.hostname,
      port: 443,
      path: urlParts.pathname,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'WordPress-Webhook-Test',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const response = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data
          });
        });
      });

      req.on('error', reject);
      req.write(postData);
      req.end();
    });

    console.log('📥 Response Status:', response.status);
    console.log('📥 Response Headers:', JSON.stringify(response.headers, null, 2));

    if (response.status === 204) {
      console.log('✅ SUCCESS! Repository dispatch triggered successfully');
      console.log('🚀 Check your GitHub Actions tab for the workflow run');
      console.log('   URL: https://github.com/dylangumnanis/seniorwebsite/actions');
    } else {
      console.log('❌ FAILED! Response body:', response.body);
      
      // Common error diagnosis
      if (response.status === 401) {
        console.log('🔑 DIAGNOSIS: Authentication failed');
        console.log('   - Check your GitHub token has "repo" permissions');
        console.log('   - Verify the token is not expired');
        console.log('   - Make sure token is valid and not revoked');
      } else if (response.status === 404) {
        console.log('🔍 DIAGNOSIS: Repository not found');
        console.log('   - Check repository owner/name are correct');
        console.log('   - Verify token has access to this repository');
      } else if (response.status === 422) {
        console.log('📋 DIAGNOSIS: Invalid payload format');
        console.log('   - Check the event_type matches your workflow');
      }
    }

  } catch (error) {
    console.log('💥 ERROR:', error.message);
  }
}

// Run the test
testGitHubWebhook();

console.log('\n📚 USAGE INSTRUCTIONS:');
console.log('1. Replace GITHUB_TOKEN with your actual token');
console.log('2. Run: node scripts/test-webhook.js');
console.log('3. Check GitHub Actions tab for triggered workflow');
console.log('\n🔧 WORDPRESS WEBHOOK CONFIGURATION:');
console.log('URL: https://api.github.com/repos/dylangumnanis/seniorwebsite/dispatches');
console.log('Method: POST');
console.log('Headers:');
console.log('  Authorization: Bearer YOUR_GITHUB_TOKEN');
console.log('  Accept: application/vnd.github.v3+json');
console.log('  Content-Type: application/json');
console.log('Body:');
console.log('  {"event_type":"wordpress-update","client_payload":{"source":"wordpress"}}'); 