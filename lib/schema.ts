import type { Event } from './types';

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Environmental Managers Association of BC',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    description:
      'Professional network for environmental managers in British Columbia dedicated to advancing environmental due diligence and excellence.',
    sameAs: [
      'https://www.facebook.com/emaofbc',
      'https://www.linkedin.com/company/emaofbc',
    ],
  };
}

export function generateEventSchema(event: Event) {
  const startDate = new Date(event.starts_at);
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: startDate.toISOString(),
    location: {
      '@type': 'Place',
      name: event.venue,
    },
    organizer: {
      '@type': 'Organization',
      name: 'Environmental Managers Association of BC',
      url: process.env.NEXT_PUBLIC_SITE_URL,
    },
    eventStatus: 'https://schema.org/EventScheduled',
    offers: event.member_price_cents
      ? {
          '@type': 'Offer',
          price: (event.member_price_cents / 100).toString(),
          priceCurrency: 'CAD',
          availability: 'https://schema.org/PreOrder',
        }
      : undefined,
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url?: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url ? `${process.env.NEXT_PUBLIC_SITE_URL}${item.url}` : undefined,
    })),
  };
}
