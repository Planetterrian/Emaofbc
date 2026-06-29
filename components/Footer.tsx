import Link from 'next/link';
import { NewsletterSignup } from '@/components/NewsletterSignup';

function LeafMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#1f6b48" />
      <path d="M9 22c0-7 5-12 13-13-1 8-6 13-13 13Z" fill="#fff" fillOpacity="0.95" />
      <path d="M9 22C12 18 16 15 21 13" stroke="#11472f" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-dark text-white">
      {/* Newsletter band */}
      <div className="container-px">
        <div className="relative -mb-12 translate-y-[-3rem] rounded-3xl bg-forest-gradient px-7 py-10 md:px-14 md:py-12 shadow-[var(--shadow-glow)] overflow-hidden">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white">Stay in the loop</h3>
              <p className="mt-1 max-w-md text-sm text-white/80">
                Get upcoming events, workshops, and environmental insights delivered to your inbox.
              </p>
            </div>
            <NewsletterSignup />
          </div>
        </div>
      </div>

      <div className="container-px pt-24 pb-12">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <LeafMark className="h-9 w-9" />
              <span className="leading-tight">
                <span className="block text-sm font-extrabold tracking-tight">EMA of BC</span>
                <span className="block text-[11px] text-white/60">Environmental Managers</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-white/70">
              Encouraging education, sharing lessons learned, and creating a forum for environmental
              management across British Columbia since the 1990s.
            </p>
            <a
              href="https://www.linkedin.com/company/ema-of-bc/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.3c0-1.27-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21H9V9Z" /></svg>
              Follow on LinkedIn
            </a>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white">Explore</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/about" className="text-white/70 hover:text-white">About Us</Link></li>
              <li><Link href="/events" className="text-white/70 hover:text-white">Events</Link></li>
              <li><Link href="/directory" className="text-white/70 hover:text-white">Member Directory</Link></li>
              <li><Link href="/board" className="text-white/70 hover:text-white">The Board</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white">Membership</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/join" className="text-white/70 hover:text-white">Become a Member</Link></li>
              <li><Link href="/portal" className="text-white/70 hover:text-white">Member Portal</Link></li>
              <li><Link href="/member-assistant" className="text-white/70 hover:text-white">Ask the AI Assistant</Link></li>
              <li><Link href="/sponsorship" className="text-white/70 hover:text-white">Sponsorship</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white">Contact</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-white/70">
              <li><a href="mailto:info@emaofbc.com" className="hover:text-white">info@emaofbc.com</a></li>
              <li>Vancouver, British Columbia</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-7">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-white/50 md:flex-row">
            <p>&copy; {currentYear} Environmental Managers Association of BC. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
