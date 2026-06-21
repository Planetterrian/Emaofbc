import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join EMA | EMA of BC',
  description: 'Join the Environmental Managers Association of BC.',
};

export default function JoinPage() {
  return (
    <main className="min-h-screen">
      <section className="bg-navy text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Join EMA of BC</h1>
          <p className="text-xl text-gray-200">
            Become part of BC's premier environmental professionals network
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-gray-700 mb-8">
              The membership page is coming soon. It will include details about membership tiers,
              benefits, and a streamlined application process.
            </p>

            <p className="text-lg text-gray-700 mb-8">
              In the meantime, please contact us at{' '}
              <a href="mailto:membership@emaofbc.com" className="text-forest hover:text-forest-dark font-semibold">
                membership@emaofbc.com
              </a>{' '}
              to inquire about membership or schedule a consultation.
            </p>

            <div className="bg-gray-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-navy mb-6">Membership Tiers</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-navy">Corporate: $550/year + GST</h3>
                  <p className="text-gray-600">Multi-person teams in corporate organizations</p>
                </div>
                <div>
                  <h3 className="font-bold text-navy">Sole Proprietor: $375/year + GST</h3>
                  <p className="text-gray-600">Independent consultants and small firms</p>
                </div>
                <div>
                  <h3 className="font-bold text-navy">Non-Profit / NGO: $250/year + GST</h3>
                  <p className="text-gray-600">Environmental organizations and not-for-profits</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
