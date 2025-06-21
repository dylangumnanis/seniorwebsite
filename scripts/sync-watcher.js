const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');

class ContentSyncWatcher {
  constructor() {
    this.contentDir = path.join(process.cwd(), 'content', 'posts');
    this.metaDir = path.join(this.contentDir, '.meta');
    this.debounceDelay = 2000; // 2 seconds
    this.debounceTimers = new Map();
    this.isWatching = false;
  }

  async ensureDirectories() {
    try {
      await fs.promises.mkdir(this.contentDir, { recursive: true });
      await fs.promises.mkdir(this.metaDir, { recursive: true });
    } catch (error) {
      console.error('Error creating directories:', error);
    }
  }

  async triggerSync(filePath) {
    try {
      console.log(`🔄 Content change detected: ${path.basename(filePath)}`);
      console.log('⏳ Triggering sync to WordPress...');
      
      // Call the sync API endpoint (try both common ports)
      let response;
      try {
        response = await fetch('http://localhost:3000/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ direction: 'local-to-wordpress' }),
        });
      } catch (err) {
        // Try port 3001 as fallback
        response = await fetch('http://localhost:3001/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ direction: 'local-to-wordpress' }),
        });
      }

      const result = await response.json();
      
      if (result.success) {
        const summary = result.summary.toWordPress;
        console.log(`✅ Sync completed:`);
        console.log(`   📝 Updated: ${summary.updated}`);
        console.log(`   📄 Created: ${summary.created}`);
        console.log(`   ⚠️  Conflicts: ${summary.conflicts}`);
        console.log(`   ⏭️  Skipped: ${summary.skipped}`);
        
        if (summary.conflicts > 0) {
          console.log('🚨 Conflicts detected! Please resolve them in the dashboard.');
        }
      } else {
        console.error('❌ Sync failed:', result.error);
      }
    } catch (error) {
      console.error('❌ Error triggering sync:', error.message);
    }
  }

  debouncedSync(filePath) {
    // Clear existing timer for this file
    if (this.debounceTimers.has(filePath)) {
      clearTimeout(this.debounceTimers.get(filePath));
    }

    // Set new timer
    const timer = setTimeout(() => {
      this.triggerSync(filePath);
      this.debounceTimers.delete(filePath);
    }, this.debounceDelay);

    this.debounceTimers.set(filePath, timer);
  }

  async start() {
    await this.ensureDirectories();

    if (this.isWatching) {
      console.log('⚠️  Watcher is already running');
      return;
    }

    console.log('👀 Starting content sync watcher...');
    console.log(`📁 Watching: ${this.contentDir}`);

    // Watch for markdown file changes
    this.watcher = chokidar.watch(path.join(this.contentDir, '*.md'), {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
      ignoreInitial: true, // Don't trigger on startup
    });

    // Watch for changes
    this.watcher
      .on('change', (filePath) => {
        console.log(`📝 File changed: ${path.basename(filePath)}`);
        this.debouncedSync(filePath);
      })
      .on('add', (filePath) => {
        console.log(`📄 File added: ${path.basename(filePath)}`);
        this.debouncedSync(filePath);
      })
      .on('unlink', (filePath) => {
        console.log(`🗑️  File deleted: ${path.basename(filePath)}`);
        // For deletions, we might want different handling
        console.log('ℹ️  File deletions are not automatically synced to WordPress');
      })
      .on('error', (error) => {
        console.error('❌ Watcher error:', error);
      })
      .on('ready', () => {
        this.isWatching = true;
        console.log('✅ Content sync watcher is ready');
        console.log('💡 Edit any markdown file in content/posts/ to trigger sync');
        console.log('🔧 Run with --help for more options');
      });
  }

  async stop() {
    if (this.watcher) {
      await this.watcher.close();
      this.isWatching = false;
      console.log('⏹️  Content sync watcher stopped');
    }

    // Clear any pending timers
    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer);
    }
    this.debounceTimers.clear();
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
📖 Content Sync Watcher

This script watches for changes to local markdown files and automatically
syncs them to WordPress when modified.

Usage:
  node scripts/sync-watcher.js [options]

Options:
  --help, -h     Show this help message
  --stop, -s     Stop the watcher (if running as daemon)
  
Features:
  🔄 Auto-sync local changes to WordPress
  ⏱️  Debounced sync (waits 2s after last change)
  🚨 Conflict detection and reporting
  📝 Real-time status updates

Directory Structure:
  content/posts/           # Markdown files
  content/posts/.meta/     # Metadata files

Examples:
  node scripts/sync-watcher.js              # Start watching
  node scripts/sync-watcher.js --stop       # Stop watching
    `);
    return;
  }

  const watcher = new ContentSyncWatcher();

  // Handle process termination
  process.on('SIGINT', async () => {
    console.log('\n🛑 Received SIGINT, stopping watcher...');
    await watcher.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n🛑 Received SIGTERM, stopping watcher...');
    await watcher.stop();
    process.exit(0);
  });

  try {
    await watcher.start();
    
    // Keep the process alive
    setInterval(() => {
      // Heartbeat every 30 seconds
    }, 30000);
    
  } catch (error) {
    console.error('❌ Failed to start content sync watcher:', error);
    process.exit(1);
  }
}

// Only run if called directly
if (require.main === module) {
  main();
}

module.exports = ContentSyncWatcher; 