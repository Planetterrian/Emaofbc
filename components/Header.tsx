import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-navy rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-bold text-navy">EMA of BC</div>
            <div className="text-xs text-gray-600">Environmental Managers</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-gray-700 hover:text-navy font-medium">
            Home
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-navy font-medium">
            About
          </Link>
          <Link href="/events" className="text-gray-700 hover:text-navy font-medium">
            Events
          </Link>
          <Link href="/directory" className="text-gray-700 hover:text-navy font-medium">
            Directory
          </Link>
          <Link href="/board" className="text-gray-700 hover:text-navy font-medium">
            Board
          </Link>
          <Link href="/sponsorship" className="text-gray-700 hover:text-navy font-medium">
            Sponsorship
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-navy font-medium">
            Contact
          </Link>
        </nav>

        <Link
          href="/join"
          className="bg-forest hover:bg-forest-dark text-white px-6 py-2 rounded-lg font-medium transition"
        >
          Join
        </Link>
      </div>
    </header>
  );
}
