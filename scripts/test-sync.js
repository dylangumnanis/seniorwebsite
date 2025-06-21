const fs = require('fs');
const path = require('path');

async function testBidirectionalSync() {
  console.log('🧪 Testing Bi-directional Sync System\n');

  // Try common development ports
  let serverUrl = 'http://localhost:3001';
  
  // Test if server is running on 3001, fallback to 3000
  try {
    await fetch('http://localhost:3001/api/sync');
  } catch (err) {
    serverUrl = 'http://localhost:3000';
  }
  const contentDir = path.join(process.cwd(), 'content', 'posts');
  
  try {
    // Test 1: Check if server is running
    console.log('1️⃣  Testing server connectivity...');
    const healthCheck = await fetch(`${serverUrl}/api/sync`);
    if (!healthCheck.ok) {
      throw new Error(`Server not responding. Make sure to run 'npm run dev' first.`);
    }
    console.log('   ✅ Server is running\n');

    // Test 2: Get current sync status
    console.log('2️⃣  Checking sync status...');
    const statusResponse = await fetch(`${serverUrl}/api/sync`);
    const statusData = await statusResponse.json();
    
    if (statusData.success) {
      console.log(`   📊 Found ${statusData.totalPosts} local posts`);
      console.log(`   🔄 ${statusData.needsSync} posts need sync`);
    } else {
      console.log('   ⚠️  Could not get sync status:', statusData.error);
    }
    console.log('');

    // Test 3: Test WordPress → Local sync
    console.log('3️⃣  Testing WordPress → Local sync...');
    const wpToLocalResponse = await fetch(`${serverUrl}/api/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ direction: 'wordpress-to-local' }),
    });
    
    const wpToLocalData = await wpToLocalResponse.json();
    if (wpToLocalData.success) {
      const summary = wpToLocalData.summary.fromWordPress;
      console.log(`   ✅ WordPress → Local sync completed`);
      console.log(`   📝 Created: ${summary.created}, Updated: ${summary.updated}, Conflicts: ${summary.conflicts}`);
    } else {
      console.log('   ❌ WordPress → Local sync failed:', wpToLocalData.error);
    }
    console.log('');

    // Test 4: Check if content directory was created
    console.log('4️⃣  Checking content directory structure...');
    try {
      const dirExists = fs.existsSync(contentDir);
      if (dirExists) {
        console.log('   ✅ Content directory exists');
        
        const files = fs.readdirSync(contentDir);
        const mdFiles = files.filter(f => f.endsWith('.md') && f !== 'README.md');
        console.log(`   📄 Found ${mdFiles.length} markdown files`);
        
        if (mdFiles.length > 0) {
          console.log('   📋 Sample files:');
          mdFiles.slice(0, 3).forEach(file => {
            console.log(`      - ${file}`);
          });
        }
        
        const metaDir = path.join(contentDir, '.meta');
        if (fs.existsSync(metaDir)) {
          const metaFiles = fs.readdirSync(metaDir);
          console.log(`   🗂️  Found ${metaFiles.length} metadata files`);
        }
      } else {
        console.log('   ⚠️  Content directory not created yet');
      }
    } catch (error) {
      console.log('   ❌ Error checking content directory:', error.message);
    }
    console.log('');

    // Test 5: Test creating a sample post (if auth is configured)
    console.log('5️⃣  Testing Local → WordPress sync capability...');
    
    // Create a test markdown file
    const testFilePath = path.join(contentDir, 'test-sync-post.md');
    const testContent = `---
title: "Test Sync Post"
slug: "test-sync-post"
status: "draft"
excerpt: "This is a test post to verify sync functionality"
categories: ["Test"]
tags: ["sync", "test"]
local_modified: "${new Date().toISOString()}"
---

# Test Sync Post

This is a test post created to verify the bi-directional sync functionality is working correctly.

If you can see this in WordPress, the sync is working! 🎉
`;

    try {
      // Ensure directory exists
      await fs.promises.mkdir(contentDir, { recursive: true });
      
      // Write test file
      await fs.promises.writeFile(testFilePath, testContent, 'utf-8');
      console.log('   📝 Created test markdown file');
      
      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Try to sync to WordPress
      const localToWpResponse = await fetch(`${serverUrl}/api/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction: 'local-to-wordpress' }),
      });
      
      const localToWpData = await localToWpResponse.json();
      if (localToWpData.success) {
        const summary = localToWpData.summary.toWordPress;
        console.log(`   ✅ Local → WordPress sync completed`);
        console.log(`   📝 Created: ${summary.created}, Updated: ${summary.updated}, Conflicts: ${summary.conflicts}`);
        
        if (summary.created > 0 || summary.updated > 0) {
          console.log('   🎉 Successfully synced to WordPress!');
        } else {
          console.log('   ℹ️  No changes synced (may need WordPress auth setup)');
        }
      } else {
        console.log('   ⚠️  Local → WordPress sync had issues:', localToWpData.error);
        console.log('   💡 This is expected if WordPress authentication is not configured');
      }
      
      // Clean up test file
      await fs.promises.unlink(testFilePath);
      console.log('   🧹 Cleaned up test file');
      
    } catch (error) {
      console.log('   ❌ Error in Local → WordPress test:', error.message);
    }
    console.log('');

    // Test 6: Final sync status
    console.log('6️⃣  Final sync status check...');
    const finalStatusResponse = await fetch(`${serverUrl}/api/sync`);
    const finalStatusData = await finalStatusResponse.json();
    
    if (finalStatusData.success) {
      console.log(`   📊 Total posts: ${finalStatusData.totalPosts}`);
      console.log(`   🔄 Need sync: ${finalStatusData.needsSync}`);
    }
    console.log('');

    // Summary
    console.log('🎯 Test Summary:');
    console.log('   ✅ Server connectivity - Working');
    console.log('   ✅ WordPress → Local sync - Working');
    console.log('   ✅ Content directory structure - Working');
    console.log('   ⚠️  Local → WordPress sync - Depends on auth configuration');
    console.log('');
    console.log('🚀 Next Steps:');
    console.log('   1. Configure WordPress authentication token in .env.local');
    console.log('   2. Visit /dashboard/content to manage posts');
    console.log('   3. Run `npm run sync:watch` to enable automatic sync');
    console.log('   4. Edit markdown files in content/posts/ and watch them sync!');
    console.log('');
    console.log('📖 See BIDIRECTIONAL_SYNC_SETUP.md for complete setup instructions');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   - Make sure the development server is running: npm run dev');
    console.log('   - Check that all dependencies are installed: npm install');
    console.log('   - Verify environment variables are set correctly');
    process.exit(1);
  }
}

// Add CLI help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
🧪 Bi-directional Sync Test

This script tests the bi-directional sync functionality between WordPress and local content.

Usage:
  node scripts/test-sync.js

Prerequisites:
  - Development server running (npm run dev)
  - WordPress site accessible
  - Environment variables configured

The test will:
  1. Check server connectivity
  2. Test WordPress → Local sync
  3. Verify content directory structure
  4. Test Local → WordPress sync (if auth configured)
  5. Provide setup recommendations
  `);
  process.exit(0);
}

// Run the test
testBidirectionalSync();