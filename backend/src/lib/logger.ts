/**
 * Centralized logging utility for ResumePay backend
 * Provides structured logging with timestamps and log levels
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  data?: any;
}

class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private log(level: LogLevel, message: string, data?: any): void {
    const entry: LogEntry = {
      timestamp: this.formatTimestamp(),
      level,
      context: this.context,
      message,
      data,
    };

    const logMessage = `[${entry.timestamp}] [${entry.level}] [${entry.context}] ${entry.message}`;
    
    if (data) {
      console.log(logMessage, data);
    } else {
      console.log(logMessage);
    }
  }

  debug(message: string, data?: any): void {
    if (process.env.NODE_ENV === 'development') {
      this.log(LogLevel.DEBUG, message, data);
    }
  }

  info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
  }

  warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data);
  }

  error(message: string, data?: any): void {
    this.log(LogLevel.ERROR, message, data);
  }
}

/**
 * Create a logger instance for a specific context
 */
export function createLogger(context: string): Logger {
  return new Logger(context);
}

/**
 * Pre-configured loggers for different parts of the application
 */
export const envLogger = createLogger('ENV');
export const paymentLogger = createLogger('PAYMENT');
export const walletLogger = createLogger('WALLET');
export const transactionLogger = createLogger('TRANSACTION');
export const uploadLogger = createLogger('UPLOAD');
export const reviewLogger = createLogger('REVIEW');
export const apiLogger = createLogger('API');
export const b402Logger = createLogger('B402');
