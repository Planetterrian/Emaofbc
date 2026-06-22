import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | EMA of BC',
  description:
    'Learn about the Environmental Managers Association of BC and our mission to advance environmental excellence.',
};

const TIERS = [
  { name: 'Corporate Organizations', price: '$550', blurb: 'Multi-person teams managing environmental compliance, sustainability, and risk at corporate entities.' },
  { name: 'Sole Proprietors', price: '$375', blurb: 'Independent environmental consultants and sole-proprietor firms providing specialized expertise.' },
  { name: 'Non-Profits & NGOs', price: '$250', blurb: 'Environmental organizations and not-for-profit entities committed to conservation and sustainability.' },
];

const WHAT_WE_DO = [
  { title: 'Professional Development', body: 'Monthly sessions, workshops, and training on environmental topics, regulatory updates, and best practices — with recognized PD credits.', href: '/events', cta: 'View events' },
  { title: 'Networking', body: 'Connect across corporate, government, consulting, and non-profit sectors. Build relationships that drive collaboration.', href: '/directory', cta: 'View directory' },
  { title: 'Industry Recognition', body: 'Our annual Awards Gala celebrates excellence in environmental management and honours outstanding contributions.', href: '/events', cta: 'Learn more' },
  { title: 'Member Benefits', body: 'Discounted event pricing, member-only content, professional development credits, and sponsorship opportunities.', href: '/join', cta: 'See benefits' },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-forest-gradient text-white">
        <div className="container-px py-16 md:py-24">
          <span className="eyebrow text-sage-light">About us</span>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight md:text-5xl">
            Advancing environmental excellence through professional collaboration
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/80">
            The Environmental Managers Association of BC encourages education, shares lessons learned,
            and creates a forum for environmental management across British Columbia.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-px grid gap-10 md:grid-cols-2">
          <div className="card">
            <span className="eyebrow">Our mission</span>
            <h2 className="mt-3 text-2xl font-bold text-navy">A forum for environmental professionals</h2>
            <p className="mt-4 text-ink-soft">
              To advance environmental excellence and professional development among environmental
              managers in BC through networking, education, and industry collaboration — a place to
              share knowledge, develop skills, and establish best practices.
            </p>
          </div>
          <div className="card">
            <span className="eyebrow">Our vision</span>
            <h2 className="mt-3 text-2xl font-bold text-navy">The premier association in BC</h2>
            <p className="mt-4 text-ink-soft">
              To be the premier professional association for environmental managers in British Columbia,
              recognized for advancing environmental due diligence and sustainability across all sectors.
            </p>
          </div>
        </div>

        <div className="container-px mt-10">
          <div className="rounded-3xl border border-forest/20 bg-forest-50 p-8 md:p-10">
            <h3 className="text-2xl font-bold text-navy">Environmental Due Diligence Defence</h3>
            <p className="mt-3 max-w-3xl text-ink-soft">
              Active participation in EMA demonstrates your organization’s commitment to environmental
              excellence and professional standards. Membership provides evidence of industry engagement
              and proactive environmental management — a valuable asset in due-diligence assessments and
              regulatory dealings.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-mesh pt-0">
        <div className="container-px">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">What we do</span>
            <h2 className="mt-3 text-3xl font-bold text-navy md:text-4xl">Four ways we serve members</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {WHAT_WE_DO.map((w) => (
              <div key={w.title} className="card card-hover">
                <h3 className="text-xl font-bold text-navy">{w.title}</h3>
                <p className="mt-2 text-ink-soft">{w.body}</p>
                <Link href={w.href} className="link-arrow mt-4">{w.cta} →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-px">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Who we serve</span>
            <h2 className="mt-3 text-3xl font-bold text-navy md:text-4xl">Membership for every kind of organization</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TIERS.map((t) => (
              <div key={t.name} className="card card-hover flex flex-col">
                <h3 className="text-xl font-bold text-navy">{t.name}</h3>
                <p className="mt-3 text-sm text-ink-soft">{t.blurb}</p>
                <div className="mt-6 border-t border-black/[0.06] pt-5">
                  <div className="text-3xl font-bold text-forest">{t.price}<span className="text-base font-medium text-ink-soft"> /yr + GST</span></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/join" className="btn btn-lg btn-primary">Become a Member</Link>
          </div>
        </div>
      </section>
    </>
  );
}
