import {
  getActiveOrganizations,
  getPublishedEvents,
  getPublishedContent,
} from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function BoardAnalyticsPage() {
  const [orgs, events, content] = await Promise.all([
    getActiveOrganizations(),
    getPublishedEvents(),
    getPublishedContent(5),
  ]);

  const activeMembers = orgs.filter((org) => org.status === 'active').length;
  const totalEvents = events.length;
  const pastEvents = events.filter(
    (e) => new Date(e.starts_at) < new Date() || e.status === 'past'
  ).length;

  const membersByType = {
    corporate: orgs.filter((o) => o.type === 'corporate').length,
    sole_proprietor: orgs.filter((o) => o.type === 'sole_proprietor').length,
    ngo: orgs.filter((o) => o.type === 'ngo').length,
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-navy mb-2">Board Analytics</h1>
        <p className="text-gray-600">
          Key metrics and performance overview for board members
        </p>
      </div>

      {/* Overview KPIs */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-forest">
          <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Active Members</p>
          <p className="text-4xl font-bold text-forest">{activeMembers}</p>
          <p className="text-xs text-gray-500 mt-2">Organizations</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-forest">
          <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Total Events</p>
          <p className="text-4xl font-bold text-forest">{totalEvents}</p>
          <p className="text-xs text-gray-500 mt-2">Published</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-navy">
          <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Past Events</p>
          <p className="text-4xl font-bold text-navy">{pastEvents}</p>
          <p className="text-xs text-gray-500 mt-2">Completed</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-navy">
          <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Content</p>
          <p className="text-4xl font-bold text-navy">{content.length}</p>
          <p className="text-xs text-gray-500 mt-2">Recent posts</p>
        </div>
      </div>

      {/* Membership Breakdown */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-navy mb-6">Membership Breakdown</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-gray-700">Corporate</p>
                <p className="text-2xl font-bold text-forest">{membersByType.corporate}</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-forest h-2 rounded-full"
                  style={{
                    width: `${(membersByType.corporate / activeMembers) * 100 || 0}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-gray-700">Sole Proprietor</p>
                <p className="text-2xl font-bold text-forest">{membersByType.sole_proprietor}</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-forest h-2 rounded-full"
                  style={{
                    width: `${(membersByType.sole_proprietor / activeMembers) * 100 || 0}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-gray-700">NGO/Non-Profit</p>
                <p className="text-2xl font-bold text-forest">{membersByType.ngo}</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-forest h-2 rounded-full"
                  style={{
                    width: `${(membersByType.ngo / activeMembers) * 100 || 0}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-navy mb-6">Recent Content</h2>
          <div className="space-y-4">
            {content.length === 0 ? (
              <p className="text-gray-600 text-sm">No recent content</p>
            ) : (
              content.map((item) => (
                <div key={item.id} className="pb-4 border-b border-gray-200 last:border-b-0">
                  <p className="font-semibold text-navy text-sm">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(item.published_at || '').toLocaleDateString('en-CA')}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-bold text-navy mb-4">Performance Summary</h2>
        <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-700">
          <div>
            <p className="font-semibold text-gray-900 mb-2">Member Growth</p>
            <p className="text-2xl font-bold text-forest mb-1">{activeMembers}</p>
            <p className="text-xs text-gray-500">Active organizations across all tiers</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-2">Member Engagement</p>
            <p className="text-2xl font-bold text-forest mb-1">{totalEvents}</p>
            <p className="text-xs text-gray-500">Events hosted and promoted</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-2">Content Output</p>
            <p className="text-2xl font-bold text-forest mb-1">{content.length}</p>
            <p className="text-xs text-gray-500">Posts, recaps, and archive items</p>
          </div>
        </div>
      </div>
    </div>
  );
}
