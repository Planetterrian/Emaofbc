import Link from 'next/link';
import type { Metadata } from 'next';
import { getOrganizationWithDirectory } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Member Directory | EMA of BC',
  description:
    'Search and connect with environmental managers and organizations in British Columbia.',
};

export const dynamic = 'force-dynamic';

const GROUPS = [
  { key: 'corporate', label: 'Corporate Members' },
  { key: 'sole_proprietor', label: 'Independent Consultants' },
  { key: 'ngo', label: 'Non-Profit & NGO Members' },
] as const;

async function DirectoryPage() {
  const members = await getOrganizationWithDirectory().catch(() => []);
  const byType: Record<string, any[]> = {
    corporate: members.filter((m: any) => m.type === 'corporate'),
    sole_proprietor: members.filter((m: any) => m.type === 'sole_proprietor'),
    ngo: members.filter((m: any) => m.type === 'ngo'),
  };
  const total = members.length;

  return (
    <>
      <section className="bg-forest-gradient text-white">
        <div className="container-px py-16 md:py-24">
          <span className="eyebrow text-sage-light">Our community</span>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">Member directory</h1>
          <p className="mt-5 max-w-2xl text-lg text-white/80">
            Connect with {total > 0 ? `${total} ` : ''}environmental professionals and organizations across British Columbia.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-px">
          {total === 0 && (
            <div className="rounded-3xl border border-dashed border-forest/20 bg-forest-50/40 p-14 text-center">
              <div className="text-4xl">🌿</div>
              <p className="mt-3 text-lg font-semibold text-navy">The directory is just getting started</p>
              <p className="mt-1 text-ink-soft">Member organizations who opt in will appear here.</p>
            </div>
          )}

          {GROUPS.map(({ key, label }) =>
            byType[key].length > 0 ? (
              <div key={key} className="mb-16">
                <h2 className="flex items-center gap-3 text-2xl font-bold text-navy md:text-3xl">
                  <span className="h-7 w-1.5 rounded-full bg-forest" />
                  {label} <span className="text-ink-soft">({byType[key].length})</span>
                </h2>
                <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {byType[key].map((org: any) => (
                    <MemberCard key={org.id} org={org} />
                  ))}
                </div>
              </div>
            ) : null
          )}
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-px">
          <div className="rounded-[2rem] bg-forest-gradient px-8 py-14 text-center text-white md:px-16">
            <h2 className="text-3xl font-bold md:text-4xl">Get your organization listed</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/80">Join EMA and appear in our member directory.</p>
            <Link href="/join" className="btn btn-lg btn-light mt-6">Join Now</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function MemberCard({ org }: { org: any }) {
  return (
    <Link href={`/directory/${org.id}`} className="card card-hover group block h-full">
      {org.logo_url && (
        <div className="mb-4 flex h-24 items-center justify-center rounded-2xl bg-canvas p-4">
          <img src={org.logo_url} alt={org.name} className="max-h-16 max-w-full object-contain" />
        </div>
      )}
      <h3 className="text-lg font-bold text-navy group-hover:text-forest">{org.name}</h3>
      {org.focus && <p className="mt-2 text-sm text-ink-soft">{org.focus}</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="pill-forest">{org.type === 'sole_proprietor' ? 'Independent' : org.type}</span>
        {org.website && (
          <a
            href={org.website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="pill border border-black/10 text-ink-soft hover:border-forest/40 hover:text-forest"
          >
            Visit ↗
          </a>
        )}
      </div>
    </Link>
  );
}

export default DirectoryPage;
