'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

interface Template {
  id: string;
  name: string;
  description: string;
  requiredFields: string[];
}

export default function EmailTemplatesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
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

        // Check if user is admin
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', authUser.id)
          .single();

        if (profile?.role !== 'org_admin' && profile?.role !== 'ed_admin') {
          router.push('/portal');
          return;
        }

        setUser(authUser);

        // Fetch available templates
        const { data: session } = await supabase.auth.getSession();
        const response = await fetch('/api/emails/test', {
          headers: {
            Authorization: `Bearer ${session?.session?.access_token || ''}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          setTemplates(result.templates || []);
          if (result.templates?.length > 0) {
            setSelectedTemplate(result.templates[0].id);
            initializeFormData(result.templates[0]);
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, supabase]);

  const initializeFormData = (template: Template) => {
    const data: Record<string, string> = {};
    template.requiredFields.forEach((field) => {
      data[field] = getSampleValue(field);
    });
    setFormData(data);
  };

  const getSampleValue = (field: string): string => {
    const samples: Record<string, string> = {
      fullName: 'John Doe',
      firstName: 'John',
      orgName: 'Acme Environmental Services',
      tier: 'corporate',
      amount: '2500',
      paidThrough: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      expiresOn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      eventTitle: 'Environmental Compliance Workshop 2026',
      eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-CA', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      eventTime: '2:00 PM',
      eventLocation: 'Vancouver Convention Centre',
      daysUntilEvent: '7',
      creditsEarned: '2.5',
      dateEarned: new Date().toLocaleDateString(),
      invitedBy: 'Jane Smith',
      role: 'org_admin',
      portalUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://emaofbc.com'}/portal`,
      renewalUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://emaofbc.com'}/join`,
      eventUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://emaofbc.com'}/events/123`,
      calendarDownloadUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://emaofbc.com'}/events/123/calendar.ics`,
      pdDashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://emaofbc.com'}/portal/pd-credits`,
      signupUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://emaofbc.com'}/auth/signup`,
    };
    return samples[field] || '';
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      initializeFormData(template);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    setSuccess('');

    try {
      const { data: session } = await supabase.auth.getSession();
      const response = await fetch('/api/emails/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.session?.access_token || ''}`,
        },
        body: JSON.stringify({
          template: selectedTemplate,
          data: formData,
          recipientEmail,
        }),
      });

      if (response.ok) {
        setSuccess(`Test email sent to ${recipientEmail}!`);
        setRecipientEmail('');
      } else {
        const result = await response.json();
        setError(result.error || 'Failed to send test email');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send test email');
    } finally {
      setSending(false);
    }
  };

  const selectedTemplateInfo = templates.find((t) => t.id === selectedTemplate);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-navy text-white py-12">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Email Templates</h1>
            <p className="text-gray-200">Test and preview email templates</p>
          </div>
          <Link href="/admin" className="bg-forest hover:bg-opacity-90 text-white px-4 py-2 rounded-lg transition">
            ← Back to Admin
          </Link>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Template List */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-bold text-navy mb-4">Templates</h2>
              <div className="space-y-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateChange(template.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition ${
                      selectedTemplate === template.id
                        ? 'bg-forest text-white'
                        : 'bg-gray-50 text-navy hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-semibold">{template.name}</div>
                    <div className={`text-xs mt-1 ${selectedTemplate === template.id ? 'text-gray-100' : 'text-gray-600'}`}>
                      {template.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Template Preview & Form */}
            <div className="md:col-span-2">
              {selectedTemplateInfo && (
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-navy mb-2">{selectedTemplateInfo.name}</h2>
                  <p className="text-gray-600 mb-6">{selectedTemplateInfo.description}</p>

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

                  <form onSubmit={handleSendTest} className="space-y-6">
                    {/* Recipient Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Send To Email Address *
                      </label>
                      <input
                        type="email"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        placeholder="test@example.com"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent"
                      />
                    </div>

                    {/* Template Fields */}
                    <div>
                      <h3 className="font-semibold text-navy mb-4">Template Data</h3>
                      <div className="space-y-4">
                        {selectedTemplateInfo.requiredFields.map((field) => (
                          <div key={field}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {field.replace(/([A-Z])/g, ' $1').trim()}
                            </label>
                            <input
                              type="text"
                              value={formData[field] || ''}
                              onChange={(e) => handleFormChange(field, e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={sending || !recipientEmail}
                      className="w-full bg-forest text-white font-semibold py-2 rounded-lg hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending ? 'Sending...' : 'Send Test Email'}
                    </button>
                  </form>

                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      <strong>Note:</strong> Test emails will be prefixed with [TEST] in the subject line. Make sure your email service is configured with valid API keys.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
