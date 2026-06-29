import { getUpcomingEvents, getPublishedContent } from './db';
import { MEMBERSHIP_TIERS } from './membership';

export async function buildAssistantContext(): Promise<string> {
  const [events, content] = await Promise.all([
    getUpcomingEvents().catch(() => []),
    getPublishedContent(10).catch(() => []),
  ]);

  const tierLines = Object.values(MEMBERSHIP_TIERS)
    .map((tier) => `- ${tier.name}: $${(tier.priceCents / 100).toFixed(0)} CAD/year (${tier.description})`)
    .join('\n');

  const eventLines =
    events.length > 0
      ? events
          .map((e) => {
            const date = new Date(e.starts_at).toLocaleDateString('en-CA', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
            const price =
              e.member_price_cents != null
                ? e.member_price_cents === 0
                  ? 'Free'
                  : `$${(e.member_price_cents / 100).toFixed(0)} members`
                : 'Pricing TBA';
            return `- ${e.title} (${e.type.replace(/_/g, ' ')}, ${date}, ${e.venue || 'TBA'}) — ${price}${e.pd_eligible ? ', PD eligible' : ''}`;
          })
          .join('\n')
      : '- No upcoming events listed yet. Check emaofbc.com/events.';

  const contentLines =
    content.length > 0
      ? content.map((c) => `- ${c.title} (${c.type})`).join('\n')
      : '- See emaofbc.com/about for mission and benefits.';

  return `EMA of BC (Environmental Managers Association of BC) is a non-profit professional association for environmental managers in British Columbia, founded in the early 1990s.

Membership Tiers:
${tierLines}

Member Benefits:
- Access to events at member pricing
- Professional development (PD) credits at eligible events
- Optional member directory listing
- Networking with environmental professionals across BC
- Newsletters and industry updates

Upcoming Events:
${eventLines}

Recent Content:
${contentLines}

Contact: membership@emaofbc.com | info@emaofbc.com
Website: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://emaofbc.com'}`;
}

export async function buildNewsletterInputs(): Promise<{
  recentEvents: string;
  memberUpdates: string;
}> {
  const [events, content] = await Promise.all([
    getUpcomingEvents().catch(() => []),
    getPublishedContent(5).catch(() => []),
  ]);

  const recentEvents =
    events.length > 0
      ? events
          .map((e) => `- ${e.title} (${new Date(e.starts_at).toLocaleDateString('en-CA')})`)
          .join('\n')
      : '- No upcoming events scheduled';

  const memberUpdates =
    content.length > 0
      ? content.map((c) => `- ${c.title}`).join('\n')
      : '- Member activity updates from recent EMA programs';

  return { recentEvents, memberUpdates };
}
