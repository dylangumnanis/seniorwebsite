#!/usr/bin/env node

// Debug script to test dashboard API endpoints
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testEndpoint(url, method = 'GET', body = null) {
  console.log(`\n🧪 Testing ${method} ${url}`);
  
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(url, options);
    const data = await response.text();
    
    console.log(`📡 Status: ${response.status} ${response.statusText}`);
    console.log(`📦 Response: ${data.substring(0, 200)}${data.length > 200 ? '...' : ''}`);
    
    if (response.ok) {
      try {
        const json = JSON.parse(data);
        console.log(`✅ Success: ${json.success ? 'true' : 'false'}`);
        if (json.message) console.log(`💬 Message: ${json.message}`);
        if (json.error) console.log(`❌ Error: ${json.error}`);
      } catch (e) {
        console.log('⚠️ Response is not valid JSON');
      }
    } else {
      console.log('❌ Request failed');
    }
  } catch (error) {
    console.log(`💥 Network error: ${error.message}`);
  }
}

async function runDiagnostics() {
  console.log('🚀 Starting Dashboard API Diagnostics...');
  console.log('==================================================');
  
  // Test all the endpoints that the dashboard uses
  await testEndpoint(`${BASE_URL}/api/test`);
  await testEndpoint(`${BASE_URL}/api/sync`);
  await testEndpoint(`${BASE_URL}/api/blog/hello-world`);
  
  // Test sync operations
  await testEndpoint(`${BASE_URL}/api/sync`, 'POST', { action: 'test_auth' });
  await testEndpoint(`${BASE_URL}/api/sync`, 'POST', { action: 'sync_from_wordpress' });
  
  console.log('\n🏁 Diagnostics complete!');
  console.log('If any tests failed, check:');
  console.log('1. Development server is running (npm run dev)');
  console.log('2. WordPress API is accessible');
  console.log('3. Environment variables are set correctly');
}

runDiagnostics().catch(console.error); 