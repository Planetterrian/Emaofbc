'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const NAV = [
  { href: '/about', label: 'About' },
  { href: '/events', label: 'Events' },
  { href: '/directory', label: 'Directory' },
  { href: '/board', label: 'Board' },
  { href: '/sponsorship', label: 'Sponsorship' },
  { href: '/member-assistant', label: 'AI Assistant' },
  { href: '/contact', label: 'Contact' },
];

function LeafMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="leafg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4ca579" />
          <stop offset="100%" stopColor="#11472f" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#leafg)" />
      <path
        d="M9 22c0-7 5-12 13-13-1 8-6 13-13 13Z"
        fill="#fff"
        fillOpacity="0.95"
      />
      <path d="M9 22C12 18 16 15 21 13" stroke="#11472f" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-md ${
        scrolled
          ? 'bg-white/90 border-b border-black/[0.06] shadow-[0_4px_20px_rgba(16,40,28,0.06)]'
          : 'bg-white/70 border-b border-black/[0.04]'
      }`}
    >
      <div className="container-px flex items-center justify-between py-3.5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <LeafMark className="h-9 w-9 transition-transform group-hover:scale-105" />
          <span className="leading-tight">
            <span className="block text-sm font-extrabold tracking-tight text-navy font-display">
              EMA of BC
            </span>
            <span className="block text-[11px] text-ink-soft">Environmental Managers</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink-soft hover:text-forest transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2.5">
          <Link href="/portal" className="btn btn-md btn-ghost">
            Member Portal
          </Link>
          <Link href="/join" className="btn btn-md btn-primary">
            Become a Member
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full text-navy hover:bg-forest-50"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-black/[0.06] shadow-lg">
          <div className="container-px py-4 flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-forest-50 hover:text-forest"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link href="/portal" onClick={() => setOpen(false)} className="btn btn-md btn-outline">
                Portal
              </Link>
              <Link href="/join" onClick={() => setOpen(false)} className="btn btn-md btn-primary">
                Join
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
