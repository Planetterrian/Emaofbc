import type { MetadataRoute } from 'next';
import { getPublishedEvents, getOrganizationWithDirectory } from '@/lib/db';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://emaofbc.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    '', '/about', '/events', '/directory', '/board', '/sponsorship', '/join',
    '/contact', '/member-assistant', '/privacy', '/terms', '/auth/login', '/auth/signup',
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  const [events, orgs] = await Promise.all([
    getPublishedEvents().catch(() => []),
    getOrganizationWithDirectory().catch(() => []),
  ]);

  const eventPages = events.map((e) => ({
    url: `${BASE}/events/${e.id}`,
    lastModified: new Date(e.updated_at || e.starts_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const orgPages = orgs.map((o) => ({
    url: `${BASE}/directory/${o.id}`,
    lastModified: new Date(o.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...staticPages, ...eventPages, ...orgPages];
}
