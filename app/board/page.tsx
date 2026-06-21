import type { Metadata } from 'next';
import { getBoardMembers } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Board of Directors | EMA of BC',
  description: 'Meet the leaders and members of the EMA of BC Board of Directors.',
};

async function BoardPage() {
  const boardMembers = await getBoardMembers();

  // Group by role
  const groupedByRole = boardMembers.reduce(
    (acc, member) => {
      const role = member.role || 'Member';
      if (!acc[role]) acc[role] = [];
      acc[role].push(member);
      return acc;
    },
    {} as Record<string, typeof boardMembers>
  );

  const roleOrder = ['President', 'Vice President', 'Treasurer', 'Secretary', 'Director-at-Large', 'Past President'];

  return (
    <main>
      {/* Header */}
      <section className="bg-navy text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Board of Directors</h1>
          <p className="text-xl text-gray-200">
            Volunteer leaders driving EMA's mission to advance environmental excellence
          </p>
        </div>
      </section>

      {/* About Board */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold text-navy mb-6">Our Leadership</h2>
            <p className="text-lg text-gray-700 mb-4">
              The EMA of BC Board of Directors is composed of experienced environmental professionals
              representing diverse sectors including corporate, government, consulting, and non-profit
              organizations.
            </p>
            <p className="text-lg text-gray-700">
              Our board members are dedicated to advancing the association's mission of promoting
              environmental excellence, professional development, and industry collaboration across
              British Columbia.
            </p>
          </div>
        </div>
      </section>

      {/* Board Members */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {roleOrder.map((role) => {
            const members = groupedByRole[role];
            if (!members) return null;

            return (
              <div key={role} className="mb-16">
                <h2 className="text-2xl font-bold text-navy mb-8 flex items-center gap-3">
                  <span className="w-1 h-8 bg-forest rounded-full"></span>
                  {role}
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {members.map((member) => (
                    <div key={member.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                      <div className="mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-navy to-forest rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                          {member.full_name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-navy mb-1">{member.full_name}</h3>
                      <p className="text-forest font-semibold mb-4">{role}</p>

                      {member.org_id && (
                        <p className="text-gray-600 text-sm">
                          Organization: <span className="font-semibold">{member.org_id}</span>
                        </p>
                      )}

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          <a
                            href={`mailto:${member.email}`}
                            className="text-forest hover:text-forest-dark font-semibold"
                          >
                            Contact
                          </a>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Board Responsibilities */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy mb-12 text-center">Board Responsibilities</h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-lg font-bold text-navy mb-3">Strategic Direction</h3>
              <p className="text-gray-600">
                Setting the association's vision, mission, and long-term strategic goals to advance
                environmental excellence.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-lg font-bold text-navy mb-3">Program Oversight</h3>
              <p className="text-gray-600">
                Ensuring quality professional development programming, events, and member services.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-lg font-bold text-navy mb-3">Governance</h3>
              <p className="text-gray-600">
                Maintaining financial health, compliance, and organizational policies that serve our
                members.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default BoardPage;
