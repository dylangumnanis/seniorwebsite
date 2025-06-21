const fetch = require('node-fetch');

async function testWordPressAPIs() {
  console.log('🧪 Testing WordPress API endpoints...\n');

  // Test 1: Custom API with API key
  console.log('1️⃣ Testing Custom API:');
  try {
    const customResponse = await fetch('https://info.digitaltrailheads.com/wp-json/dt-sync/v1/posts', {
      headers: {
        'X-API-Key': 'dt-sync-ca08675eb5ec2c49f2cd06e139be7bd0',
        'Accept': 'application/json'
      }
    });
    
    console.log(`   Status: ${customResponse.status}`);
    console.log(`   Content-Type: ${customResponse.headers.get('content-type')}`);
    
    const customText = await customResponse.text();
    console.log(`   Response preview: ${customText.substring(0, 100)}...`);
    
    if (customText.startsWith('<!DOCTYPE')) {
      console.log('   ❌ Custom API returning HTML - plugin likely not active\n');
    } else {
      console.log('   ✅ Custom API working\n');
    }
  } catch (error) {
    console.log(`   ❌ Custom API error: ${error.message}\n`);
  }

  // Test 2: Standard WordPress API
  console.log('2️⃣ Testing Standard WordPress API:');
  try {
    const standardResponse = await fetch('https://info.digitaltrailheads.com/wp-json/wp/v2/posts?per_page=3');
    
    console.log(`   Status: ${standardResponse.status}`);
    console.log(`   Content-Type: ${standardResponse.headers.get('content-type')}`);
    
    const standardData = await standardResponse.json();
    
    if (Array.isArray(standardData)) {
      console.log(`   ✅ Standard API working - found ${standardData.length} posts`);
      if (standardData.length > 0) {
        console.log(`   📝 Sample post: "${standardData[0].title.rendered}"`);
      }
    } else {
      console.log('   ❌ Standard API not returning expected format');
    }
  } catch (error) {
    console.log(`   ❌ Standard API error: ${error.message}`);
  }

  console.log('\n🔍 Recommendations:');
  console.log('   - If Custom API fails: Check if your custom plugin is active in WordPress');
  console.log('   - If Standard API works: Your blog will still function with fallback');
  console.log('   - Visit: https://info.digitaltrailheads.com/wp-admin/plugins.php');
}

testWordPressAPIs(); 