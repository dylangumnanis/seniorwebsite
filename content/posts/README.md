# Blog Content Storage

This directory contains local markdown files that sync with WordPress posts.

## File Structure
```
content/posts/
  {post-id}-{slug}.md     # Individual blog posts
  .meta/
    {post-id}.json        # WordPress metadata (categories, tags, etc.)
```

## Frontmatter Format
Each markdown file contains YAML frontmatter with:
- `id`: WordPress post ID
- `title`: Post title
- `slug`: URL slug
- `status`: publish|draft|private
- `author`: Author name
- `date`: Publication date
- `modified`: Last modified date
- `excerpt`: Post excerpt
- `featured_media`: Featured image URL
- `categories`: Array of category names
- `tags`: Array of tag names
- `wordpress_modified`: Last WordPress update timestamp
- `local_modified`: Last local update timestamp

## Sync Status
- ✅ Synced: `wordpress_modified` == `local_modified`
- 🟡 Local Newer: `local_modified` > `wordpress_modified`
- 🟡 WordPress Newer: `wordpress_modified` > `local_modified`
- ⚠️ Conflict: Both modified since last sync 