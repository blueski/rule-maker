import { describe, it, expect } from 'vitest'
import { calculateStats, calculatePagination, applySorting } from '../calculations'

describe('calculations', () => {
  describe('calculateStats', () => {
    it('should calculate correct statistics for data', () => {
      const mockData = [
        { fraud: '1', state: 'pending' },
        { fraud: '0', state: 'declined' },
        { fraud: '1', state: 'pending' },
        { fraud: '0', state: 'declined' }
      ]

      const result = calculateStats(mockData)

      expect(result).toEqual({
        total: '4',
        fraudCount: '2',
        declinedCount: '2',
        fraudRate: '50.00%'
      })
    })

    it('should handle empty data', () => {
      const result = calculateStats([])

      expect(result).toEqual({
        total: '0',
        fraudCount: '0',
        declinedCount: '0',
        fraudRate: '0%'
      })
    })

    it('should handle data with no fraud', () => {
      const mockData = [
        { fraud: '0', state: 'pending' },
        { fraud: '0', state: 'pending' }
      ]

      const result = calculateStats(mockData)

      expect(result).toEqual({
        total: '2',
        fraudCount: '0',
        declinedCount: '0',
        fraudRate: '0.00%'
      })
    })
  })

  describe('calculatePagination', () => {
    const mockData = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }))

    it('should calculate pagination data for first page', () => {
      const result = calculatePagination(mockData, 1, 10)

      expect(result).toEqual({
        paginatedData: mockData.slice(0, 10),
        totalPages: 3,
        startIdx: 1,
        endIdx: 10,
        totalItems: 25
      })
    })

    it('should calculate pagination data for middle page', () => {
      const result = calculatePagination(mockData, 2, 10)

      expect(result).toEqual({
        paginatedData: mockData.slice(10, 20),
        totalPages: 3,
        startIdx: 11,
        endIdx: 20,
        totalItems: 25
      })
    })

    it('should calculate pagination data for last page', () => {
      const result = calculatePagination(mockData, 3, 10)

      expect(result).toEqual({
        paginatedData: mockData.slice(20, 25),
        totalPages: 3,
        startIdx: 21,
        endIdx: 25,
        totalItems: 25
      })
    })
  })

  describe('applySorting', () => {
    const mockData = [
      { name: 'John', age: '30', balance: '100.50' },
      { name: 'Alice', age: '25', balance: '200.75' },
      { name: 'Bob', age: '35', balance: '50.25' }
    ]

    it('should sort strings in ascending order', () => {
      const result = applySorting(mockData, { column: 'name', direction: 'asc' })

      expect(result[0].name).toBe('Alice')
      expect(result[1].name).toBe('Bob')
      expect(result[2].name).toBe('John')
    })

    it('should sort strings in descending order', () => {
      const result = applySorting(mockData, { column: 'name', direction: 'desc' })

      expect(result[0].name).toBe('John')
      expect(result[1].name).toBe('Bob')
      expect(result[2].name).toBe('Alice')
    })

    it('should sort numbers in ascending order', () => {
      const result = applySorting(mockData, { column: 'age', direction: 'asc' })

      expect(result[0].age).toBe('25')
      expect(result[1].age).toBe('30')
      expect(result[2].age).toBe('35')
    })

    it('should sort decimal numbers correctly', () => {
      const result = applySorting(mockData, { column: 'balance', direction: 'asc' })

      expect(result[0].balance).toBe('50.25')
      expect(result[1].balance).toBe('100.50')
      expect(result[2].balance).toBe('200.75')
    })

    it('should return original data when no sort column specified', () => {
      const result = applySorting(mockData, { column: null, direction: 'asc' })

      expect(result).toEqual(mockData)
    })
  })
})