import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getOrganizationById } from '@/lib/db';
import { generateBreadcrumbSchema } from '@/lib/schema';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const org = await getOrganizationById(params.id);
  return {
    title: org ? `${org.name} | EMA Member Directory` : 'Organization Not Found',
    description: org?.focus || `Member organization in the EMA of BC directory.`,
  };
}

export default async function DirectoryDetailPage({ params }: { params: { id: string } }) {
  const org = await getOrganizationById(params.id);

  if (!org || !org.directory_opt_in || org.status !== 'active') {
    notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbSchema([
              { name: 'Home', url: '/' },
              { name: 'Directory', url: '/directory' },
              { name: org.name },
            ])
          ),
        }}
      />

      <section className="bg-forest-gradient text-white">
        <div className="container-px py-16 md:py-24">
          <Link href="/directory" className="text-white/70 hover:text-white text-sm">
            ← Back to directory
          </Link>
          <h1 className="mt-4 text-4xl font-extrabold md:text-5xl">{org.name}</h1>
          <p className="mt-3 text-lg text-white/80 capitalize">{org.type.replace(/_/g, ' ')} member</p>
        </div>
      </section>

      <section className="section">
        <div className="container-px max-w-3xl">
          <div className="card">
            {org.logo_url && (
              <div className="mb-6 flex h-32 items-center justify-center rounded-2xl bg-canvas p-6">
                <img src={org.logo_url} alt={`${org.name} logo`} className="max-h-24 max-w-full object-contain" />
              </div>
            )}

            {org.focus && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-navy">About</h2>
                <p className="mt-2 text-ink-soft">{org.focus}</p>
              </div>
            )}

            <dl className="grid gap-4 sm:grid-cols-2">
              {org.website && (
                <div>
                  <dt className="text-xs font-semibold uppercase text-ink-soft">Website</dt>
                  <dd>
                    <a
                      href={org.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-forest hover:underline"
                    >
                      Visit website ↗
                    </a>
                  </dd>
                </div>
              )}
              {org.employee_count_band && (
                <div>
                  <dt className="text-xs font-semibold uppercase text-ink-soft">Team size</dt>
                  <dd className="font-semibold text-navy">{org.employee_count_band} employees</dd>
                </div>
              )}
              {org.address && (
                <div className="sm:col-span-2">
                  <dt className="text-xs font-semibold uppercase text-ink-soft">Location</dt>
                  <dd className="text-navy">{org.address}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
