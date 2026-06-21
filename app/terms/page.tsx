import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | EMA of BC',
};

export default function TermsPage() {
  return (
    <main>
      <section className="bg-navy text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Terms of Service</h1>
        </div>
      </section>

      <section className="py-12 container mx-auto px-4 max-w-3xl">
        <p className="text-gray-600 mb-8">
          Terms of service details coming soon. This page will outline the terms and conditions for
          using the Environmental Managers Association of BC website and services.
        </p>
      </section>
    </main>
  );
}
