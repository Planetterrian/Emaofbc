import { createHash } from 'crypto';
import { enforceRateLimit } from './rate-limit';

const XAI_API_KEY = process.env.XAI_API_KEY || '';
const XAI_MODEL = process.env.XAI_MODEL || 'grok-latest';

const responseCache = new Map<string, { content: string; expiresAt: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export interface CallXAIOptions {
  temperature?: number;
  maxTokens?: number;
  rateLimitKey?: string;
  cacheKey?: string;
}

function hashKey(input: string): string {
  return createHash('sha256').update(input).digest('hex').slice(0, 16);
}

export async function callXAI(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  options?: CallXAIOptions
): Promise<string> {
  if (!XAI_API_KEY) {
    throw new Error('AI service is not configured');
  }

  if (options?.rateLimitKey) {
    enforceRateLimit(options.rateLimitKey, { limit: 20, window: 3600, keyPrefix: 'ai' });
  }

  if (options?.cacheKey) {
    const key = hashKey(options.cacheKey);
    const cached = responseCache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.content;
    }
  }

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${XAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: XAI_MODEL,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 1024,
    }),
  });

  if (!response.ok) {
    throw new Error(`xAI API error: ${response.status}`);
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  const content = data.choices[0]?.message?.content || '';

  if (options?.cacheKey && content) {
    responseCache.set(hashKey(options.cacheKey), {
      content,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });
  }

  return content;
}

export async function generateEventCopyAI(
  eventTitle: string,
  eventDescription: string,
  eventType: string
): Promise<string> {
  return callXAI(
    [
      {
        role: 'system',
        content:
          'You are an expert copywriter for EMA of BC, a professional environmental association. Write engaging, professional event marketing copy. Keep tone warm, professional, and action-oriented. Output markdown formatted text suitable for a website.',
      },
      {
        role: 'user',
        content: `Generate compelling marketing copy for this event.
Title: ${eventTitle}
Type: ${eventType}
Description: ${eventDescription}

Provide 2-3 paragraphs of engaging copy that highlights the value and invites attendance.`,
      },
    ],
    { temperature: 0.7, maxTokens: 500, rateLimitKey: 'admin-event-copy' }
  );
}

export async function generateNewsletterDraftAI(
  recentEvents: string,
  memberUpdates: string
): Promise<string> {
  return callXAI(
    [
      {
        role: 'system',
        content:
          'You are a professional newsletter writer for EMA of BC (Environmental Managers Association of BC). Write engaging, informative newsletters that showcase member achievements and upcoming events. Maintain a professional but friendly tone.',
      },
      {
        role: 'user',
        content: `Generate a newsletter draft based on this activity:

Recent Events: ${recentEvents}

Member Updates: ${memberUpdates}

Create a newsletter with:
1. Engaging subject line
2. Opening paragraph highlighting key events
3. Featured achievements
4. Upcoming opportunities
5. Call to action

Format as markdown suitable for email.`,
      },
    ],
    { temperature: 0.7, maxTokens: 1000, rateLimitKey: 'admin-newsletter' }
  );
}

export async function queryMemberAssistantAI(
  query: string,
  context: string,
  rateLimitKey: string
): Promise<string> {
  const sanitizedQuery = query.slice(0, 2000);

  return callXAI(
    [
      {
        role: 'system',
        content: `You are a helpful assistant for EMA of BC members. You have access to information about the organization's events, members, and programs.

IMPORTANT: Only answer questions based on the provided context. If a question is outside the scope of what you know about EMA of BC, politely explain that you can only help with EMA-related questions and suggest contacting membership@emaofbc.com for other inquiries.

Be concise, friendly, and professional in your responses.`,
      },
      {
        role: 'user',
        content: `Context about EMA of BC:
${context}

Member question: ${sanitizedQuery}

Please answer based only on the context provided above. If you cannot answer from the context, explain what you'd need to know.`,
      },
    ],
    {
      temperature: 0.5,
      maxTokens: 500,
      rateLimitKey,
      cacheKey: `${context.slice(0, 200)}::${sanitizedQuery.toLowerCase().trim()}`,
    }
  );
}
