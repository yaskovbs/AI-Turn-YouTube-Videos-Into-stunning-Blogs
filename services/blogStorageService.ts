// services/blogStorageService.ts

export interface BlogPost {
  id: string;
  userId: string;
  videoTitle: string;
  videoUrl: string;
  videoEmbedUrl: string;
  blogContent: string;
  targetAudience: string;
  desiredTone: string;
  createdAt: Date;
  updatedAt: Date;
  thumbnailUrl?: string;
  isPublished: boolean;
}

export interface DomainSettings {
  userId: string;
  customDomain?: string;
  subdomain?: string;
  isActive: boolean;
}

// Storage keys
const BLOGS_KEY = 'userBlogs';
const DOMAIN_KEY = 'domainSettings';

class BlogStorageService {
  // Save a blog post
  saveBlog(blog: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): BlogPost {
    const blogs = this.getAllBlogs();
    const newBlog: BlogPost = {
      ...blog,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    blogs.push(newBlog);
    localStorage.setItem(BLOGS_KEY, JSON.stringify(blogs));
    return newBlog;
  }

  // Update an existing blog
  updateBlog(id: string, updates: Partial<BlogPost>): BlogPost | null {
    const blogs = this.getAllBlogs();
    const index = blogs.findIndex(b => b.id === id);

    if (index === -1) return null;

    blogs[index] = {
      ...blogs[index],
      ...updates,
      updatedAt: new Date()
    };

    localStorage.setItem(BLOGS_KEY, JSON.stringify(blogs));
    return blogs[index];
  }

  // Get all blogs for current user's domain
  getAllBlogs(): BlogPost[] {
    try {
      const data = localStorage.getItem(BLOGS_KEY);
      const allBlogs = data ? JSON.parse(data) : [];
      // For now, return all blogs (future: filter by user if needed)
      return allBlogs.map((blog: any) => ({
        ...blog,
        createdAt: new Date(blog.createdAt),
        updatedAt: new Date(blog.updatedAt)
      }));
    } catch (error) {
      console.error('Error loading blogs:', error);
      return [];
    }
  }

  // Get blog by ID
  getBlogById(id: string): BlogPost | null {
    const blogs = this.getAllBlogs();
    return blogs.find(blog => blog.id === id) || null;
  }

  // Delete blog by ID
  deleteBlog(id: string): boolean {
    const blogs = this.getAllBlogs();
    const filteredBlogs = blogs.filter(blog => blog.id !== id);

    if (filteredBlogs.length === blogs.length) return false;

    localStorage.setItem(BLOGS_KEY, JSON.stringify(filteredBlogs));
    return true;
  }

  // Search blogs by title or content
  searchBlogs(query: string): BlogPost[] {
    const blogs = this.getAllBlogs();
    const lowerQuery = query.toLowerCase();

    return blogs.filter(blog =>
      blog.videoTitle.toLowerCase().includes(lowerQuery) ||
      blog.blogContent.toLowerCase().includes(lowerQuery)
    );
  }

  // Get domain settings
  getDomainSettings(): DomainSettings | null {
    try {
      const data = localStorage.getItem(DOMAIN_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading domain settings:', error);
      return null;
    }
  }

  // Save domain settings
  saveDomainSettings(settings: DomainSettings): void {
    localStorage.setItem(DOMAIN_KEY, JSON.stringify(settings));
  }

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Clear all data (for development/testing)
  clearAllData(): void {
    localStorage.removeItem(BLOGS_KEY);
    localStorage.removeItem(DOMAIN_KEY);
  }
}

export const blogStorage = new BlogStorageService();
export default blogStorage;
