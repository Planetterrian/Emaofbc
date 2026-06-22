import type { Metadata } from 'next';
import { getBoardMembers } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Board of Directors | EMA of BC',
  description: 'Meet the leaders and members of the EMA of BC Board of Directors.',
};

export const dynamic = 'force-dynamic';

const ROLE_ORDER = ['President', 'Vice President', 'Treasurer', 'Secretary', 'Director-at-Large', 'Past President'];

const RESPONSIBILITIES = [
  { title: 'Strategic Direction', body: 'Setting the association’s vision, mission, and long-term goals to advance environmental excellence.' },
  { title: 'Program Oversight', body: 'Ensuring quality professional development programming, events, and member services.' },
  { title: 'Governance', body: 'Maintaining financial health, compliance, and organizational policies that serve members.' },
];

async function BoardPage() {
  const boardMembers = await getBoardMembers().catch(() => []);
  const grouped = boardMembers.reduce((acc: Record<string, any[]>, m: any) => {
    const role = m.role || 'Member';
    (acc[role] ||= []).push(m);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <>
      <section className="bg-forest-gradient text-white">
        <div className="container-px py-16 md:py-24">
          <span className="eyebrow text-sage-light">Leadership</span>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">Board of Directors</h1>
          <p className="mt-5 max-w-2xl text-lg text-white/80">
            Volunteer leaders driving EMA’s mission to advance environmental excellence across BC.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-px">
          <div className="card max-w-3xl">
            <h2 className="text-2xl font-bold text-navy">Our leadership</h2>
            <p className="mt-4 text-ink-soft">
              The Board is composed of experienced environmental professionals representing corporate,
              government, consulting, and non-profit organizations — all dedicated to promoting
              environmental excellence, professional development, and collaboration across BC.
            </p>
          </div>

          {boardMembers.length === 0 ? (
            <div className="mt-12 rounded-3xl border border-dashed border-forest/20 bg-forest-50/40 p-14 text-center">
              <div className="text-4xl">🌿</div>
              <p className="mt-3 text-lg font-semibold text-navy">Board members will be listed here soon.</p>
            </div>
          ) : (
            ROLE_ORDER.map((role) =>
              grouped[role] ? (
                <div key={role} className="mt-14">
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-navy">
                    <span className="h-7 w-1.5 rounded-full bg-forest" />
                    {role}
                  </h2>
                  <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {grouped[role].map((m: any) => (
                      <div key={m.id} className="card card-hover">
                        <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-navy to-forest text-xl font-bold text-white">
                          {m.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <h3 className="mt-4 text-xl font-bold text-navy">{m.full_name}</h3>
                        <p className="font-semibold text-forest">{role}</p>
                        <div className="mt-4 border-t border-black/[0.06] pt-4">
                          <a href={`mailto:${m.email}`} className="link-arrow">Contact →</a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null
            )
          )}
        </div>
      </section>

      <section className="section bg-mesh pt-0">
        <div className="container-px">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Governance</span>
            <h2 className="mt-3 text-3xl font-bold text-navy md:text-4xl">Board responsibilities</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {RESPONSIBILITIES.map((r) => (
              <div key={r.title} className="card">
                <h3 className="text-lg font-bold text-navy">{r.title}</h3>
                <p className="mt-2 text-ink-soft">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default BoardPage;
