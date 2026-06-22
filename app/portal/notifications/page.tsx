'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

interface NotificationPreferences {
  id: string;
  email_welcome: boolean;
  email_membership_confirmation: boolean;
  email_membership_renewal_reminder: boolean;
  email_event_registration_confirmation: boolean;
  email_event_reminder: boolean;
  email_pd_credits_earned: boolean;
  email_team_invite: boolean;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) {
          router.push('/auth/login');
          return;
        }

        setUser(authUser);

        // Fetch notification preferences
        let { data: userPrefs } = await supabase
          .from('notification_preferences')
          .select('*')
          .eq('user_id', authUser.id)
          .single();

        // Create default preferences if they don't exist
        if (!userPrefs) {
          const { data: created } = await supabase
            .from('notification_preferences')
            .insert({
              user_id: authUser.id,
              email_welcome: true,
              email_membership_confirmation: true,
              email_membership_renewal_reminder: true,
              email_event_registration_confirmation: true,
              email_event_reminder: true,
              email_pd_credits_earned: true,
              email_team_invite: true,
            })
            .select()
            .single();
          userPrefs = created;
        }

        setPrefs(userPrefs);
      } catch (err) {
        console.error('Failed to load preferences:', err);
        setError('Failed to load notification preferences');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, supabase]);

  const handleToggle = async (key: keyof NotificationPreferences) => {
    if (!prefs || !user) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updated = { ...prefs, [key]: !prefs[key] };
      const { error: updateError } = await supabase
        .from('notification_preferences')
        .update({ [key]: !prefs[key] })
        .eq('user_id', user.id);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setPrefs(updated);
      setSuccess('Preference updated');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update preference');
    } finally {
      setSaving(false);
    }
  };

  const notificationTypes = [
    {
      key: 'email_welcome' as keyof NotificationPreferences,
      label: 'Welcome Email',
      description: 'Sent when you create your account',
    },
    {
      key: 'email_membership_confirmation' as keyof NotificationPreferences,
      label: 'Membership Confirmation',
      description: 'Sent when your organization membership is confirmed',
    },
    {
      key: 'email_membership_renewal_reminder' as keyof NotificationPreferences,
      label: 'Membership Renewal Reminder',
      description: 'Sent 30 days before your membership expires',
    },
    {
      key: 'email_event_registration_confirmation' as keyof NotificationPreferences,
      label: 'Event Registration Confirmation',
      description: 'Sent when you register for an event',
    },
    {
      key: 'email_event_reminder' as keyof NotificationPreferences,
      label: 'Event Reminder',
      description: 'Sent a few days before an event you registered for',
    },
    {
      key: 'email_pd_credits_earned' as keyof NotificationPreferences,
      label: 'Professional Development Credits',
      description: 'Sent when you earn PD credits from attending events',
    },
    {
      key: 'email_team_invite' as keyof NotificationPreferences,
      label: 'Team Invitations',
      description: 'Sent when you are invited to join a team',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user || !prefs) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-navy text-white py-12">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Notification Preferences</h1>
            <p className="text-gray-200">Manage which emails you receive from EMA of BC</p>
          </div>
          <Link href="/portal" className="bg-forest hover:bg-opacity-90 text-white px-4 py-2 rounded-lg transition">
            ← Back to Portal
          </Link>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
                {success}
              </div>
            )}

            <div className="space-y-6">
              {notificationTypes.map(({ key, label, description }) => (
                <div key={key} className="flex items-start justify-between pb-6 border-b border-gray-200 last:border-b-0 last:pb-0">
                  <div className="flex-1 pr-4">
                    <h3 className="font-semibold text-navy mb-1">{label}</h3>
                    <p className="text-sm text-gray-600">{description}</p>
                  </div>
                  <button
                    onClick={() => handleToggle(key)}
                    disabled={saving}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      prefs[key] ? 'bg-forest' : 'bg-gray-300'
                    } ${saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-90'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        prefs[key] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            {/* Info Box */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-navy mb-2">About These Preferences</h3>
              <p className="text-sm text-gray-700">
                These settings control whether you receive emails from EMA of BC. Critical account and transactional emails will still be sent even if these are disabled.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
