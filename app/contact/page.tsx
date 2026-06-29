import type { Metadata } from 'next';
import { ContactForm } from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact | EMA of BC',
  description: 'Get in touch with the Environmental Managers Association of BC.',
};

const CONTACTS = [
  { label: 'General inquiries', email: 'info@emaofbc.com' },
  { label: 'Join, renew & membership', email: 'membership@emaofbc.com' },
  { label: 'Event registration', email: 'events@emaofbc.com' },
  { label: 'Sponsorship opportunities', email: 'sponsorship@emaofbc.com' },
];


export default function ContactPage() {
  return (
    <>
      <section className="bg-forest-gradient text-white">
        <div className="container-px py-16 md:py-24">
          <span className="eyebrow text-sage-light">Contact</span>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">Get in touch</h1>
          <p className="mt-5 max-w-2xl text-lg text-white/80">
            Questions about membership, events, or sponsorship? We aim to respond within 1–2 business days.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-px grid gap-10 lg:grid-cols-2">
          <div>
            <span className="eyebrow">Email us</span>
            <h2 className="mt-3 text-2xl font-bold text-navy">Reach the right team</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {CONTACTS.map((c) => (
                <a key={c.email} href={`mailto:${c.email}`} className="card card-hover block">
                  <div className="text-sm font-semibold text-ink-soft">{c.label}</div>
                  <div className="mt-1 font-bold text-forest">{c.email}</div>
                </a>
              ))}
            </div>

            <div className="mt-8 card">
              <h3 className="text-lg font-bold text-navy">Phone</h3>
              <a href="tel:+16049982226" className="mt-2 text-lg font-semibold text-forest hover:text-forest-dark transition">
                604-998-2226
              </a>
              <p className="text-sm text-ink-soft mt-1">Monday–Friday, 9 AM–5 PM PT</p>
            </div>

            <div className="mt-8 card">
              <h3 className="text-lg font-bold text-navy">Mailing address</h3>
              <p className="mt-2 text-ink-soft">
                Environmental Managers Association of BC<br />
                P.O. Box 3741<br />
                Vancouver, BC V6B 3Z1<br />
                Canada
              </p>
              <a
                href="https://www.linkedin.com/company/ema-of-bc/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-arrow mt-4"
              >
                Connect on LinkedIn →
              </a>
            </div>
          </div>

          <div>
            <span className="eyebrow">Send a message</span>
            <h2 className="mt-3 text-2xl font-bold text-navy">Contact form</h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
