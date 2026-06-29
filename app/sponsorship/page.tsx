import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sponsorship | EMA of BC',
  description: 'Event sponsorship opportunities with the Environmental Managers Association of BC.',
};

const BENEFITS = [
  { icon: '🎯', title: 'Targeted Visibility', body: 'Reach environmental managers and decision-makers directly, at events relevant to your audience.' },
  { icon: '🤝', title: 'Relationship Building', body: 'Strengthen relationships with clients, partners, and colleagues in a professional setting.' },
  { icon: '📢', title: 'Brand Recognition', body: 'Build awareness within the BC environmental community through event materials and signage.' },
  { icon: '📊', title: 'Industry Leadership', body: 'Position your organization as a leader in environmental excellence and sustainability.' },
];

const TIERS = [
  { name: 'Platinum', price: '$5,000', accent: 'bg-navy', perks: ['Logo on event materials & website', '10 complimentary registrations', 'Speaking opportunity (2–3 min)', 'Premium booth placement', 'Event program recognition'], featured: true },
  { name: 'Gold', price: '$3,000', accent: 'bg-gold', perks: ['Logo on event materials', '6 complimentary registrations', 'Booth placement', 'Event program listing'] },
  { name: 'Silver', price: '$1,500', accent: 'bg-sage', perks: ['Logo on event website', '4 complimentary registrations', 'Booth space'] },
  { name: 'Bronze', price: '$500', accent: 'bg-moss', perks: ['Company name on materials', '2 complimentary registrations'] },
];

const EVENTS = [
  { title: 'Annual Golf Tournament', body: 'Network with environmental professionals on the course. Sponsorship includes team placement and signage.', meta: 'August · 144 attendees' },
  { title: 'Awards Gala & AGM', body: 'Celebrate excellence in environmental management — our flagship annual event and premium sponsorship opportunity.', meta: 'June · 300+ attendees' },
];

export default function SponsorshipPage() {
  return (
    <>
      <section className="bg-forest-gradient text-white">
        <div className="container-px py-16 md:py-24">
          <span className="eyebrow text-sage-light">Partner with us</span>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">Event sponsorship</h1>
          <p className="mt-5 max-w-2xl text-lg text-white/80">
            Showcase your organization to environmental professionals and decision-makers across BC.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-px">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Why sponsor</span>
            <h2 className="mt-3 text-3xl font-bold text-navy md:text-4xl">Sponsorship benefits</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {BENEFITS.map((b) => (
              <div key={b.title} className="card flex gap-4">
                <div className="text-3xl">{b.icon}</div>
                <div>
                  <h3 className="text-lg font-bold text-navy">{b.title}</h3>
                  <p className="mt-1 text-ink-soft">{b.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-mesh pt-0">
        <div className="container-px">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Packages</span>
            <h2 className="mt-3 text-3xl font-bold text-navy md:text-4xl">Sponsorship tiers</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {TIERS.map((t) => (
              <div key={t.name} className={`card card-hover flex flex-col overflow-hidden p-0 ${t.featured ? 'ring-2 ring-forest' : ''}`}>
                <div className={`${t.accent} px-6 py-6 text-white`}>
                  <h3 className="text-2xl font-bold">{t.name}</h3>
                  <div className="mt-1 text-3xl font-bold">{t.price}</div>
                </div>
                <ul className="flex-1 space-y-3 p-6 text-sm text-ink-soft">
                  {t.perks.map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <span className="mt-0.5 font-bold text-forest">✓</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-px">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Opportunities</span>
            <h2 className="mt-3 text-3xl font-bold text-navy md:text-4xl">Sponsorable events</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {EVENTS.map((e) => (
              <div key={e.title} className="card card-hover border-l-4 border-forest">
                <h3 className="text-2xl font-bold text-navy">{e.title}</h3>
                <p className="mt-3 text-ink-soft">{e.body}</p>
                <div className="mt-4 text-sm font-semibold text-forest">{e.meta}</div>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-ink-soft">
            Custom packages available for monthly sessions and workshops — contact us to discuss.
          </p>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-px">
          <div className="rounded-[2rem] bg-forest-gradient px-8 py-14 text-center text-white md:px-16">
            <h2 className="text-3xl font-bold md:text-4xl">Become a sponsor</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/80">Interested in sponsoring an EMA event? Let’s talk options.</p>
            <a href="/sponsorship/inquiry" className="btn btn-lg btn-light mt-6">Submit sponsorship inquiry</a>
          </div>
        </div>
      </section>
    </>
  );
}
