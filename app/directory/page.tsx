import Link from 'next/link';
import type { Metadata } from 'next';
import { getOrganizationWithDirectory } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Member Directory | EMA of BC',
  description:
    'Search and connect with environmental managers and organizations in British Columbia.',
};

async function DirectoryPage() {
  const members = await getOrganizationWithDirectory();

  // Group by type
  const membersByType = {
    corporate: members.filter((m) => m.type === 'corporate'),
    sole_proprietor: members.filter((m) => m.type === 'sole_proprietor'),
    ngo: members.filter((m) => m.type === 'ngo'),
  };

  return (
    <main>
      {/* Header */}
      <section className="bg-navy text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Member Directory</h1>
          <p className="text-xl text-gray-200">
            Connect with environmental professionals and organizations across BC
          </p>
        </div>
      </section>

      {/* Directory */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Corporate */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-navy mb-8 flex items-center gap-3">
              <span className="w-1 h-8 bg-forest rounded-full"></span>
              Corporate Members ({membersByType.corporate.length})
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {membersByType.corporate.map((org) => (
                <MemberCard key={org.id} org={org} />
              ))}
            </div>
          </div>

          {/* Sole Proprietor */}
          {membersByType.sole_proprietor.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-navy mb-8 flex items-center gap-3">
                <span className="w-1 h-8 bg-forest rounded-full"></span>
                Independent Consultants ({membersByType.sole_proprietor.length})
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {membersByType.sole_proprietor.map((org) => (
                  <MemberCard key={org.id} org={org} />
                ))}
              </div>
            </div>
          )}

          {/* NGO/Non-profit */}
          {membersByType.ngo.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-navy mb-8 flex items-center gap-3">
                <span className="w-1 h-8 bg-forest rounded-full"></span>
                Non-Profit & NGO Members ({membersByType.ngo.length})
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {membersByType.ngo.map((org) => (
                  <MemberCard key={org.id} org={org} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Join CTA */}
      <section className="bg-forest text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Become Part of Our Directory</h2>
          <p className="text-lg text-gray-100 mb-8">
            Join EMA and get your organization listed in our member directory
          </p>
          <Link
            href="/join"
            className="inline-block bg-white hover:bg-gray-100 text-forest px-8 py-3 rounded-lg font-semibold transition"
          >
            Join Now
          </Link>
        </div>
      </section>
    </main>
  );
}

function MemberCard({ org }: { org: any }) {
  return (
    <Link href={`/directory/${org.id}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-forest transition h-full group">
        {org.logo_url && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4 h-24 flex items-center justify-center">
            <img
              src={org.logo_url}
              alt={org.name}
              className="max-w-full max-h-20 object-contain"
            />
          </div>
        )}

        <h3 className="text-lg font-bold text-navy mb-2 group-hover:text-forest transition">
          {org.name}
        </h3>

        {org.focus && <p className="text-sm text-gray-600 mb-4">{org.focus}</p>}

        <div className="flex flex-wrap gap-2">
          <span className="inline-block px-2 py-1 bg-forest/10 text-forest text-xs font-semibold rounded">
            {org.type === 'sole_proprietor' ? 'Independent' : org.type}
          </span>
          {org.website && (
            <a
              href={org.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-2 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded hover:bg-blue-100 transition"
              onClick={(e) => e.stopPropagation()}
            >
              Visit
            </a>
          )}
        </div>
      </div>
    </Link>
  );
}

export default DirectoryPage;
