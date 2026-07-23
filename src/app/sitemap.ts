import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.unionsystems.co.kr';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/company`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/company/about`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/company/history`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/company/location`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/software`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/software/microsoft`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/software/adobe`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/software/autodesk`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/software/estsoft`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/solutions`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/solution/security`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/solution/security/ahnlab`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/solution/security/estsecurity`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/solution/security/officekeeper`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/solution/asset-management/netclient`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/insights`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/support/notices`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/support/events`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/support/cases`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Dynamically add insight posts
  let insightPages: MetadataRoute.Sitemap = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/union';
    const res = await fetch(`${apiUrl}/posts?category=INSIGHT&page=0&size=100`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const posts = data.content || [];
      insightPages = posts.map((post: { id: number; updatedAt?: string; createdAt?: string }) => ({
        url: `${SITE_URL}/insights/${post.id}`,
        lastModified: post.updatedAt || post.createdAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch {
    // silently skip dynamic pages
  }

  return [...staticPages, ...insightPages];
}
