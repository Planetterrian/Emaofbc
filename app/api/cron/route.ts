export const runtime = 'nodejs';

// Vercel Cron entrypoint. Scheduled in vercel.json to run daily.
// Vercel automatically sends an Authorization: Bearer <CRON_SECRET> header
// when CRON_SECRET is set as an environment variable.
export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response('Unauthorized', { status: 401 });
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    `https://${req.headers.get('host')}`;

  const apiKey = process.env.NOTIFICATION_API_KEY || '';

  const endpoints = [
    '/api/notifications/membership-renewals',
    '/api/notifications/event-reminders',
    '/api/notifications/pd-credits',
  ];

  const results: Record<string, unknown> = {};

  for (const path of endpoints) {
    try {
      const res = await fetch(`${baseUrl}${path}`, {
        method: 'POST',
        headers: { 'x-api-key': apiKey },
      });
      results[path] = { status: res.status, ok: res.ok };
    } catch (error) {
      results[path] = {
        status: 'error',
        message: error instanceof Error ? error.message : String(error),
      };
    }
  }

  return Response.json({ success: true, ranAt: new Date().toISOString(), results });
}
