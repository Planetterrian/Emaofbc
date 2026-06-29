export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { createServiceRoleClient } from '@/lib/supabase';
import { AwardReviewList } from '@/components/AwardReviewList';

export default async function ReviewAwardsPage() {
  const supabase = createServiceRoleClient();
  const { data: awards } = await supabase
    .from('awards')
    .select('*, organizations(*)')
    .eq('status', 'submitted')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/awards" className="text-forest hover:text-forest-dark mb-4 inline-block">
          ← Back to Awards
        </Link>
        <h1 className="text-4xl font-bold text-navy mb-2">Review Submissions</h1>
        <p className="text-gray-600">{(awards || []).length} submissions awaiting review</p>
      </div>
      <AwardReviewList awards={(awards || []) as any} />
    </div>
  );
}
