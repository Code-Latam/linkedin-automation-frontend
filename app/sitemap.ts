import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

// Your API token (same one from your blog page)
const API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTgxYTExMWQ0ZGQ2YmUwYjhlMzk5OTkiLCJjbGllbnRJZCI6eyJyYXRlTGltaXQiOnsicnBtIjoxMjAsImJ1cnN0IjozMH0sImNvbm5lY3RlZEFjY291bnRzIjp7ImxpbmtlZGluIjp7ImF1dGgiOnsibWV0aG9kIjoiY29va2llIiwibGFzdENvb2tpZVJlZnJlc2hBdCI6IjIwMjYtMDMtMjJUMjA6MTQ6NDAuOTI3WiIsInVzZXJBZ2VudCI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xNDYuMC4wLjAgU2FmYXJpLzUzNy4zNiJ9LCJwcm92aWRlciI6ImxpbmtlZGluIiwidW5pcGlsZUFjY291bnRJZCI6Im5ISkwyUzY1U0pHeVZ1OURDTWl4SEEiLCJzdGF0dXMiOiJjb25uZWN0ZWQiLCJsYXN0Q29ubmVjdGVkQXQiOiIyMDI2LTAzLTE1VDEzOjI5OjMzLjMyM1oiLCJsYXN0Q2hlY2tlZEF0IjoiMjAyNi0wNC0wM1QxMzo0MDowNC4yOTZaIiwibGFzdEVycm9yIjpudWxsfX0sIl9pZCI6IjY5ODBkZjYwZDRkZDZiZTBiOGUzMDgxYyIsImVtYWlsIjoic3RldmVuK3Rlc3QxQHNhYXNlbnRpYWwudGVjaCIsIm5hbWUiOiJTYWFzZW50aWFsIFRlc3QgQ2xpZW50Iiwic3RhdHVzIjoiYWN0aXZlIiwicGxhbiI6InByZW1pdW0iLCJ0aW1lem9uZSI6IkFtZXJpY2EvQm9nb3RhIiwiYWdlbnRJZHMiOltdLCJhcGlLZXlzIjpbeyJrZXlJZCI6ImtfMDByZGxYdUVYUEFpIiwia2V5SGFzaCI6IiQyYiQxMiRvazlTSE90ck9uUERSSi5mTWxURU1PZHg2V1B3Rjk0NXR6clNmRm0xYjkzWXdSSkxwb0xFQyIsInByZWZpeCI6InpnM1hHU3hiIiwibGFiZWwiOiJEZWZhdWx0Iiwic2NvcGVzIjpbIioiXSwibGFzdFVzZWRBdCI6IjIwMjYtMDItMjdUMjI6MDA6MDIuMTQ1WiIsInJldm9rZWRBdCI6bnVsbCwiY3JlYXRlZEF0IjoiMjAyNi0wMi0wMlQxNzozMToxMi4wMjlaIn1dLCJjcmVhdGVkQXQiOiIyMDI2LTAyLTAyVDE3OjMxOjEyLjAzMloiLCJ1cGRhdGVkQXQiOiIyMDI2LTA0LTAzVDEzOjQwOjA0LjI5N1oiLCJfX3YiOjAsInN0cmlwZUN1c3RvbWVySWQiOiJjdXNfVTllTHNYWTFEbE9kZjkiLCJibG9nIjp7InNlbyI6eyJtZXRhVGl0bGUiOiIiLCJtZXRhRGVzY3JpcHRpb24iOiIiLCJrZXl3b3JkcyI6W119LCJlbmFibGVkIjp0cnVlLCJ0aXRsZSI6Ik15IEJsb2ciLCJsYXlvdXQiOiJsaXN0IiwicG9zdHNQZXJQYWdlIjoxMCwiY3VzdG9tQ1NTIjoiIiwiY3VzdG9tRG9tYWluIjoiaHR0cHM6Ly93d3cubWVldGluZ21ha2VyLnRlY2gvYmxvZyIsInBvc3RMaW5rZWRJbiI6dHJ1ZSwibGlua2VkaW5UZW1wbGF0ZUltYWdlIjoiaHR0cHM6Ly9hcGkubWVldGluZ21ha2VyLnRlY2gvdXBsb2Fkcy9saW5rZWRpbi10ZW1wbGF0ZXMvdGVtcGxhdGUtNjk4MGRmNjBkNGRkNmJlMGI4ZTMwODFjLnBuZyJ9fSwicm9sZSI6Im93bmVyIiwiaWF0IjoxNzc1MjIzNzIwfQ.iANUGiTx5r24D3MT0PZYt9IZ2i_L8VftvQCjvsbczxc';

interface Article {
  slug: string;
  publishedAt: string;
  title: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.meetingmaker.tech';
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
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
  ];
  
  // Fetch articles from your API
  try {
    const response = await fetch('https://api.meetingmaker.tech/blog/articles', {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      console.error('Failed to fetch articles for sitemap:', response.status);
      return staticPages;
    }
    
    const data = await response.json();
    const articles: Article[] = data.articles || [];
    
    // Generate clean URLs for each article
    const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: new Date(article.publishedAt),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
    
    return [...staticPages, ...articlePages];
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticPages;
  }
}