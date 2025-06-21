# Bi-Directional WordPress-Cursor Sync Setup

This guide explains how to set up and use the bi-directional sync system between your WordPress site and Cursor workspace.

## Overview

The system enables:
- ✅ **WordPress → Cursor**: Automatic sync when posts are published/updated in WordPress
- ✅ **Cursor → WordPress**: Sync local markdown edits back to WordPress  
- ✅ **Conflict Resolution**: Detect and handle simultaneous edits
- ✅ **Real-time Monitoring**: File watcher for automatic sync on local changes

## Architecture

```
WordPress (info.digitaltrailheads.com)
    ↕️ (bi-directional sync)
Local Content (content/posts/*.md)
    ↕️ (file watching)
Cursor Workspace
```

## Setup Instructions

### 1. Environment Variables

Add these to your `.env.local` file:

```bash
# WordPress Configuration
NEXT_PUBLIC_WORDPRESS_API_URL=https://info.digitaltrailheads.com/wp-json/wp/v2
WORDPRESS_AUTH_TOKEN=your-wordpress-auth-token-here

# GitHub Configuration (existing)
PERSONAL_ACCESS_TOKEN=your-github-token-here
REPO_OWNER=dylangumnanis
REPO_NAME=seniorwebsite

# WordPress Webhook Secret (existing)
WORDPRESS_WEBHOOK_SECRET=your-webhook-secret-here
```

### 2. WordPress Authentication Token

To enable Cursor → WordPress sync, you need a WordPress authentication token:

1. Install a WordPress plugin like "Application Passwords" or "JWT Authentication"
2. Generate an authentication token
3. Add it to your environment variables as `WORDPRESS_AUTH_TOKEN`

### 3. File Structure

The system creates this structure:

```
content/
└── posts/
    ├── README.md                    # Documentation
    ├── 1-welcome-to-senior-tech.md  # Post files (ID-slug.md)
    ├── 2-essential-tech-skills.md
    └── .meta/
        ├── 1.json                   # Metadata files
        └── 2.json
```

## Usage

### Dashboard Interface

Access the content management dashboard at `/dashboard/content`:

- 📊 **View sync status** for all posts
- 🔄 **Manual sync controls** (WordPress→Local, Local→WordPress, Bi-directional)
- ⚠️ **Conflict detection and resolution**
- 📝 **Quick post editing** (coming soon)

### Command Line

```bash
# Start file watcher (monitors local changes)
npm run sync:watch

# Manual sync commands
npm run sync:from-wp        # WordPress → Local
npm run sync:to-wp          # Local → WordPress  
npm run sync:bidirectional  # Both directions
```

### Editing Workflow

#### Option 1: Edit in WordPress (Cofounder)
1. Cofounder edits posts in WordPress
2. Webhook triggers GitHub Actions
3. Website rebuilds automatically
4. Local files sync on next manual/auto sync

#### Option 2: Edit in Cursor (You)
1. Edit markdown files in `content/posts/`
2. File watcher auto-syncs to WordPress
3. Changes appear on WordPress site
4. Cofounder sees updates in WordPress admin

## File Format

Each post is stored as a markdown file with YAML frontmatter:

```markdown
---
id: 1
title: "Welcome to Senior Tech Connect"
slug: "welcome-to-senior-tech-connect"
status: "publish"
author: "Senior Tech Connect Team"
date: "2024-01-15T10:00:00"
modified: "2024-01-15T10:00:00"
excerpt: "We're excited to launch our platform..."
featured_media: "https://example.com/image.jpg"
categories: ["News", "Updates"]
tags: ["launch", "announcement"]
wordpress_modified: "2024-01-15T10:00:00"
local_modified: "2024-01-15T10:05:00"
---

# Welcome to Senior Tech Connect

We're excited to launch our platform connecting seniors with student volunteers for technology education...
```

## Conflict Resolution

When both WordPress and local files are modified:

1. 🚨 **Conflict Detection**: System identifies simultaneous edits
2. 📋 **Manual Review**: Conflicts displayed in dashboard
3. 🔧 **Resolution Options**:
   - Choose WordPress version
   - Choose local version
   - Manual merge

## Sync Status Indicators

- 🟢 **Synced**: Local and WordPress versions match
- 🟡 **Needs Sync**: Local changes ready to push
- 🔴 **Conflict**: Both sides modified, needs resolution
- ⚪ **Local Only**: Post exists locally but not in WordPress

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Check `WORDPRESS_AUTH_TOKEN` is correct
   - Verify WordPress user has proper permissions

2. **File Watcher Not Working**
   - Ensure `chokidar` package is installed
   - Check file permissions in `content/posts/`

3. **Sync Conflicts**
   - Use dashboard to view and resolve conflicts
   - Consider manual merge for complex changes

### Debug Commands

```bash
# Check sync status
curl http://localhost:3000/api/sync

# Manual sync with detailed output
curl -X POST http://localhost:3000/api/sync \
  -H "Content-Type: application/json" \
  -d '{"direction":"bidirectional"}'
```

## Development Workflow

### Daily Usage
1. Start development server: `npm run dev`
2. Start file watcher: `npm run sync:watch`
3. Edit content in Cursor or WordPress
4. Changes sync automatically

### Collaboration
- **Cofounder**: Edits in WordPress admin
- **You**: Edits in Cursor markdown files
- **System**: Handles sync and conflict resolution

## API Endpoints

- `GET /api/sync` - Get sync status
- `POST /api/sync` - Trigger sync
  - `{ "direction": "wordpress-to-local" }`
  - `{ "direction": "local-to-wordpress" }`
  - `{ "direction": "bidirectional" }`

## Future Enhancements

- [ ] Rich text editor in dashboard
- [ ] Image upload and management
- [ ] Category/tag management
- [ ] Post scheduling
- [ ] Version history
- [ ] Automated conflict resolution

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review logs in terminal/console
3. Use the dashboard to inspect sync status
4. Test with manual sync commands

The system is designed to be robust and handle edge cases gracefully. Happy blogging! 🎉 