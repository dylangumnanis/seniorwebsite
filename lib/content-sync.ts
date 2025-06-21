import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { customWpApi, WordPressPost, WordPressPostCreateData, WordPressPostUpdateData } from './wordpress-custom';

// Legacy import for fallback (if needed)
// import { wpApi, SyncMetadata } from './wordpress';

export interface LocalPostData {
  id?: number;
  title: string;
  content: string;
  slug: string;
  status: 'publish' | 'draft' | 'private';
  author?: string;
  date?: string;
  modified?: string;
  excerpt?: string;
  featured_media?: string;
  categories?: string[];
  tags?: string[];
  wordpress_modified?: string;
  local_modified: string;
}

export interface SyncResult {
  success: boolean;
  action: 'create' | 'update' | 'skip' | 'conflict';
  message: string;
  post?: WordPressPost;
  conflicts?: string[];
}

export class ContentSyncManager {
  private contentDir = path.join(process.cwd(), 'content', 'posts');
  private metaDir = path.join(process.cwd(), 'content', 'posts', '.meta');

  constructor() {
    // Directory creation will be handled when needed
  }

  private async ensureDirectories() {
    try {
      await fs.mkdir(this.contentDir, { recursive: true });
      await fs.mkdir(this.metaDir, { recursive: true });
    } catch (error) {
      console.error('Error creating content directories:', error);
    }
  }

  private getPostFilePath(id: number, slug: string): string {
    return path.join(this.contentDir, `${id}-${slug}.md`);
  }

  private getMetaFilePath(id: number): string {
    return path.join(this.metaDir, `${id}.json`);
  }

  private markdownToHtml(markdown: string): string {
    // Simple markdown to HTML conversion for basic formatting
    return markdown
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/\n\n/gim, '</p><p>')
      .replace(/^(?!<[h1-6]|<p)/gim, '<p>')
      .replace(/(?<!>)$/gim, '</p>')
      .replace(/<p><\/p>/gim, '');
  }

  private htmlToMarkdown(html: string): string {
    // Simple HTML to markdown conversion
    return html
      .replace(/<h1>(.*?)<\/h1>/gim, '# $1\n\n')
      .replace(/<h2>(.*?)<\/h2>/gim, '## $1\n\n')
      .replace(/<h3>(.*?)<\/h3>/gim, '### $1\n\n')
      .replace(/<strong>(.*?)<\/strong>/gim, '**$1**')
      .replace(/<em>(.*?)<\/em>/gim, '*$1*')
      .replace(/<p>(.*?)<\/p>/gim, '$1\n\n')
      .replace(/<br\s*\/?>/gim, '\n')
      .replace(/&nbsp;/gim, ' ')
      .trim();
  }

  async saveLocalPost(postData: LocalPostData): Promise<void> {
    await this.ensureDirectories();
    
    if (!postData.id) {
      throw new Error('Post ID is required for saving local post');
    }

    // Filter out undefined values to prevent YAML serialization errors
    const frontmatter: any = {
      id: postData.id,
      title: postData.title,
      slug: postData.slug,
      status: postData.status,
      local_modified: postData.local_modified,
      categories: postData.categories || [],
      tags: postData.tags || [],
    };

    // Only add fields that are not undefined
    if (postData.author !== undefined) frontmatter.author = postData.author;
    if (postData.date !== undefined) frontmatter.date = postData.date;
    if (postData.modified !== undefined) frontmatter.modified = postData.modified;
    if (postData.excerpt !== undefined) frontmatter.excerpt = postData.excerpt;
    if (postData.featured_media !== undefined) frontmatter.featured_media = postData.featured_media;
    if (postData.wordpress_modified !== undefined) frontmatter.wordpress_modified = postData.wordpress_modified;

    const fileContent = matter.stringify(postData.content, frontmatter);
    const filePath = this.getPostFilePath(postData.id, postData.slug);
    
    await fs.writeFile(filePath, fileContent, 'utf-8');
  }

  async loadLocalPost(id: number, slug: string): Promise<LocalPostData | null> {
    try {
      const filePath = this.getPostFilePath(id, slug);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const { data, content } = matter(fileContent);
      
      return {
        id: data.id,
        title: data.title,
        content,
        slug: data.slug,
        status: data.status,
        author: data.author,
        date: data.date,
        modified: data.modified,
        excerpt: data.excerpt,
        featured_media: data.featured_media,
        categories: data.categories,
        tags: data.tags,
        wordpress_modified: data.wordpress_modified,
        local_modified: data.local_modified,
      };
    } catch (error) {
      return null;
    }
  }

  async getAllLocalPosts(): Promise<LocalPostData[]> {
    try {
      await this.ensureDirectories();
      const files = await fs.readdir(this.contentDir);
      const postFiles = files.filter(file => file.endsWith('.md') && file.includes('-'));
      
      const posts: LocalPostData[] = [];
      for (const file of postFiles) {
        const [idStr, ...slugParts] = file.replace('.md', '').split('-');
        const id = parseInt(idStr);
        const slug = slugParts.join('-');
        
        const post = await this.loadLocalPost(id, slug);
        if (post) {
          posts.push(post);
        }
      }
      
      return posts;
    } catch (error) {
      console.error('Error loading local posts:', error);
      return [];
    }
  }

  async syncFromWordPress(): Promise<SyncResult[]> {
    const results: SyncResult[] = [];
    
    try {
      // Fetch all posts from WordPress using the new custom API
      const wpPosts = await customWpApi.fetchPosts({ per_page: 100 });
      
      for (const wpPost of wpPosts) {
        const result = await this.syncPostFromWordPress(wpPost);
        results.push(result);
      }
    } catch (error) {
      console.error('Error syncing from WordPress:', error);
      results.push({
        success: false,
        action: 'skip',
        message: `Error syncing from WordPress: ${error}`,
      });
    }
    
    return results;
  }

  private async syncPostFromWordPress(wpPost: WordPressPost): Promise<SyncResult> {
    const localPost = await this.loadLocalPost(wpPost.id, wpPost.slug);
    const wpModified = new Date(wpPost.modified);
    const now = new Date().toISOString();

    // If no local post exists, create it
    if (!localPost) {
      const newPost: LocalPostData = {
        id: wpPost.id,
        title: wpPost.title.rendered,
        content: this.htmlToMarkdown(wpPost.content.rendered),
        slug: wpPost.slug,
        status: wpPost.status || 'publish',
        author: wpPost.author?.toString(),
        date: wpPost.date,
        modified: wpPost.modified,
        excerpt: wpPost.excerpt.rendered ? this.htmlToMarkdown(wpPost.excerpt.rendered) : '',
        featured_media: wpPost.featured_image_url,
        categories: wpPost.categories?.map(cat => cat.name) || [],
        tags: wpPost.tags?.map(tag => tag.name) || [],
        wordpress_modified: wpPost.modified,
        local_modified: now,
      };

      await this.saveLocalPost(newPost);
      
      return {
        success: true,
        action: 'create',
        message: `Created local post: ${wpPost.title.rendered}`,
        post: wpPost,
      };
    }

    // Check for conflicts
    const localModified = new Date(localPost.local_modified);
    const lastWpModified = localPost.wordpress_modified ? new Date(localPost.wordpress_modified) : new Date(0);

    if (wpModified > lastWpModified && localModified > lastWpModified) {
      // Both sides have been modified - conflict
      return {
        success: false,
        action: 'conflict',
        message: `Conflict detected for post: ${wpPost.title.rendered}`,
        post: wpPost,
        conflicts: [
          `WordPress modified: ${wpPost.modified}`,
          `Local modified: ${localPost.local_modified}`,
          `Last sync: ${localPost.wordpress_modified}`,
        ],
      };
    }

    if (wpModified > lastWpModified) {
      // WordPress is newer, update local
      const updatedPost: LocalPostData = {
        ...localPost,
        title: wpPost.title.rendered,
        content: this.htmlToMarkdown(wpPost.content.rendered),
        slug: wpPost.slug,
        status: wpPost.status || 'publish',
        modified: wpPost.modified,
        excerpt: wpPost.excerpt.rendered ? this.htmlToMarkdown(wpPost.excerpt.rendered) : '',
        wordpress_modified: wpPost.modified,
        local_modified: now,
      };

      await this.saveLocalPost(updatedPost);
      
      return {
        success: true,
        action: 'update',
        message: `Updated local post from WordPress: ${wpPost.title.rendered}`,
        post: wpPost,
      };
    }

    return {
      success: true,
      action: 'skip',
      message: `Post up to date: ${wpPost.title.rendered}`,
      post: wpPost,
    };
  }

  async syncToWordPress(): Promise<SyncResult[]> {
    const results: SyncResult[] = [];
    const localPosts = await this.getAllLocalPosts();
    
    for (const localPost of localPosts) {
      const result = await this.syncPostToWordPress(localPost);
      results.push(result);
    }
    
    return results;
  }

  private async syncPostToWordPress(localPost: LocalPostData): Promise<SyncResult> {
    if (!localPost.id) {
      return {
        success: false,
        action: 'skip',
        message: 'Cannot sync post without ID to WordPress',
      };
    }

    try {
      const wpPost = await customWpApi.fetchPostById(localPost.id);
      const localModified = new Date(localPost.local_modified);
      const now = new Date().toISOString();

      if (!wpPost) {
        return {
          success: false,
          action: 'skip',
          message: `WordPress post ${localPost.id} not found, skipping`,
        };
      }

      const wpModified = new Date(wpPost.modified);
      const lastWpModified = localPost.wordpress_modified ? new Date(localPost.wordpress_modified) : new Date(0);

      // Check for conflicts
      if (wpModified > lastWpModified && localModified > lastWpModified) {
        return {
          success: false,
          action: 'conflict',
          message: `Conflict detected for post: ${localPost.title}`,
          conflicts: [
            `WordPress modified: ${wpPost.modified}`,
            `Local modified: ${localPost.local_modified}`,
            `Last WP sync: ${localPost.wordpress_modified}`,
          ],
        };
      }

      // Only sync if local is newer
      if (localModified <= lastWpModified) {
        return {
          success: true,
          action: 'skip',
          message: `Local post up to date: ${localPost.title}`,
        };
      }

      // Update WordPress
      const updateData: WordPressPostUpdateData = {
        id: localPost.id,
        title: localPost.title,
        content: this.markdownToHtml(localPost.content),
        excerpt: localPost.excerpt ? this.markdownToHtml(localPost.excerpt) : undefined,
        status: localPost.status,
        slug: localPost.slug,
      };

      const updatedPost = await customWpApi.updatePost(updateData);
      
      if (!updatedPost) {
        return {
          success: false,
          action: 'skip',
          message: `Failed to update WordPress post: ${localPost.title}`,
        };
      }

      // Update local metadata
      const updatedLocalPost: LocalPostData = {
        ...localPost,
        wordpress_modified: updatedPost.modified,
        modified: updatedPost.modified,
      };
      
      await this.saveLocalPost(updatedLocalPost);

      return {
        success: true,
        action: 'update',
        message: `Updated WordPress post: ${localPost.title}`,
        post: updatedPost,
      };

    } catch (error) {
      return {
        success: false,
        action: 'skip',
        message: `Error syncing to WordPress: ${error}`,
      };
    }
  }

  async fullSync(): Promise<{ fromWordPress: SyncResult[]; toWordPress: SyncResult[] }> {
    console.log('Starting full bi-directional sync...');
    
    const fromWordPress = await this.syncFromWordPress();
    const toWordPress = await this.syncToWordPress();
    
    return { fromWordPress, toWordPress };
  }
}

export const contentSync = new ContentSyncManager();
 