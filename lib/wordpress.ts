const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://info.digitaltrailheads.com/wp-json/wp/v2';

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
  featured_media: number;
  categories: number[];
  tags: number[];
  author: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    author?: Array<{
      name: string;
      avatar_urls: {
        [size: string]: string;
      };
    }>;
  };
}

export interface WordPressPage {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  slug: string;
  date: string;
  modified: string;
}

class WordPressAPI {
  private baseUrl: string;

  constructor(baseUrl: string = WORDPRESS_API_URL) {
    this.baseUrl = baseUrl;
  }

  // Demo data for testing when API is not available
  private getDemoData(): WordPressPost[] {
    return [
      {
        id: 1,
        title: { rendered: "Welcome to Senior Tech Connect" },
        content: { rendered: "<p>We're excited to launch our platform connecting seniors with student volunteers for technology education. This blog will keep you updated on our latest news, success stories, and technology tips.</p><p>Our mission is to bridge the digital divide and ensure that seniors have access to the technology skills they need to stay connected with family, manage their finances, and live independently.</p>" },
        excerpt: { rendered: "<p>We're excited to launch our platform connecting seniors with student volunteers for technology education.</p>" },
        slug: "welcome-to-senior-tech-connect",
        date: "2024-01-15T10:00:00",
        modified: "2024-01-15T10:00:00",
        featured_media: 0,
        categories: [1],
        tags: [1, 2],
        author: 1,
        _embedded: {
          author: [{ name: "Senior Tech Connect Team", avatar_urls: { "48": "" } }]
        }
      },
      {
        id: 2,
        title: { rendered: "5 Essential Technology Skills for Seniors" },
        content: { rendered: "<p>Technology doesn't have to be intimidating! Here are five essential skills that every senior should master:</p><h2>1. Email Communication</h2><p>Stay connected with family and friends through email. Learn to send, receive, and organize your messages safely.</p><h2>2. Video Calling</h2><p>Platforms like Zoom, Skype, and FaceTime help you see loved ones face-to-face, no matter the distance.</p><h2>3. Online Banking</h2><p>Manage your finances securely online with proper safety measures and strong passwords.</p><h2>4. Health Management Apps</h2><p>Track medications, appointments, and health data with user-friendly applications.</p><h2>5. Social Media Basics</h2><p>Connect with community and family through Facebook, Instagram, or other social platforms.</p>" },
        excerpt: { rendered: "<p>Technology doesn't have to be intimidating! Here are five essential skills that every senior should master.</p>" },
        slug: "essential-technology-skills-seniors",
        date: "2024-01-12T14:30:00",
        modified: "2024-01-12T14:30:00",
        featured_media: 0,
        categories: [2],
        tags: [3, 4],
        author: 1,
        _embedded: {
          author: [{ name: "Tech Education Team", avatar_urls: { "48": "" } }]
        }
      },
      {
        id: 3,
        title: { rendered: "Success Story: Margaret Learns Video Calling" },
        content: { rendered: "<p>Meet Margaret, a 73-year-old grandmother who hadn't spoken to her grandchildren in months due to distance. Through our volunteer program, student volunteer Sarah taught Margaret how to use video calling.</p><p>'I was so afraid of technology,' Margaret says. 'But Sarah was patient and kind. Now I talk to my grandchildren every week and see them grow up, even though they live across the country.'</p><p>This is exactly why our program exists - to connect generations and reduce isolation through technology education.</p><blockquote>'I was so afraid of technology, but Sarah was patient and kind. Now I talk to my grandchildren every week.' - Margaret</blockquote>" },
        excerpt: { rendered: "<p>Meet Margaret, a 73-year-old grandmother who learned video calling through our volunteer program.</p>" },
        slug: "success-story-margaret-video-calling",
        date: "2024-01-10T16:45:00",
        modified: "2024-01-10T16:45:00",
        featured_media: 0,
        categories: [3],
        tags: [5, 6],
        author: 1,
        _embedded: {
          author: [{ name: "Success Stories Team", avatar_urls: { "48": "" } }]
        }
      }
    ];
  }

  async fetchPosts(params: {
    per_page?: number;
    page?: number;
    categories?: string;
    search?: string;
    orderby?: string;
    order?: 'asc' | 'desc';
  } = {}): Promise<WordPressPost[]> {
    try {
      const searchParams = new URLSearchParams();
      searchParams.append('per_page', params.per_page?.toString() || '10');
      
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.categories) searchParams.append('categories', params.categories);
      if (params.search) searchParams.append('search', params.search);
      if (params.orderby) searchParams.append('orderby', params.orderby);
      if (params.order) searchParams.append('order', params.order);

      // Fetch directly from WordPress API with CORS handling
      const response = await fetch(`${this.baseUrl}/posts?_embed=true&${searchParams}`);
      
      if (!response.ok) {
        console.warn('WordPress API proxy not available, using demo data');
        return this.getDemoData();
      }

      return response.json();
    } catch (error) {
      console.warn('Error fetching from WordPress API, using demo data:', error);
      return this.getDemoData();
    }
  }

  async fetchPostBySlug(slug: string): Promise<WordPressPost | null> {
    try {
      // Fetch directly from WordPress API with CORS handling
      const response = await fetch(`${this.baseUrl}/posts?slug=${slug}&_embed=true`);
      
      if (!response.ok) {
        console.warn('WordPress API proxy not available, using demo data');
        const demoData = this.getDemoData();
        return demoData.find(post => post.slug === slug) || null;
      }

      const posts = await response.json();
      return posts.length > 0 ? posts[0] : null;
    } catch (error) {
      console.warn('Error fetching post from WordPress API, using demo data:', error);
      const demoData = this.getDemoData();
      return demoData.find(post => post.slug === slug) || null;
    }
  }

  async fetchPages(): Promise<WordPressPage[]> {
    const response = await fetch(`${this.baseUrl}/pages`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch pages: ${response.statusText}`);
    }

    return response.json();
  }

  async fetchPageBySlug(slug: string): Promise<WordPressPage | null> {
    const response = await fetch(`${this.baseUrl}/pages?slug=${slug}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.statusText}`);
    }

    const pages = await response.json();
    return pages.length > 0 ? pages[0] : null;
  }
}

export const wpApi = new WordPressAPI(); 