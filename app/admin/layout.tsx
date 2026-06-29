import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin | EMA of BC',
  description: 'EMA of BC admin console for managing events, memberships, and organization.',
};

const MENU = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/memberships', label: 'Memberships', icon: '💳' },
  { href: '/admin/events', label: 'Events', icon: '📅' },
  { href: '/admin/directory', label: 'Directory', icon: '👥' },
  { href: '/admin/awards', label: 'Awards', icon: '🏆' },
  { href: '/admin/sponsorships', label: 'Sponsorships', icon: '⭐' },
  { href: '/admin/content', label: 'Content', icon: '📝' },
  { href: '/admin/board', label: 'Board Analytics', icon: '📈' },
  { href: '/admin/newsletter', label: 'Newsletter Studio', icon: '📧' },
  { href: '/admin/ai-event-copy', label: 'AI Copy Generator', icon: '✨' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-canvas">
      <aside className="hidden w-64 shrink-0 flex-col bg-navy-dark text-white md:flex">
        <div className="flex items-center gap-2.5 border-b border-white/10 px-6 py-5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-forest text-sm font-bold text-white">E</span>
          <div className="leading-tight">
            <div className="text-sm font-extrabold">EMA Admin</div>
            <div className="text-[11px] text-white/50">Console</div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {MENU.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-white/10 p-4">
          <Link href="/" className="flex items-center gap-2 text-sm text-white/60 transition hover:text-white">
            ← Back to site
          </Link>
        </div>
      </aside>

      <div className="flex-1 overflow-auto">
        {/* Mobile admin bar */}
        <div className="flex items-center justify-between border-b border-black/[0.06] bg-white px-5 py-3 md:hidden">
          <span className="font-bold text-navy">EMA Admin</span>
          <Link href="/" className="text-sm text-ink-soft">← Site</Link>
        </div>
        <div className="p-6 md:p-10">{children}</div>
      </div>
    </div>
  );
}
