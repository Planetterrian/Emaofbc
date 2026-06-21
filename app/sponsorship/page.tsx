import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sponsorship | EMA of BC',
  description: 'Event sponsorship opportunities with the Environmental Managers Association of BC.',
};

export default function SponsorshipPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-navy text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Event Sponsorship</h1>
          <p className="text-xl text-gray-200">
            Showcase your organization to environmental professionals across BC
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy mb-12 text-center">Sponsorship Benefits</h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            <div className="flex gap-4">
              <div className="text-3xl">🎯</div>
              <div>
                <h3 className="text-lg font-bold text-navy mb-2">Targeted Visibility</h3>
                <p className="text-gray-600">
                  Reach environmental managers and decision-makers directly. Your brand reaches the
                  right audience at relevant events.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl">🤝</div>
              <div>
                <h3 className="text-lg font-bold text-navy mb-2">Relationship Building</h3>
                <p className="text-gray-600">
                  Strengthen relationships with clients, partners, and industry colleagues in an
                  engaging, professional setting.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl">📢</div>
              <div>
                <h3 className="text-lg font-bold text-navy mb-2">Brand Recognition</h3>
                <p className="text-gray-600">
                  Increase brand awareness within the BC environmental management community. Recognition
                  on event materials and signage.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl">📊</div>
              <div>
                <h3 className="text-lg font-bold text-navy mb-2">Industry Leadership</h3>
                <p className="text-gray-600">
                  Position your organization as a leader in environmental excellence and sustainability
                  in BC.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsorship Tiers */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy mb-12 text-center">Sponsorship Tiers</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Platinum */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition border-t-4 border-blue-600">
              <div className="bg-blue-600 text-white p-6">
                <h3 className="text-2xl font-bold">Platinum</h3>
                <div className="text-3xl font-bold mt-2">$5,000</div>
              </div>

              <div className="p-6">
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>Logo on event materials & website</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>10 complimentary registrations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>Speaking opportunity (2-3 min)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>Premium booth placement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>Event program recognition</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Gold */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition border-t-4 border-yellow-500">
              <div className="bg-yellow-500 text-white p-6">
                <h3 className="text-2xl font-bold">Gold</h3>
                <div className="text-3xl font-bold mt-2">$3,000</div>
              </div>

              <div className="p-6">
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 font-bold">✓</span>
                    <span>Logo on event materials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 font-bold">✓</span>
                    <span>6 complimentary registrations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 font-bold">✓</span>
                    <span>Booth placement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 font-bold">✓</span>
                    <span>Event program listing</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Silver */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition border-t-4 border-gray-400">
              <div className="bg-gray-400 text-white p-6">
                <h3 className="text-2xl font-bold">Silver</h3>
                <div className="text-3xl font-bold mt-2">$1,500</div>
              </div>

              <div className="p-6">
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 font-bold">✓</span>
                    <span>Logo on event website</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 font-bold">✓</span>
                    <span>4 complimentary registrations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 font-bold">✓</span>
                    <span>Booth space</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bronze */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition border-t-4 border-amber-700">
              <div className="bg-amber-700 text-white p-6">
                <h3 className="text-2xl font-bold">Bronze</h3>
                <div className="text-3xl font-bold mt-2">$500</div>
              </div>

              <div className="p-6">
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-700 font-bold">✓</span>
                    <span>Company name on materials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-700 font-bold">✓</span>
                    <span>2 complimentary registrations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy mb-12 text-center">Sponsorable Events</h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white border-2 border-forest rounded-lg p-8">
              <h3 className="text-2xl font-bold text-navy mb-3">Annual Golf Tournament</h3>
              <p className="text-gray-600 mb-4">
                Network with environmental professionals on the course. Over 100 attendees, sponsorship
                includes team placement and signage.
              </p>
              <div className="text-sm text-gray-600">September | 144 attendees</div>
            </div>

            <div className="bg-white border-2 border-forest rounded-lg p-8">
              <h3 className="text-2xl font-bold text-navy mb-3">Awards Gala & AGM</h3>
              <p className="text-gray-600 mb-4">
                Celebrate excellence in environmental management. Premium sponsorship opportunity at our
                flagship annual event.
              </p>
              <div className="text-sm text-gray-600">November | 300+ attendees</div>
            </div>
          </div>

          <p className="text-center text-gray-600 mt-12">
            Custom sponsorship packages available for monthly sessions and workshops. Contact us to discuss.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Become a Sponsor</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Interested in sponsoring an EMA event? Contact us to discuss your sponsorship options.
          </p>
          <a
            href="mailto:sponsorship@emaofbc.com"
            className="inline-block bg-forest hover:bg-forest-dark text-white px-8 py-3 rounded-lg font-semibold text-lg transition"
          >
            Get Sponsorship Information
          </a>
        </div>
      </section>
    </main>
  );
}
