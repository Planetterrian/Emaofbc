import type { Metadata } from 'next';
import { executiveBoard, directorsAtLarge, type BoardMember } from '@/lib/board-members';

export const metadata: Metadata = {
  title: 'Board of Directors | EMA of BC',
  description: 'Meet the leaders and members of the EMA of BC Board of Directors.',
};

const RESPONSIBILITIES = [
  { title: "Strategic Direction", body: "Setting the association’s vision, mission, and long-term goals to advance environmental excellence." },
  { title: "Program Oversight", body: "Ensuring quality professional development programming, events, and member services." },
  { title: "Governance", body: "Maintaining financial health, compliance, and organizational policies that serve members." },
];

function initials(name: string): string {
  return name
    .split(‘ ‘)
    .map((n) => n[0])
    .join(‘’)
    .toUpperCase();
}

function MemberCard({ member }: { member: BoardMember }) {
  return (
    <div className="card card-hover">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-navy to-forest text-xl font-bold text-white">
        {initials(member.name)}
      </div>
      <h3 className="mt-4 text-xl font-bold text-navy">{member.name}</h3>
      <p className="font-semibold text-forest">{member.title}</p>
      <p className="text-sm text-ink-soft mt-2">{member.company}</p>
    </div>
  );
}

function BoardPage() {

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
              As a not-for-profit society, our success heavily relies on the Board of Directors,
              composed of volunteers from our member organizations.
            </p>
          </div>

          <div className="mt-14">
            <h2 className="flex items-center gap-3 text-2xl font-bold text-navy">
              <span className="h-7 w-1.5 rounded-full bg-forest" />
              Executive
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {executiveBoard.map((member) => (
                <MemberCard key={member.name} member={member} />
              ))}
            </div>
          </div>

          <div className="mt-14">
            <h2 className="flex items-center gap-3 text-2xl font-bold text-navy">
              <span className="h-7 w-1.5 rounded-full bg-forest" />
              Directors at Large
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {directorsAtLarge.map((member) => (
                <MemberCard key={member.name} member={member} />
              ))}
            </div>
          </div>
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
