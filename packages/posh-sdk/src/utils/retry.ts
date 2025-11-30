/**
 * Retry logic with exponential backoff
 */

export interface RetryOptions {
  maxAttempts: number;
  backoff: 'linear' | 'exponential';
  initialDelay: number;
  onRetry?: (attempt: number, error: Error) => void;
}

export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on last attempt
      if (attempt === options.maxAttempts) {
        break;
      }

      // Calculate delay
      const delay = options.backoff === 'exponential'
        ? options.initialDelay * Math.pow(2, attempt - 1)
        : options.initialDelay * attempt;

      // Call retry callback if provided
      if (options.onRetry) {
        options.onRetry(attempt, lastError);
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Check if an error is retryable (e.g., network errors, rate limits)
 */
export function isRetryableError(error: unknown): boolean {
  // Network errors
  if (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT') {
    return true;
  }

  // Rate limiting
  if (error.code === 'RATE_LIMITED' || error.status === 429) {
    return true;
  }

  // Temporary server errors
  if (error.status >= 500 && error.status < 600) {
    return true;
  }

  return false;
}
