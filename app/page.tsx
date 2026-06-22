import Link from 'next/link';
import { getUpcomingEvents, getActiveOrganizations } from '@/lib/db';
import { formatDate } from 'date-fns';

export const dynamic = 'force-dynamic';

function IconNetwork() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <circle cx="12" cy="5" r="2.4" /><circle cx="5" cy="18" r="2.4" /><circle cx="19" cy="18" r="2.4" />
      <path d="M10.5 6.8 6.5 16M13.5 6.8l4 9.2M7.4 18h9.2" />
    </svg>
  );
}
function IconBook() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v16H6.5A2.5 2.5 0 0 0 4 21.5V5.5Z" />
      <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v16h5.5a2.5 2.5 0 0 1 2.5 2.5V5.5Z" />
    </svg>
  );
}
function IconShield() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M12 3 5 6v5c0 4.4 3 8.3 7 9.5 4-1.2 7-5.1 7-9.5V6l-7-3Z" /><path d="m9 12 2 2 4-4" />
    </svg>
  );
}
function IconSpark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 2c.5 3.8 2.2 5.5 6 6-3.8.5-5.5 2.2-6 6-.5-3.8-2.2-5.5-6-6 3.8-.5 5.5-2.2 6-6Z" />
      <path d="M19 14c.25 1.9 1.1 2.75 3 3-1.9.25-2.75 1.1-3 3-.25-1.9-1.1-2.75-3-3 1.9-.25 2.75-1.1 3-3Z" opacity="0.7" />
    </svg>
  );
}

const AI_TOOLS = [
  { title: 'AI Member Assistant', desc: 'Ask anything about events, membership, PD credits or environmental practice — instant, accurate answers.', href: '/member-assistant' },
  { title: 'Smart Event Picks', desc: 'Personalized recommendations surface the workshops and tours most relevant to your work.', href: '/events' },
  { title: 'AI Event Copy', desc: 'Draft polished event descriptions and invitations from a few details in seconds.', href: '/admin/ai-event-copy' },
  { title: 'AI Newsletter Drafts', desc: 'Turn recent events and activity into a ready-to-send newsletter draft.', href: '/admin/newsletter' },
];

const EVENT_EMOJI: Record<string, string> = {
  monthly_session: '🎤',
  workshop: '🛠️',
  tour: '🚌',
  golf: '⛳',
  gala: '🏆',
};

async function HomePage() {
  const [upcomingEvents, allOrgs] = await Promise.all([
    getUpcomingEvents().catch(() => []),
    getActiveOrganizations().catch(() => []),
  ]);

  const memberLogos = (allOrgs || [])
    .filter((org: any) => org.directory_opt_in && org.logo_url)
    .slice(0, 12);

  return (
    <>
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden bg-forest-gradient text-white">
        <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-forest-light/30 blur-3xl animate-float-slow" />
        <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-sage/20 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        <div className="container-px relative grid gap-12 py-20 md:py-28 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7 animate-fade-up">
            <span className="eyebrow text-sage-light">
              <span className="h-1.5 w-1.5 rounded-full bg-sage-light" />
              British Columbia · Since 2003
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              Advancing environmental
              <span className="block bg-gradient-to-r from-sage-light to-white bg-clip-text text-transparent">
                excellence across BC
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/80">
              The Environmental Managers Association of BC is the province's premier professional
              network — encouraging education, sharing lessons learned, and creating a forum for
              environmental management, now powered by intelligent tools.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/join" className="btn btn-lg btn-light">Become a Member</Link>
              <Link href="/events" className="btn btn-lg border border-white/25 text-white hover:bg-white/10">
                Explore Events
              </Link>
            </div>

            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/15 pt-8">
              {[
                ['20+', 'Years of impact'],
                ['100s', 'Members & orgs'],
                ['PD', 'Credits earned'],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="text-3xl font-bold text-white">{n}</dt>
                  <dd className="mt-1 text-sm text-white/70">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* AI assistant teaser card */}
          <div className="lg:col-span-5 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="mx-auto max-w-md rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-md shadow-[var(--shadow-glow)]">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white/15"><IconSpark /></span>
                EMA AI Assistant
              </div>
              <div className="mt-4 space-y-3">
                <div className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-sm bg-white/20 px-4 py-2.5 text-sm text-white">
                  Which upcoming events earn PD credits?
                </div>
                <div className="w-fit max-w-[88%] rounded-2xl rounded-bl-sm bg-white px-4 py-2.5 text-sm text-ink shadow">
                  Three do — the Soil Washing Facility Tour, the Fall Workshop, and the Monthly
                  Session. Want me to register you or add them to your calendar?
                </div>
              </div>
              <Link href="/member-assistant" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-forest hover:bg-forest-50">
                <IconSpark /> Try the assistant
              </Link>
            </div>
          </div>
        </div>

        {/* Curved divider */}
        <div className="h-10 bg-canvas" style={{ borderTopLeftRadius: '2.5rem', borderTopRightRadius: '2.5rem' }} />
      </section>

      {/* ===== Value props ===== */}
      <section className="section bg-canvas">
        <div className="container-px">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Why join EMA</span>
            <h2 className="mt-3 text-3xl font-bold text-navy md:text-4xl">
              A professional home for environmental managers
            </h2>
            <p className="mt-4 text-ink-soft">
              Connect, learn, and demonstrate your commitment to environmental excellence in BC.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { icon: <IconNetwork />, title: 'Professional Network', body: 'Connect with peers across corporate, government, and NGO sectors. Build relationships that move the industry forward.' },
              { icon: <IconBook />, title: 'Continuing Education', body: 'Earn professional development credits through workshops, monthly sessions, and exclusive site tours.' },
              { icon: <IconShield />, title: 'Due Diligence Defence', body: 'Demonstrate your organization’s commitment to environmental standards and active industry engagement.' },
            ].map((f) => (
              <div key={f.title} className="card card-hover">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-forest-50 text-forest">
                  {f.icon}
                </div>
                <h3 className="mt-5 text-xl font-bold text-navy">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== AI tools ===== */}
      <section className="section bg-navy-dark text-white relative overflow-hidden">
        <div className="absolute -right-32 -top-20 h-96 w-96 rounded-full bg-forest/30 blur-3xl" />
        <div className="container-px relative">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow text-sage-light"><IconSpark /> Intelligent tools</span>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">The first AI-powered environmental association in BC</h2>
            <p className="mt-4 text-white/70">
              We’ve built smart tools into every corner of the experience — for members and organizers alike.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {AI_TOOLS.map((t) => (
              <Link
                key={t.title}
                href={t.href}
                className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition-all hover:-translate-y-1 hover:border-forest-light/50 hover:bg-white/[0.07]"
              >
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-forest text-white shadow-[var(--shadow-glow)]">
                  <IconSpark />
                </span>
                <h3 className="mt-5 text-lg font-bold text-white">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{t.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-sage-light">
                  Explore <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Upcoming events ===== */}
      <section className="section bg-canvas">
        <div className="container-px">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">What’s on</span>
              <h2 className="mt-3 text-3xl font-bold text-navy md:text-4xl">Upcoming events</h2>
            </div>
            <Link href="/events" className="link-arrow">View all events →</Link>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event: any) => {
                const startDate = new Date(event.starts_at);
                return (
                  <Link key={event.id} href={`/events/${event.id}`} className="card card-hover group flex flex-col">
                    <div className="flex items-center justify-between">
                      <span className="pill-forest">
                        <span>{EVENT_EMOJI[event.type] || '📅'}</span>
                        {event.type.replace(/_/g, ' ')}
                      </span>
                      {event.pd_eligible && (
                        <span className="pill bg-gold-light/50 text-gold">PD Eligible</span>
                      )}
                    </div>
                    <h3 className="mt-4 text-xl font-bold text-navy group-hover:text-forest">{event.title}</h3>
                    {event.description && (
                      <p className="mt-2 text-sm leading-relaxed text-ink-soft line-clamp-3">
                        {event.description.slice(0, 120)}…
                      </p>
                    )}
                    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-ink-soft">
                      <span>📅 {formatDate(startDate, 'MMM dd, yyyy')}</span>
                      <span>🕐 {formatDate(startDate, 'h:mm a')}</span>
                      {event.venue && <span>📍 {event.venue}</span>}
                    </div>
                    {event.member_price_cents !== undefined && event.member_price_cents !== null && (
                      <div className="mt-auto border-t border-black/[0.06] pt-4">
                        <span className="text-lg font-bold text-navy">
                          {event.member_price_cents === 0 ? 'Free' : `$${(event.member_price_cents / 100).toFixed(0)}`}
                        </span>
                        {event.member_price_cents > 0 && <span className="ml-1 text-sm text-ink-soft">members</span>}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="mt-12 rounded-3xl border border-dashed border-forest/20 bg-forest-50/40 p-14 text-center">
              <div className="text-4xl">🌿</div>
              <p className="mt-3 text-lg font-semibold text-navy">New events are being planned</p>
              <p className="mt-1 text-ink-soft">Check back soon, or join to be the first to know.</p>
              <Link href="/join" className="btn btn-md btn-primary mt-6">Become a Member</Link>
            </div>
          )}
        </div>
      </section>

      {/* ===== Members ===== */}
      {memberLogos.length > 0 && (
        <section className="section bg-canvas pt-0">
          <div className="container-px">
            <div className="mx-auto max-w-2xl text-center">
              <span className="eyebrow">Our community</span>
              <h2 className="mt-3 text-3xl font-bold text-navy md:text-4xl">Trusted by leading organizations</h2>
            </div>
            <div className="mt-12 grid grid-cols-2 items-center gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {memberLogos.map((org: any) => (
                <Link key={org.id} href={`/directory/${org.id}`} title={org.name}
                  className="flex h-28 items-center justify-center rounded-2xl border border-black/[0.05] bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]">
                  {org.logo_url ? (
                    <img src={org.logo_url} alt={org.name} className="max-h-16 max-w-full object-contain" />
                  ) : (
                    <p className="text-center text-sm font-semibold text-navy">{org.name}</p>
                  )}
                </Link>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/directory" className="link-arrow">View the full member directory →</Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== Final CTA ===== */}
      <section className="section bg-canvas">
        <div className="container-px">
          <div className="relative overflow-hidden rounded-[2rem] bg-forest-gradient px-8 py-16 text-center text-white md:px-16 md:py-20">
            <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-sage/20 blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-bold md:text-4xl">Ready to get involved?</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
                Join hundreds of environmental professionals advancing excellence across British Columbia.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/join" className="btn btn-lg btn-light">Join EMA Today</Link>
                <Link href="/contact" className="btn btn-lg border border-white/25 text-white hover:bg-white/10">Talk to us</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
