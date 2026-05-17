import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

const API_BASE = 'https://api.meetingmaker.tech';
const SSR_BLOG_URL = 'https://blog.meetingmaker.tech';

interface Article {
  slug: string;
  publishedAt: string;
  title: string;
}

interface ClientResponse {
  clientId: string;
  blogTitle: string;
  layout: string;
}

async function getClientIdBySubdomain(subdomain: string): Promise<string | null> {
  try {
    // Use the public endpoint (no authentication needed for lookup)
    const response = await fetch(
      `${API_BASE}/blog/public/client/by-domain/${subdomain}.meetingmaker.tech`,
      {
        next: { revalidate: 3600 }
      }
    );
    
    if (!response.ok) {
      console.error(`Failed to find client for subdomain: ${subdomain}`);
      return null;
    }
    
    const data: ClientResponse = await response.json();
    return data.clientId;
  } catch (error) {
    console.error('Error fetching client ID:', error);
    return null;
  }
}

async function fetchArticles(clientId: string): Promise<Article[]> {
  try {
    const response = await fetch(
      `${API_BASE}/blog/ssr/articles?clientId=${clientId}&limit=100`,
      {
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    );
    
    if (!response.ok) {
      console.error('Failed to fetch articles:', response.status);
      return [];
    }
    
    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.meetingmaker.tech';
  
  // Static pages for main website
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];
  
  // Blog homepage on the SSR domain
  const blogPages: MetadataRoute.Sitemap = [
    {
      url: SSR_BLOG_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];
  
  // Fetch client ID for "blog" subdomain and get articles
  try {
    const clientId = await getClientIdBySubdomain('blog');
    
    if (clientId) {
      const articles = await fetchArticles(clientId);
      
      const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
        url: `${SSR_BLOG_URL}/${article.slug}`,
        lastModified: new Date(article.publishedAt),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
      
      console.log(`Sitemap generated: ${staticPages.length} static + ${blogPages.length} blog + ${articlePages.length} articles`);
      
      return [...staticPages, ...blogPages, ...articlePages];
    } else {
      console.warn('Could not find client ID for blog subdomain');
      return [...staticPages, ...blogPages];
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return [...staticPages, ...blogPages];
  }
}