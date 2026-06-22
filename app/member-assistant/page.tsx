'use client';

import { useState, useRef, useEffect } from 'react';
import { queryMemberAssistant } from '@/app/actions';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  'Which upcoming events earn PD credits?',
  'How much is corporate membership?',
  'What are the benefits of joining EMA?',
  'How do I register my team for an event?',
];

const CONTEXT = `
EMA of BC is a professional association for environmental managers in British Columbia.

Recent Events:
- Monthly Sessions: Monthly educational sessions covering environmental trends
- Workshops: In-depth training on topics like carbon accounting and sustainability
- Tours: Site visits to environmental projects and facilities
- Golf Tournament: Annual fundraising event
- Gala: Celebration dinner for members and sponsors

Membership Tiers:
- Corporate: $550 CAD per year (multi-person teams)
- Sole Proprietor: $375 CAD per year (independent consultants)
- NGO/Non-Profit: $250 CAD per year (environmental organizations)

Member Benefits:
- Access to all events at member pricing
- Professional development credits
- Member directory listing (optional)
- Networking with other environmental professionals
- Email newsletters and updates

Contact: membership@emaofbc.com
`;

function Sparkle({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2c.5 3.8 2.2 5.5 6 6-3.8.5-5.5 2.2-6 6-.5-3.8-2.2-5.5-6-6 3.8-.5 5.5-2.2 6-6Z" />
    </svg>
  );
}

export default function MemberAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hi! I'm the EMA of BC Assistant. I can help with questions about events, membership, PD credits, and our organization. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await queryMemberAssistant(content, CONTEXT);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'assistant', content: response, timestamp: new Date() },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content:
            'Sorry, I had trouble answering that. Please try again, or email membership@emaofbc.com for help.',
          timestamp: new Date(),
        },
      ]);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <>
      <section className="bg-forest-gradient text-white">
        <div className="container-px py-12 md:py-16">
          <span className="eyebrow text-sage-light"><Sparkle className="h-4 w-4" /> AI Assistant</span>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">EMA Member Assistant</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Ask anything about events, membership, PD credits, and the organization — answered instantly.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-px max-w-3xl">
          <div className="card flex h-[560px] flex-col p-0 overflow-hidden">
            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'assistant' && (
                    <span className="mr-2 mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-forest text-white">
                      <Sparkle className="h-4 w-4" />
                    </span>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                      m.role === 'user'
                        ? 'rounded-br-sm bg-forest text-white'
                        : 'rounded-bl-sm bg-canvas text-ink ring-1 ring-black/[0.05]'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                    <p className={`mt-1 text-[11px] ${m.role === 'user' ? 'text-white/70' : 'text-ink-soft'}`}>
                      {m.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <span className="mr-2 mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-forest text-white">
                    <Sparkle className="h-4 w-4 animate-pulse" />
                  </span>
                  <div className="rounded-2xl rounded-bl-sm bg-canvas px-4 py-3 text-sm text-ink-soft ring-1 ring-black/[0.05]">
                    Thinking…
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-2 border-t border-black/[0.06] px-4 pt-4">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-forest/20 bg-forest-50 px-3 py-1.5 text-xs font-medium text-forest-700 hover:bg-forest-100"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="border-t border-black/[0.06] p-4">
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask a question about EMA of BC…"
                  rows={2}
                  disabled={isLoading}
                  className="flex-1 resize-none rounded-xl border border-black/10 px-4 py-2.5 text-sm focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
                />
                <button
                  onClick={() => send(input)}
                  disabled={isLoading || !input.trim()}
                  className="btn btn-md btn-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Send
                </button>
              </div>
              <p className="mt-2 text-xs text-ink-soft">Press Enter to send · Shift+Enter for a new line</p>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-ink-soft">
            AI responses can occasionally be inaccurate. For billing or account issues, contact
            membership@emaofbc.com.
          </p>
        </div>
      </section>
    </>
  );
}
