export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getPublishedContent } from '@/lib/db';
import { createServiceRoleClient } from '@/lib/supabase';
import { ContentEditor } from '@/components/ContentEditor';

export default async function ContentCMSPage() {
  let items = await getPublishedContent(50).catch(() => []);

  try {
    const supabase = createServiceRoleClient();
    const { data } = await supabase.from('content').select('*').order('created_at', { ascending: false });
    if (data) items = data;
  } catch {
    // Fall back to published only
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin" className="text-forest hover:text-forest-dark mb-4 inline-block">
          ← Back to Admin
        </Link>
        <h1 className="text-4xl font-bold text-navy mb-2">Content Manager</h1>
        <p className="text-gray-600">Create and publish news posts, event recaps, and archive items</p>
      </div>
      <ContentEditor items={items} />
    </div>
  );
}
