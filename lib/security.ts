import { NextRequest, NextResponse } from 'next/server';

export interface SecurityHeaders {
  'X-Content-Type-Options'?: string;
  'X-Frame-Options'?: string;
  'X-XSS-Protection'?: string;
  'Strict-Transport-Security'?: string;
  'Content-Security-Policy'?: string;
  'Referrer-Policy'?: string;
  'Permissions-Policy'?: string;
}

export function getSecurityHeaders(): SecurityHeaders {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  };
}

export function addSecurityHeaders(response: NextResponse): NextResponse {
  const headers = getSecurityHeaders();
  Object.entries(headers).forEach(([key, value]) => {
    if (value) {
      response.headers.set(key, value);
    }
  });
  return response;
}

export function isValidOrigin(origin: string): boolean {
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL,
    'http://localhost:3000',
    'http://localhost:3001',
  ].filter(Boolean);

  return allowedOrigins.includes(origin);
}

export function handleCORS(
  req: NextRequest,
  allowedMethods: string[] = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
): NextResponse | null {
  const origin = req.headers.get('origin');

  if (req.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 200 });
    if (origin && isValidOrigin(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }
    response.headers.set('Access-Control-Allow-Methods', allowedMethods.join(', '));
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400');
    return response;
  }

  return null;
}

export function applyCORS(response: NextResponse, origin?: string | null): NextResponse {
  if (origin && isValidOrigin(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }
  return response;
}

// Check if request contains suspicious patterns
export function isSuspiciousRequest(req: NextRequest): boolean {
  const url = req.url;

  // Check for common SQL injection patterns
  if (url.toLowerCase().includes('union') && url.toLowerCase().includes('select')) {
    return true;
  }

  // Check for path traversal attempts
  if (url.includes('..') || url.includes('%2e%2e')) {
    return true;
  }

  // Check for script injection patterns
  if (url.includes('<script') || url.includes('javascript:')) {
    return true;
  }

  return false;
}

export function sanitizeRequestBody(body: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(body)) {
    // Sanitize string values
    if (typeof value === 'string') {
      sanitized[key] = value
        .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
        .replace(/on\w+\s*=/gi, '') // Remove event handlers
        .trim();
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      sanitized[key] = value;
    } else if (value === null) {
      sanitized[key] = null;
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((v) =>
        typeof v === 'string' ? v.trim() : v
      );
    }
  }

  return sanitized;
}
