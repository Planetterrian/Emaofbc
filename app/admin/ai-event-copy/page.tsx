'use client';

import { useState } from 'react';
import Link from 'next/link';
import { generateEventCopy } from '@/app/actions';

const EVENT_TYPES = [
  'monthly_session',
  'workshop',
  'tour',
  'golf',
  'gala',
];

export default function AIEventCopyPage() {
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState('monthly_session');
  const [eventDescription, setEventDescription] = useState('');
  const [generatedCopy, setGeneratedCopy] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!eventTitle.trim()) {
      setError('Please enter an event title');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const copy = await generateEventCopy(
        eventTitle,
        eventDescription,
        eventType
      );
      setGeneratedCopy(copy);
    } catch (err) {
      setError('Failed to generate event copy. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedCopy);
    alert('Copied to clipboard!');
  };

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin" className="text-forest hover:text-forest-dark mb-4 inline-block">
          ← Back to Admin
        </Link>
        <h1 className="text-4xl font-bold text-navy mb-2">Event Copy Generator</h1>
        <p className="text-gray-600">
          Generate compelling marketing copy for events with AI assistance
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-navy mb-6">Event Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="e.g., Carbon Accounting Fundamentals Workshop"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Event Type
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent"
              >
                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                placeholder="Add any additional details about the event..."
                className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent resize-none"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-forest hover:bg-forest-dark text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Generating...' : '✨ Generate Copy'}
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-navy mb-6">Generated Copy</h2>

          {!generatedCopy ? (
            <div className="text-center py-12 text-gray-500">
              <p className="mb-2">📝</p>
              <p>Generated copy will appear here</p>
            </div>
          ) : (
            <div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                <div className="prose prose-sm max-w-none text-gray-700">
                  {generatedCopy.split('\n').map((line, idx) => (
                    <div key={idx} className="mb-2">
                      {line}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCopyToClipboard}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition text-sm"
                >
                  📋 Copy
                </button>
                <button
                  onClick={() => setGeneratedCopy('')}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 px-4 rounded-lg transition text-sm"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
            <p className="font-semibold mb-2">💡 Tips</p>
            <ul className="space-y-1">
              <li>• Use specific event titles for better results</li>
              <li>• Add context in the description for personalization</li>
              <li>• Edit the generated copy to match your brand voice</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
