// app/lib/blog-posts.ts
import blogData from './blog-data.json';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
}

// Import blog data from JSON file (109 posts migrated from Lofty/vahome.com)
export const blogPosts: BlogPost[] = blogData as BlogPost[];

/**
 * Get all blog posts sorted by date descending
 */
export function getAllPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get a single blog post by slug
 */
export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

/**
 * Get all blog posts in a specific category
 */
export function getPostsByCategory(category: string): BlogPost[] {
  return blogPosts
    .filter((post) => post.category.toLowerCase() === category.toLowerCase())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get all unique categories from blog posts
 */
export function getAllCategories(): string[] {
  const categories = new Set(blogPosts.map((post) => post.category));
  return Array.from(categories).sort();
}
