import { NextRequest, NextResponse } from 'next/server';
import { AppError } from './errors';
import { logger } from './logging';
import { enforceRateLimit, RateLimitOptions } from './rate-limit';

export type ApiHandlerFn = (req: NextRequest) => Promise<NextResponse>;

export interface ApiHandlerOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  rateLimit?: RateLimitOptions;
  requireAuth?: boolean;
}

export function createApiHandler(
  handler: ApiHandlerFn,
  options: ApiHandlerOptions = {}
): ApiHandlerFn {
  return async (req: NextRequest): Promise<NextResponse> => {
    const method = req.method;
    const path = new URL(req.url).pathname;

    try {
      // Validate method
      if (options.method && method !== options.method) {
        return NextResponse.json(
          { error: 'Method not allowed' },
          { status: 405, headers: { Allow: options.method } }
        );
      }

      // Rate limiting
      if (options.rateLimit) {
        const clientIp =
          req.headers.get('x-forwarded-for') ||
          req.headers.get('x-real-ip') ||
          'unknown';
        enforceRateLimit(clientIp, options.rateLimit);
      }

      logger.logRequest(method, path);

      // Call handler
      const response = await handler(req);

      const statusCode = response.status;
      logger.logResponse(method, path, statusCode);

      return response;
    } catch (error) {
      return handleApiError(error, method, path);
    }
  };
}

function handleApiError(
  error: unknown,
  method: string,
  path: string
): NextResponse {
  // Handle known app errors
  if (error instanceof AppError) {
    logger.logApiError(method, path, error.statusCode, error.message, {
      code: error.code,
      details: error.details,
    });

    const headers: Record<string, string> = {};
    if (error.code === 'RATE_LIMIT' && error.details) {
      headers['Retry-After'] = String((error.details as any).retryAfter ?? 60);
    }

    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        ...(process.env.NODE_ENV === 'development' && {
          details: error.details,
        }),
      },
      {
        status: error.statusCode,
        headers: Object.keys(headers).length > 0 ? headers : undefined,
      }
    );
  }

  // Handle Supabase errors
  if (error instanceof Error && error.message.includes('PostgreSQL')) {
    logger.error(`Database error: ${error.message}`, error, {
      path,
      method,
    });

    return NextResponse.json(
      { error: 'Database error' },
      { status: 500 }
    );
  }

  // Handle unexpected errors
  const message = error instanceof Error ? error.message : 'Unknown error';
  logger.error(`Unexpected error: ${message}`, error instanceof Error ? error : new Error(String(error)), { path, method });

  return NextResponse.json(
    {
      error: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { message }),
    },
    { status: 500 }
  );
}
