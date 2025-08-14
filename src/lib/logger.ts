// Logger utility for consistent logging across the application
// Wraps console.* and sends to Vercel logs when available

type LogLevel = 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

function formatMessage(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
  return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`;
}

function sendToVercelLogs(level: LogLevel, message: string, context?: LogContext) {
  // In production, Vercel automatically captures console output
  // This is mainly for development and explicit logging
  if (typeof window !== 'undefined') {
    // Client-side: just use console
    return;
  }
  
  // Server-side: Vercel will capture this
  const formattedMessage = formatMessage(level, message, context);
  
  switch (level) {
    case 'info':
      console.info(formattedMessage);
      break;
    case 'warn':
      console.warn(formattedMessage);
      break;
    case 'error':
      console.error(formattedMessage);
      break;
  }
}

export function logInfo(message: string, context?: LogContext) {
  sendToVercelLogs('info', message, context);
}

export function logWarn(message: string, context?: LogContext) {
  sendToVercelLogs('warn', message, context);
}

export function logError(message: string, context?: LogContext) {
  sendToVercelLogs('error', message, context);
}

// Convenience function for API errors
export function logApiError(endpoint: string, error: any, payload?: any) {
  logError(`API Error at ${endpoint}`, {
    error: error?.message || error,
    stack: error?.stack,
    payload,
    endpoint
  });
}
