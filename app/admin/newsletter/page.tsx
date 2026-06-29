'use client';

import { useState } from 'react';
import Link from 'next/link';
import { generateNewsletterDraft, publishNewsletter } from '@/app/actions';

export default function NewsletterStudioPage() {
  const [draftContent, setDraftContent] = useState('');
  const [subject, setSubject] = useState('EMA of BC Newsletter');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState<'input' | 'review'>('input');

  const handleGenerateDraft = async () => {
    setIsGenerating(true);
    setError('');
    setSuccess('');

    try {
      const draft = await generateNewsletterDraft();
      setDraftContent(draft);

      const subjectMatch = draft.match(/^#\s+(.+)$/m) || draft.match(/^Subject:\s*(.+)$/im);
      if (subjectMatch) setSubject(subjectMatch[1].trim());

      setStep('review');
    } catch (err) {
      setError('Failed to generate newsletter draft. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setError('');
    setSuccess('');
    try {
      const result = await publishNewsletter(subject, draftContent);
      setSuccess(`Newsletter sent to ${result.sent} subscribers.`);
      setStep('input');
      setDraftContent('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish newsletter');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin" className="text-forest hover:text-forest-dark mb-4 inline-block">
          ← Back to Admin
        </Link>
        <h1 className="text-4xl font-bold text-navy mb-2">Newsletter Studio</h1>
        <p className="text-gray-600">
          Generate newsletter drafts from live events and content, then send to subscribers
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">{success}</div>
        )}

        {step === 'input' && (
          <div>
            <h2 className="text-2xl font-bold text-navy mb-4">Generate Newsletter Draft</h2>
            <p className="text-gray-600 mb-6">
              AI pulls upcoming events and recent content from the database to draft your newsletter.
            </p>
            <button
              onClick={handleGenerateDraft}
              disabled={isGenerating}
              className="bg-forest hover:bg-forest-dark text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50"
            >
              {isGenerating ? 'Generating from live data…' : '✨ Generate Draft with AI'}
            </button>
          </div>
        )}

        {step === 'review' && (
          <div>
            <h2 className="text-2xl font-bold text-navy mb-6">Review &amp; Send</h2>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold text-gray-700">Email subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              />
            </div>

            <textarea
              value={draftContent}
              onChange={(e) => setDraftContent(e.target.value)}
              className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm mb-6"
            />

            <div className="flex gap-4">
              <button
                onClick={() => setStep('input')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 px-6 rounded-lg flex-1"
              >
                Regenerate
              </button>
              <button
                onClick={handlePublish}
                disabled={isPublishing || !draftContent.trim()}
                className="bg-forest hover:bg-forest-dark text-white font-bold py-3 px-6 rounded-lg flex-1 disabled:opacity-50"
              >
                {isPublishing ? 'Sending…' : 'Send to Subscribers'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
