export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
}

class Logger {
  private isDev = process.env.NODE_ENV === 'development';

  private format(entry: LogEntry): string {
    const timestamp = entry.timestamp;
    const level = entry.level.toUpperCase();
    const context = entry.context ? JSON.stringify(entry.context) : '';
    const error = entry.error ? JSON.stringify(entry.error) : '';

    return `[${timestamp}] ${level}: ${entry.message} ${context} ${error}`.trim();
  }

  private createEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: unknown
  ): LogEntry {
    const errorObj =
      error instanceof Error
        ? {
            message: error.message,
            stack: this.isDev ? error.stack : undefined,
            code: (error as any).code,
          }
        : error
          ? { message: String(error) }
          : undefined;

    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error: errorObj,
    };
  }

  debug(message: string, context?: Record<string, unknown>): void {
    const entry = this.createEntry('debug', message, context);
    if (this.isDev) {
      console.debug(this.format(entry));
    }
  }

  info(message: string, context?: Record<string, unknown>): void {
    const entry = this.createEntry('info', message, context);
    console.log(this.format(entry));
  }

  warn(message: string, context?: Record<string, unknown>, error?: Error): void {
    const entry = this.createEntry('warn', message, context, error);
    console.warn(this.format(entry));
  }

  error(
    message: string,
    error?: unknown,
    context?: Record<string, unknown>
  ): void {
    const entry = this.createEntry('error', message, context, error);
    console.error(this.format(entry));
  }

  // API-specific logging
  logRequest(method: string, path: string, context?: Record<string, unknown>): void {
    this.debug(`${method} ${path}`, context);
  }

  logResponse(
    method: string,
    path: string,
    statusCode: number,
    context?: Record<string, unknown>
  ): void {
    this.debug(`${method} ${path} -> ${statusCode}`, context);
  }

  logApiError(
    method: string,
    path: string,
    statusCode: number,
    error: Error | string,
    context?: Record<string, unknown>
  ): void {
    this.error(
      `${method} ${path} failed with ${statusCode}`,
      error,
      context
    );
  }
}

export const logger = new Logger();
