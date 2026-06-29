export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { createServiceRoleClient } from '@/lib/supabase';
import { DirectoryEditForm } from '@/components/DirectoryEditForm';

export default async function PendingDirectoryPage() {
  const supabase = createServiceRoleClient();
  const { data: orgs } = await supabase
    .from('organizations')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  const pending = orgs || [];

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/directory" className="text-forest hover:text-forest-dark mb-4 inline-block">
          ← Back to Directory
        </Link>
        <h1 className="text-4xl font-bold text-navy mb-2">Pending Approvals</h1>
        <p className="text-gray-600">{pending.length} organizations awaiting approval</p>
      </div>

      {pending.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
          No pending organizations
        </div>
      ) : (
        <div className="space-y-8">
          {pending.map((org) => (
            <div key={org.id} className="bg-white rounded-lg shadow p-8">
              <h2 className="text-xl font-bold text-navy mb-4">{org.name}</h2>
              <DirectoryEditForm org={org} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
