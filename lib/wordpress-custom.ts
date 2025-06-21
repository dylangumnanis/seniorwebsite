// Custom WordPress API client for Digital Trailheads Sync API
// This uses API key authentication instead of application passwords

const CUSTOM_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_CUSTOM_API_URL || 'https://info.digitaltrailheads.com/wp-json/dt-sync/v1';
const STANDARD_WP_API_URL = 'https://info.digitaltrailheads.com/wp-json/wp/v2';
const API_KEY = process.env.NEXT_PUBLIC_WORDPRESS_CUSTOM_API_KEY || process.env.WORDPRESS_CUSTOM_API_KEY || 'dt-sync-ca08675eb5ec2c49f2cd06e139be7bd0';

export interface WordPressPost {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  slug: string;
  date: string;
  modified: string;
  status: 'publish' | 'draft' | 'private';
  author: number;
  featured_media: number;
  featured_image_url?: string;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  link: string;
}

export interface WordPressPostCreateData {
  title: string;
  content: string;
  excerpt?: string;
  slug?: string;
  status: 'publish' | 'draft' | 'private';
  categories?: number[];
  tags?: number[];
  featured_media?: number;
}

export interface WordPressPostUpdateData extends Partial<WordPressPostCreateData> {
  id: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

class CustomWordPressAPI {
  private baseUrl: string;
  private standardApiUrl: string;
  private apiKey: string;
  private useStandardApi: boolean = false;

  constructor(baseUrl: string = CUSTOM_API_URL, apiKey: string = API_KEY) {
    this.baseUrl = baseUrl;
    this.standardApiUrl = STANDARD_WP_API_URL;
    this.apiKey = apiKey;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (!this.useStandardApi) {
      headers['X-API-Key'] = this.apiKey;
    }
    
    return headers;
  }

  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any,
    useStandard: boolean = false
  ): Promise<ApiResponse<T>> {
    const baseUrl = useStandard || this.useStandardApi ? this.standardApiUrl : this.baseUrl;
    const url = `${baseUrl}${endpoint}`;
    
    const options: RequestInit = {
      method,
      headers: this.getHeaders(),
    };

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    try {
      console.log(`🌐 Making ${method} request to: ${url}`);
      
      const response = await fetch(url, options);
      
      // Check if we got HTML instead of JSON (indicates custom API is broken)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        console.warn('⚠️ Received HTML response, custom API may not be available');
        
        // If using custom API and got HTML, try standard API
        if (!useStandard && !this.useStandardApi) {
          console.log('🔄 Falling back to standard WordPress API...');
          this.useStandardApi = true;
          return this.makeRequest(endpoint, method, data, true);
        }
      }
      
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${responseData.message || 'Unknown error'}`);
      }

      // Handle different response formats
      if (useStandard || this.useStandardApi) {
        // Standard WordPress API returns array directly for posts
        if (Array.isArray(responseData)) {
          return {
            success: true,
            data: responseData as T
          };
        }
        return {
          success: true,
          data: responseData as T
        };
      }

      return responseData;
    } catch (error) {
      console.error(`❌ API Error (${method} ${endpoint}):`, error);
      
      // If custom API fails and we haven't tried standard API yet
      if (!useStandard && !this.useStandardApi && error instanceof SyntaxError) {
        console.log('🔄 Custom API failed with JSON parse error, trying standard API...');
        this.useStandardApi = true;
        return this.makeRequest(endpoint, method, data, true);
      }
      
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      // Try custom API first
      const response = await this.makeRequest('/test');
      return response.success;
    } catch (error) {
      console.warn('❌ Custom API connection test failed, trying standard WordPress API...');
      try {
        // Try standard WordPress API
        this.useStandardApi = true;
        const response = await this.makeRequest('/posts', 'GET', undefined, true);
        return response.success;
      } catch (standardError) {
        console.error('❌ Both custom and standard API failed:', standardError);
      return false;
      }
    }
  }

  async healthCheck(): Promise<ApiResponse<any>> {
    if (this.useStandardApi) {
      // Standard WordPress API doesn't have health check, so just try to get posts
      try {
        await this.fetchPosts({ per_page: 1 });
        return { success: true, message: 'Standard WordPress API working' };
      } catch (error) {
        return { success: false, message: 'Standard WordPress API failed' };
      }
    }
    return this.makeRequest('/health');
  }

  async fetchPosts(params: {
    per_page?: number;
    page?: number;
    search?: string;
    status?: string;
  } = {}): Promise<WordPressPost[]> {
    const queryParams = new URLSearchParams();
    
    if (params.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    
    const endpoint = `/posts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    try {
      const response = await this.makeRequest<WordPressPost[]>(endpoint);
      
      if (response.success && response.data) {
        console.log(`✅ Fetched ${response.data.length} posts`);
        if (response.pagination) {
          console.log(`📄 Page ${response.pagination.page} of ${response.pagination.total_pages} (${response.pagination.total} total)`);
        }
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch posts');
    } catch (error) {
      console.error('❌ Error fetching posts:', error);
      throw error;
    }
  }

  async fetchPostById(id: number): Promise<WordPressPost | null> {
    try {
      const response = await this.makeRequest<WordPressPost>(`/posts/${id}`);
      
      if (response.success && response.data) {
        console.log(`✅ Fetched post: ${response.data.title.rendered}`);
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error(`❌ Error fetching post ${id}:`, error);
      return null;
    }
  }

  async fetchPostBySlug(slug: string): Promise<WordPressPost | null> {
    try {
      let response;
      
      if (this.useStandardApi) {
        // Standard WordPress API uses query parameter
        response = await this.makeRequest<WordPressPost[]>(`/posts?slug=${slug}`);
        
        if (response.success && response.data && response.data.length > 0) {
          console.log(`✅ Fetched post by slug: ${response.data[0].title.rendered}`);
          return response.data[0];
        }
      } else {
        // Custom API uses slug endpoint
        response = await this.makeRequest<WordPressPost>(`/posts/slug/${slug}`);
      
      if (response.success && response.data) {
        console.log(`✅ Fetched post by slug: ${response.data.title.rendered}`);
        return response.data;
        }
      }
      
      return null;
    } catch (error) {
      console.error(`❌ Error fetching post by slug ${slug}:`, error);
      return null;
    }
  }

  async createPost(postData: WordPressPostCreateData): Promise<WordPressPost | null> {
    try {
      console.log(`🆕 Creating post: ${postData.title}`);
      
      const response = await this.makeRequest<WordPressPost>('/posts', 'POST', postData);
      
      if (response.success && response.data) {
        console.log(`✅ Post created successfully: ${response.data.title.rendered} (ID: ${response.data.id})`);
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to create post');
    } catch (error) {
      console.error('❌ Error creating post:', error);
      throw error;
    }
  }

  async updatePost(postData: WordPressPostUpdateData): Promise<WordPressPost | null> {
    try {
      console.log(`📝 Updating post: ${postData.title || postData.id}`);
      
      const { id, ...updateData } = postData;
      const response = await this.makeRequest<WordPressPost>(`/posts/${id}`, 'PUT', updateData);
      
      if (response.success && response.data) {
        console.log(`✅ Post updated successfully: ${response.data.title.rendered} (ID: ${response.data.id})`);
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to update post');
    } catch (error) {
      console.error('❌ Error updating post:', error);
      throw error;
    }
  }

  async deletePost(id: number, force: boolean = false): Promise<boolean> {
    try {
      console.log(`🗑️ Deleting post: ${id}`);
      
      const endpoint = `/posts/${id}${force ? '?force=true' : ''}`;
      const response = await this.makeRequest(endpoint, 'DELETE');
      
      if (response.success) {
        console.log(`✅ Post deleted successfully: ${id}`);
        return true;
      }
      
      throw new Error(response.message || 'Failed to delete post');
    } catch (error) {
      console.error('❌ Error deleting post:', error);
      return false;
    }
  }

  async fetchAllPosts(): Promise<WordPressPost[]> {
    try {
      const allPosts: WordPressPost[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const posts = await this.fetchPosts({ per_page: 50, page });
        allPosts.push(...posts);
        
        hasMore = posts.length === 50;
        page++;
      }

      console.log(`✅ Fetched all ${allPosts.length} posts`);
      return allPosts;
    } catch (error) {
      console.error('❌ Error fetching all posts:', error);
      throw error;
    }
  }
}

export const customWpApi = new CustomWordPressAPI();
export { CustomWordPressAPI }; 