import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin | EMA of BC',
  description: 'EMA of BC admin console for managing events, memberships, and organization.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/memberships', label: 'Memberships', icon: '💳' },
    { href: '/admin/events', label: 'Events', icon: '📅' },
    { href: '/admin/directory', label: 'Directory', icon: '👥' },
    { href: '/admin/awards', label: 'Awards', icon: '🏆' },
    { href: '/admin/sponsorships', label: 'Sponsorships', icon: '⭐' },
    { href: '/admin/board', label: 'Board Analytics', icon: '📈' },
    { href: '/admin/newsletter', label: 'Newsletter Studio', icon: '📧' },
    { href: '/admin/ai-event-copy', label: 'AI Copy Generator', icon: '✨' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-navy text-white shadow-lg">
        <div className="p-6 border-b border-navy-dark">
          <h1 className="text-xl font-bold">EMA Admin</h1>
          <p className="text-sm text-gray-300 mt-1">v1.0 Beta</p>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-navy-dark transition text-gray-100 hover:text-white"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 mt-8 border-t border-navy-dark">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
          >
            ← Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
