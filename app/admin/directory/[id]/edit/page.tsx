import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOrganizationById } from '@/lib/db';
import { DirectoryEditForm } from '@/components/DirectoryEditForm';

export default async function DirectoryEditPage({ params }: { params: { id: string } }) {
  const org = await getOrganizationById(params.id);
  if (!org) notFound();

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/directory" className="text-forest hover:text-forest-dark mb-4 inline-block">
          ← Back to Directory
        </Link>
        <h1 className="text-4xl font-bold text-navy mb-2">Edit Organization</h1>
        <p className="text-gray-600">{org.name}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-8 max-w-2xl">
        <DirectoryEditForm org={org} />
      </div>
    </div>
  );
}
