'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { queryMemberAssistant } from '@/app/actions';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function MemberAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m the EMA of BC Assistant. I can help answer questions about events, memberships, and our organization. What would you like to know?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const context = `
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

      const response = await queryMemberAssistant(input, context);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your question. Please try again or contact membership@emaofbc.com for assistance.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <section className="bg-navy text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-gray-200 hover:text-white mb-4 inline-block text-sm">
            ← Back to Site
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Member Assistant</h1>
          <p className="text-xl text-gray-200">Ask questions about EMA of BC, events, and membership</p>
        </div>
      </section>

      {/* Chat Container */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-lg shadow-lg flex flex-col h-96 md:h-[600px]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs md:max-w-md px-4 py-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-forest text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.role === 'user'
                          ? 'text-gray-200'
                          : 'text-gray-500'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg rounded-bl-none">
                    <p className="text-sm">Thinking...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask a question about EMA of BC..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent resize-none"
                  rows={2}
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-forest hover:bg-forest-dark text-white font-bold px-6 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed h-fit"
                >
                  Send
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Press Shift+Enter for new line, Enter to send
              </p>
            </div>
          </div>

          {/* Help */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-bold text-navy mb-3">About the Member Assistant</h2>
            <p className="text-gray-700 mb-4">
              The Member Assistant is an AI-powered chatbot that can help answer questions about EMA of BC.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="text-forest font-bold">✓</span>
                <span>Ask about events, dates, and registration</span>
              </li>
              <li className="flex gap-2">
                <span className="text-forest font-bold">✓</span>
                <span>Learn about membership tiers and benefits</span>
              </li>
              <li className="flex gap-2">
                <span className="text-forest font-bold">✓</span>
                <span>Get information about the organization</span>
              </li>
              <li className="flex gap-2">
                <span className="text-gray-500">•</span>
                <span>For billing or account issues, contact membership@emaofbc.com</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
