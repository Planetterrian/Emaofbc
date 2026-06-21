import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | EMA of BC',
};

export default function PrivacyPage() {
  return (
    <main>
      <section className="bg-navy text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
        </div>
      </section>

      <section className="py-12 container mx-auto px-4 max-w-3xl">
        <p className="text-gray-600 mb-8">
          Privacy policy details coming soon. This page will outline how the Environmental Managers
          Association of BC collects, uses, and protects member data in accordance with privacy
          regulations.
        </p>
      </section>
    </main>
  );
}
