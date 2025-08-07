import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DataService } from '../dataService'

// Mock Papa Parse
vi.mock('papaparse', () => ({
  default: {
    parse: vi.fn()
  }
}))

// Mock fetch
global.fetch = vi.fn()

describe('DataService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('loadCSVData', () => {
    it('should successfully load and parse CSV data', async () => {
      const mockCsvText = 'header1,header2\nvalue1,value2'
      const mockParsedData = [{ header1: 'value1', header2: 'value2' }]

      global.fetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockCsvText)
      })

      const Papa = await import('papaparse')
      Papa.default.parse.mockImplementation((text, options) => {
        options.complete({ data: mockParsedData })
      })

      const result = await DataService.loadCSVData()
      
      expect(global.fetch).toHaveBeenCalledWith('./data.csv')
      expect(Papa.default.parse).toHaveBeenCalledWith(mockCsvText, expect.objectContaining({
        header: true,
        skipEmptyLines: true
      }))
      expect(result).toEqual(mockParsedData)
    })

    it('should handle CSV parsing errors', async () => {
      const mockCsvText = 'invalid,csv'
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockCsvText)
      })

      const Papa = await import('papaparse')
      Papa.default.parse.mockImplementation((text, options) => {
        options.error(new Error('Parse error'))
      })

      await expect(DataService.loadCSVData()).rejects.toThrow('CSV parsing failed')
    })

    it('should handle fetch errors', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(DataService.loadCSVData()).rejects.toThrow('Network error')
    })
  })

  describe('getColumnNames', () => {
    it('should return column names from data with records', () => {
      const mockData = [
        { id: '1', name: 'John', age: '30' },
        { id: '2', name: 'Jane', age: '25' }
      ]

      const result = DataService.getColumnNames(mockData)
      expect(result).toEqual(['id', 'name', 'age'])
    })

    it('should return empty array for empty data', () => {
      expect(DataService.getColumnNames([])).toEqual([])
      expect(DataService.getColumnNames(null)).toEqual([])
      expect(DataService.getColumnNames(undefined)).toEqual([])
    })
  })
})