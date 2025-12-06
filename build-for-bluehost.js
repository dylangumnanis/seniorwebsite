#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building Roots and Wings for Bluehost deployment...\n');

// Cross-platform copy function
function copyDirectory(src, dest) {
  if (fs.existsSync(src)) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src, { withFileTypes: true });
    files.forEach(file => {
      const srcPath = path.join(src, file.name);
      const destPath = path.join(dest, file.name);
      
      if (file.isDirectory()) {
        copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    });
  }
}

// Cross-platform remove function
function removeDirectory(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

// Cross-platform move function with fallback
function moveDirectory(src, dest) {
  if (fs.existsSync(src)) {
    try {
    fs.renameSync(src, dest);
    } catch (error) {
      // Fallback for Windows: copy then delete
      console.log(`  ℹ️  Using copy-then-delete fallback for ${src}`);
      copyDirectory(src, dest);
      removeDirectory(src);
    }
  }
}

// Enhanced function to update all files with _next references
function updateAllFiles(directory, oldPath, newPath) {
  const files = fs.readdirSync(directory, { withFileTypes: true });
  
  files.forEach(file => {
    const fullPath = path.join(directory, file.name);
    
    if (file.isDirectory()) {
      updateAllFiles(fullPath, oldPath, newPath);
    } else if (file.name.endsWith('.html') || file.name.endsWith('.js') || file.name.endsWith('.css')) {
      try {
      let content = fs.readFileSync(fullPath, 'utf8');
        const originalContent = content;
        
        // Replace all variations of _next paths
        content = content.replace(new RegExp('/_next/', 'g'), '/next-static/');
        content = content.replace(new RegExp('"_next/', 'g'), '"next-static/');
        content = content.replace(new RegExp("'_next/", 'g'), "'next-static/");
        content = content.replace(new RegExp('`_next/', 'g'), '`next-static/');
        
        // Only write if content actually changed
        if (content !== originalContent) {
      fs.writeFileSync(fullPath, content);
          console.log(`  ✓ Updated: ${fullPath}`);
        }
      } catch (error) {
        console.warn(`  ⚠️  Could not update ${fullPath}: ${error.message}`);
      }
    }
  });
}

try {
  // Step 1: Temporarily move API routes (skip if not exists)
  console.log('📁 Temporarily moving API routes...');
  if (fs.existsSync('app/api')) {
  moveDirectory('app/api', './api_temp');
    console.log('  ✓ API routes moved');
  } else {
    console.log('  ℹ️  No API routes found, skipping');
  }

  // Step 2: Build static version
  console.log('🏗️  Building static version...');
  execSync('npm run build:static', { stdio: 'inherit' });

  // Step 3: Rename _next to next-static to avoid Apache blocking
  console.log('📁 Renaming _next to next-static to avoid server blocking...');
  if (fs.existsSync('out/_next')) {
    moveDirectory('out/_next', 'out/next-static');
    
    // Update all files to reference next-static instead of _next
    console.log('🔄 Updating all file references...');
    updateAllFiles('out', '/_next/', '/next-static/');
    
    console.log('✅ Successfully renamed _next directory and updated all references');
  } else {
    console.log('⚠️  No _next directory found in out folder');
  }

  // Step 4: Copy .htaccess to out folder
  console.log('📄 Copying .htaccess to out folder...');
  if (fs.existsSync('.htaccess')) {
    fs.copyFileSync('.htaccess', 'out/.htaccess');
    console.log('  ✓ .htaccess copied');
  }

  // Step 5: Restore API routes
  console.log('📁 Restoring API routes...');
  if (fs.existsSync('./api_temp')) {
  moveDirectory('./api_temp', 'app/api');
    console.log('  ✓ API routes restored');
  }

  console.log('\n✅ Build completed successfully!');
  console.log('\n📦 Your static files are ready in the "out" folder');
  console.log('\n🔧 Important changes made:');
  console.log('   - _next folder renamed to next-static');
  console.log('   - All HTML, JS, and CSS files updated');
  console.log('   - .htaccess file included for proper asset serving');
  console.log('\n🔄 Next steps:');
  console.log('1. Upload all contents of the "out" folder to your Bluehost public_html directory');
  console.log('2. Make sure .htaccess is uploaded and has proper permissions');
  console.log('3. The blog should now work without 403/404 errors!');
  console.log('\n🎉 Your cofounder will be able to:');
  console.log('   - Edit posts in WordPress admin');
  console.log('   - View beautiful formatted posts at yourdomain.com/blog');
  console.log('   - See changes automatically (no manual sync needed)');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  
  // Restore API routes if something went wrong
  try {
    if (fs.existsSync('./api_temp')) {
    moveDirectory('./api_temp', 'app/api');
    console.log('📁 API routes restored after error');
    }
  } catch (restoreError) {
    console.error('⚠️  Could not restore API routes:', restoreError.message);
  }
  
  process.exit(1);
} 