import type { Metadata } from 'next';
import { executiveBoard, directorsAtLarge, type BoardMember } from '@/lib/board-members';

export const metadata: Metadata = {
  title: 'Board of Directors | EMA of BC',
  description: 'Meet the leaders and members of the EMA of BC Board of Directors.',
};

function initials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

function MemberCard({ member }: { member: BoardMember }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
      <div className="w-16 h-16 bg-gradient-to-br from-navy to-forest rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
        {initials(member.name)}
      </div>

      <h3 className="text-xl font-bold text-navy mb-1">{member.name}</h3>
      <p className="text-forest font-semibold mb-3">{member.title}</p>
      <p className="text-gray-600 text-sm">{member.company}</p>
    </div>
  );
}

export default function BoardPage() {
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
              As a not-for-profit society, our success heavily relies on the Board of Directors,
              composed of volunteers from our member organizations.
            </p>
            <p className="text-lg text-gray-700">
              Board members are elected by our membership at the annual general meeting and represent
              diverse sectors including industry, government, consulting, laboratories, and law firms
              across British Columbia.
            </p>
          </div>
        </div>
      </section>

      {/* Executive */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-navy mb-8 flex items-center gap-3">
            <span className="w-1 h-8 bg-forest rounded-full"></span>
            Executive
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {executiveBoard.map((member) => (
              <MemberCard key={member.name} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* Directors at Large */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-navy mb-8 flex items-center gap-3">
            <span className="w-1 h-8 bg-forest rounded-full"></span>
            Directors at Large
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {directorsAtLarge.map((member) => (
              <MemberCard key={member.name} member={member} />
            ))}
          </div>
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
