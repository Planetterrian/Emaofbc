import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | EMA of BC',
  description: 'Get in touch with the Environmental Managers Association of BC.',
};

export default function ContactPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-navy text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-gray-200">
            Get in touch with the Environmental Managers Association of BC
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-navy mb-8">Get in Touch</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-navy mb-2">Email</h3>
                  <a
                    href="mailto:info@emaofbc.com"
                    className="text-forest hover:text-forest-dark font-semibold text-lg"
                  >
                    info@emaofbc.com
                  </a>
                  <p className="text-gray-600 mt-1">General inquiries</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-navy mb-2">Membership</h3>
                  <a
                    href="mailto:membership@emaofbc.com"
                    className="text-forest hover:text-forest-dark font-semibold text-lg"
                  >
                    membership@emaofbc.com
                  </a>
                  <p className="text-gray-600 mt-1">Join, renew, or membership questions</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-navy mb-2">Events</h3>
                  <a
                    href="mailto:events@emaofbc.com"
                    className="text-forest hover:text-forest-dark font-semibold text-lg"
                  >
                    events@emaofbc.com
                  </a>
                  <p className="text-gray-600 mt-1">Event registration and questions</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-navy mb-2">Sponsorship</h3>
                  <a
                    href="mailto:sponsorship@emaofbc.com"
                    className="text-forest hover:text-forest-dark font-semibold text-lg"
                  >
                    sponsorship@emaofbc.com
                  </a>
                  <p className="text-gray-600 mt-1">Event sponsorship opportunities</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-navy mb-2">Phone</h3>
                  <a href="tel:+16045551234" className="text-forest hover:text-forest-dark font-semibold text-lg">
                    (604) 555-1234
                  </a>
                  <p className="text-gray-600 mt-1">Monday–Friday, 9 AM–5 PM PT</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-navy mb-2">Mailing Address</h3>
                  <p className="text-gray-700">
                    Environmental Managers Association of BC
                    <br />
                    Suite 100, 1234 West Pender Street
                    <br />
                    Vancouver, BC V6E 4R4
                    <br />
                    Canada
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h2 className="text-3xl font-bold text-navy mb-8">Frequently Accessed</h2>

              <div className="space-y-4">
                <a
                  href="/join"
                  className="block bg-forest hover:bg-forest-dark text-white p-6 rounded-lg font-semibold transition"
                >
                  → Join EMA
                </a>
                <a
                  href="/renew"
                  className="block bg-forest hover:bg-forest-dark text-white p-6 rounded-lg font-semibold transition"
                >
                  → Renew Membership
                </a>
                <a
                  href="/events"
                  className="block bg-navy hover:bg-navy-dark text-white p-6 rounded-lg font-semibold transition"
                >
                  → View Events
                </a>
                <a
                  href="/directory"
                  className="block bg-navy hover:bg-navy-dark text-white p-6 rounded-lg font-semibold transition"
                >
                  → Member Directory
                </a>
                <a
                  href="/sponsorship"
                  className="block bg-navy hover:bg-navy-dark text-white p-6 rounded-lg font-semibold transition"
                >
                  → Sponsorship Opportunities
                </a>
              </div>

              <div className="mt-12 p-8 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-bold text-navy mb-3">Response Time</h3>
                <p className="text-gray-600">
                  We aim to respond to all inquiries within 1–2 business days during regular office
                  hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="h-96 bg-gray-200">
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-gray-600">Map placeholder</p>
        </div>
      </section>
    </main>
  );
}
