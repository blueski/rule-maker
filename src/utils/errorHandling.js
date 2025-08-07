/**
 * Standardized error handling utilities
 */

/**
 * Custom error classes for different types of failures
 */
export class ServiceError extends Error {
  constructor(message, code = 'SERVICE_ERROR', originalError = null) {
    super(message)
    this.name = 'ServiceError'
    this.code = code
    this.originalError = originalError
  }
}

export class NetworkError extends ServiceError {
  constructor(message = 'Network request failed', originalError = null) {
    super(message, 'NETWORK_ERROR', originalError)
    this.name = 'NetworkError'
  }
}

export class ParseError extends ServiceError {
  constructor(message = 'Data parsing failed', originalError = null) {
    super(message, 'PARSE_ERROR', originalError)
    this.name = 'ParseError'
  }
}

export class StorageError extends ServiceError {
  constructor(message = 'Storage operation failed', originalError = null) {
    super(message, 'STORAGE_ERROR', originalError)
    this.name = 'StorageError'
  }
}

/**
 * Retry utility with exponential backoff
 * @param {Function} operation - Async operation to retry
 * @param {Object} options - Retry configuration
 * @param {number} options.maxAttempts - Maximum number of attempts (default: 3)
 * @param {number} options.baseDelay - Base delay in ms (default: 1000)
 * @param {number} options.maxDelay - Maximum delay in ms (default: 10000)
 * @param {Function} options.shouldRetry - Function to determine if error should be retried
 * @returns {Promise} Result of the operation
 */
export const retryWithBackoff = async (operation, options = {}) => {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    shouldRetry = () => true
  } = options

  let lastError

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error

      // Don't retry if this is the last attempt or if shouldRetry returns false
      if (attempt === maxAttempts || !shouldRetry(error)) {
        break
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay)
      
      console.warn(`Operation failed (attempt ${attempt}/${maxAttempts}), retrying in ${delay}ms:`, error.message)
      
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

/**
 * Wraps async operations with standardized error handling
 * @param {Function} operation - Async operation to wrap
 * @param {string} context - Context description for errors
 * @param {Function} errorTransformer - Function to transform caught errors
 * @returns {Promise} Result of the operation
 */
export const withErrorHandling = async (operation, context = 'Operation', errorTransformer = null) => {
  try {
    return await operation()
  } catch (error) {
    const transformedError = errorTransformer ? errorTransformer(error) : error
    
    console.error(`${context} failed:`, transformedError)
    
    throw transformedError
  }
}

/**
 * Determines if an error should be retried
 * @param {Error} error - Error to check
 * @returns {boolean} Whether the error should be retried
 */
export const shouldRetryError = (error) => {
  // Don't retry storage errors (localStorage issues)
  if (error instanceof StorageError) {
    return false
  }

  // Don't retry parse errors (data format issues)
  if (error instanceof ParseError) {
    return false
  }

  // Retry network errors
  if (error instanceof NetworkError) {
    return true
  }

  // For generic errors, check if they seem network-related
  if (error.message?.includes('fetch') || error.message?.includes('network')) {
    return true
  }

  return false
}