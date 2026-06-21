'use client';

import { useState } from 'react';
import Link from 'next/link';
import { generateNewsletterDraft } from '@/app/actions';

export default function NewsletterStudioPage() {
  const [draftContent, setDraftContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'input' | 'review'>('input');

  const handleGenerateDraft = async () => {
    setIsGenerating(true);
    setError('');

    try {
      const recentEventsInfo = `
- Monthly Session: October Environmental Trends
- Workshop: Carbon Accounting Fundamentals
- Tour: New Wetland Restoration Project
`;

      const memberUpdatesInfo = `
- Active Environmental Group expanded team by 5
- Golder Associates received sustainability award
- AGAT launched community education program
`;

      const draft = await generateNewsletterDraft(
        recentEventsInfo,
        memberUpdatesInfo
      );

      setDraftContent(draft);
      setStep('review');
    } catch (err) {
      setError('Failed to generate newsletter draft. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDraft = () => {
    // Save to database - stub for Phase 5
    const content = encodeURIComponent(draftContent);
    window.open(`mailto:ed@emaofbc.com?subject=Newsletter Draft&body=${content}`);
  };

  const handlePublish = () => {
    alert('Newsletter publishing would send to all members via Resend email service');
    setStep('input');
    setDraftContent('');
  };

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin" className="text-forest hover:text-forest-dark mb-4 inline-block">
          ← Back to Admin
        </Link>
        <h1 className="text-4xl font-bold text-navy mb-2">Newsletter Studio</h1>
        <p className="text-gray-600">
          Generate newsletter drafts with AI, review and customize before sending
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-8">
        {step === 'input' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-navy mb-4">Generate Newsletter Draft</h2>
              <p className="text-gray-600 mb-6">
                Our AI will analyze recent events and member updates to create an engaging newsletter draft.
                You can then review, edit, and publish.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerateDraft}
                disabled={isGenerating}
                className="bg-forest hover:bg-forest-dark text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? 'Generating...' : '✨ Generate Draft with AI'}
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-bold text-navy mb-2">How it works</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• AI analyzes recent events, member updates, and organization activities</li>
                <li>• Generates compelling marketing copy tailored to your audience</li>
                <li>• You review and edit the draft before publishing</li>
                <li>• Send via Resend email service to all active members</li>
              </ul>
            </div>
          </div>
        )}

        {step === 'review' && (
          <div>
            <h2 className="text-2xl font-bold text-navy mb-6">Review & Edit Draft</h2>

            <div className="mb-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <textarea
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent font-mono text-sm"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-900">
                💡 Tip: Edit the content above to customize for your audience. Markdown formatting is supported.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep('input')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 px-6 rounded-lg transition flex-1"
              >
                Generate New
              </button>
              <button
                onClick={handleSaveDraft}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition flex-1"
              >
                Save Draft
              </button>
              <button
                onClick={handlePublish}
                className="bg-forest hover:bg-forest-dark text-white font-bold py-3 px-6 rounded-lg transition flex-1"
              >
                Send Newsletter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
