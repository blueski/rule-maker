import Papa from 'papaparse'
import { NetworkError, ParseError, retryWithBackoff, withErrorHandling, shouldRetryError } from '../utils/errorHandling'

/**
 * Service for handling CSV data loading and processing operations
 */
export class DataService {
  /**
   * Loads and parses CSV data from the data.csv file with retry logic
   * @returns {Promise<Array>} Array of parsed data objects
   * @throws {NetworkError|ParseError} When CSV loading or parsing fails
   */
  static async loadCSVData() {
    return retryWithBackoff(
      async () => {
        return withErrorHandling(
          async () => {
            // Fetch CSV file
            const response = await fetch('./data.csv')
            if (!response.ok) {
              throw new NetworkError(`HTTP ${response.status}: ${response.statusText}`)
            }
            
            const csvText = await response.text()
            
            // Parse CSV data
            return new Promise((resolve, reject) => {
              Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                  if (results.errors && results.errors.length > 0) {
                    reject(new ParseError(`CSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`))
                  } else {
                    resolve(results.data)
                  }
                },
                error: (error) => {
                  reject(new ParseError('CSV parsing failed', error))
                }
              })
            })
          },
          'CSV data loading',
          (error) => {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
              return new NetworkError('Failed to fetch CSV file', error)
            }
            return error
          }
        )
      },
      {
        maxAttempts: 3,
        baseDelay: 1000,
        shouldRetry: shouldRetryError
      }
    )
  }

  /**
   * Extracts column names from data array
   * @param {Array} data - Array of data objects
   * @returns {Array<string>} Array of column names
   */
  static getColumnNames(data) {
    if (data && data.length > 0) {
      return Object.keys(data[0])
    }
    return []
  }
}