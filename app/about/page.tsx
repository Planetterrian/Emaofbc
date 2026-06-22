import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | EMA of BC',
  description:
    'Learn about the Environmental Managers Association of BC and our mission to advance environmental excellence.',
};

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-navy text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About EMA of BC</h1>
          <p className="text-xl text-gray-200">
            Advancing environmental excellence through professional collaboration
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-navy mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-4">
                The Environmental Managers Association of British Columbia's aim is to encourage
                education, share lessons learned, and create a forum for environmental management
                issues.
              </p>
              <p className="text-lg text-gray-700">
                We assist businesses conducting environmental work to effectively anticipate and
                respond to environmental issues.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-navy mb-6">Our Vision</h2>
              <p className="text-lg text-gray-700 mb-4">
                To encourage education, share knowledge among members and create a forum for
                environmental management issues.
              </p>
            </div>
          </div>

          {/* Objectives */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-navy mb-8">Our Objectives</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                'To provide a network for the generation and exchange of information and ideas among members',
                'To serve as a key resource of environmental information for members',
                'To explore existing and emerging environmental issues',
                'To promote cooperation, communication and understanding among members',
              ].map((objective, index) => (
                <div
                  key={index}
                  className="bg-white border-l-4 border-forest p-6 rounded-lg shadow-sm flex gap-4"
                >
                  <span className="text-2xl font-bold text-forest">{index + 1}</span>
                  <p className="text-gray-700">{objective}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-forest/10 border-2 border-forest p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-navy mb-4">Environmental Due Diligence Defence</h3>
            <p className="text-lg text-gray-700">
              Active participation in EMA demonstrates your organization's commitment to environmental
              excellence and professional standards. Membership provides evidence of industry engagement
              and proactive environmental management — a valuable asset in due diligence assessments and
              regulatory dealings.
            </p>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold text-navy mb-6">Our History</h2>
            <p className="text-lg text-gray-700 mb-4">
              The Environmental Managers Association of BC is a non-profit organization founded in the
              early 1990s, when environmental professionals sought to share their environmental
              management experiences and learn from one another.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              Originally called "iciEMA," the association was created by a group of environmental
              managers performing environmental work in the industrial, commercial, and institutional
              sectors. As operations expanded, membership criteria opened up to include a broader range
              of environmental companies and others conducting environmental work — including
              environmental consulting firms, laboratories, law firms, and other service providers.
            </p>
            <p className="text-lg text-gray-700">
              With this expansion, the number of member companies immediately doubled, prompting the
              name change to the Environmental Managers Association (EMA) of BC. Today the organization
              is governed by the EMA of BC Purposes &amp; Bylaws, and its Board of Directors is elected
              by the membership at the annual general meeting.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy mb-12 text-center">What We Do</h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg border-l-4 border-forest">
              <h3 className="text-xl font-bold text-navy mb-3">Professional Development</h3>
              <p className="text-gray-600 mb-3">
                Monthly sessions, workshops, and training on environmental topics, regulatory updates,
                and best practices. Earn professional development credits recognized by industry.
              </p>
              <Link href="/events" className="text-forest hover:text-forest-dark font-semibold">
                View Events →
              </Link>
            </div>

            <div className="bg-white p-8 rounded-lg border-l-4 border-forest">
              <h3 className="text-xl font-bold text-navy mb-3">Networking</h3>
              <p className="text-gray-600 mb-3">
                Connect with environmental professionals across corporate, government, consulting, and
                non-profit sectors. Build relationships that drive collaboration and innovation.
              </p>
              <Link href="/directory" className="text-forest hover:text-forest-dark font-semibold">
                View Directory →
              </Link>
            </div>

            <div className="bg-white p-8 rounded-lg border-l-4 border-forest">
              <h3 className="text-xl font-bold text-navy mb-3">Industry Recognition</h3>
              <p className="text-gray-600 mb-3">
                Annual Awards Gala celebrating excellence in environmental management. Recognize and
                honor outstanding contributions to the field.
              </p>
              <a href="#" className="text-forest hover:text-forest-dark font-semibold">
                Learn More →
              </a>
            </div>

            <div className="bg-white p-8 rounded-lg border-l-4 border-forest">
              <h3 className="text-xl font-bold text-navy mb-3">Member Benefits</h3>
              <p className="text-gray-600 mb-3">
                Discounted event pricing, access to member-only content, professional development
                credits, and sponsorship opportunities.
              </p>
              <Link href="#benefits" className="text-forest hover:text-forest-dark font-semibold">
                View All Benefits →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Member Types */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy mb-12 text-center">Who We Serve</h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-bold text-navy mb-4">Corporate Organizations</h3>
              <p className="text-gray-600 mb-4">
                Multi-person teams managing environmental compliance, sustainability, and risk at
                corporate entities.
              </p>
              <div className="bg-blue-50 p-4 rounded border border-blue-200">
                <div className="text-sm font-semibold text-blue-900 mb-2">Annual Membership</div>
                <div className="text-2xl font-bold text-blue-900">$550</div>
                <div className="text-xs text-blue-800 mt-1">+ GST</div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-bold text-navy mb-4">Sole Proprietors</h3>
              <p className="text-gray-600 mb-4">
                Independent environmental consultants and sole proprietor firms providing specialized
                expertise.
              </p>
              <div className="bg-green-50 p-4 rounded border border-green-200">
                <div className="text-sm font-semibold text-green-900 mb-2">Annual Membership</div>
                <div className="text-2xl font-bold text-green-900">$375</div>
                <div className="text-xs text-green-800 mt-1">+ GST</div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-bold text-navy mb-4">Non-Profits & NGOs</h3>
              <p className="text-gray-600 mb-4">
                Environmental organizations and not-for-profit entities committed to conservation and
                sustainability.
              </p>
              <div className="bg-purple-50 p-4 rounded border border-purple-200">
                <div className="text-sm font-semibold text-purple-900 mb-2">Annual Membership</div>
                <div className="text-2xl font-bold text-purple-900">$250</div>
                <div className="text-xs text-purple-800 mt-1">+ GST</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Join?</h2>
          <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
            Become part of BC's premier environmental professionals network.
          </p>
          <Link
            href="/join"
            className="inline-block bg-white hover:bg-gray-100 text-forest px-8 py-3 rounded-lg font-semibold text-lg transition"
          >
            Join EMA Today
          </Link>
        </div>
      </section>
    </main>
  );
}
