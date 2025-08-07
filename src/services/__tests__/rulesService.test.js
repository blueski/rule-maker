import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { RulesService } from '../rulesService'

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn()
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
})

describe('RulesService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(Date, 'now').mockReturnValue(1234567890000)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('loadRules', () => {
    it('should load rules from localStorage', async () => {
      const mockRules = [{ id: '1', name: 'Test Rule' }]
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockRules))

      const result = await RulesService.loadRules()

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('fraudDetectionRules')
      expect(result).toEqual(mockRules)
    })

    it('should return empty array when no rules exist', async () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      const result = await RulesService.loadRules()

      expect(result).toEqual([])
    })

    it('should handle JSON parse errors', async () => {
      mockLocalStorage.getItem.mockReturnValue('invalid json')
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = await RulesService.loadRules()

      expect(result).toEqual([])
      expect(consoleSpy).toHaveBeenCalledWith('Loading rules failed:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })

  describe('saveRules', () => {
    it('should save rules to localStorage', async () => {
      const mockRules = [{ id: '1', name: 'Test Rule' }]

      const result = await RulesService.saveRules(mockRules)

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'fraudDetectionRules',
        JSON.stringify(mockRules)
      )
      expect(result).toBe(true)
    })

    it('should handle save errors', async () => {
      const mockRules = [{ id: '1', name: 'Test Rule' }]
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage error')
      })
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await expect(RulesService.saveRules(mockRules)).rejects.toThrow('Failed to save rules to storage')
      
      consoleSpy.mockRestore()
    })
  })

  describe('createRule', () => {
    it('should create a new rule with generated ID and timestamps', async () => {
      const mockExistingRules = [{ id: '1', name: 'Existing Rule' }]
      const newRuleData = { name: 'New Rule', description: 'Test' }
      
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockExistingRules))
      mockLocalStorage.setItem.mockReturnValue(true)

      const result = await RulesService.createRule(newRuleData)

      expect(result).toEqual({
        ...newRuleData,
        id: '1234567890000',
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      })
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'fraudDetectionRules',
        JSON.stringify([...mockExistingRules, result])
      )
    })

    it('should throw error if save fails', async () => {
      mockLocalStorage.getItem.mockReturnValue('[]')
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage error')
      })

      await expect(RulesService.createRule({ name: 'Test' })).rejects.toThrow('Failed to save rules to storage')
    })
  })

  describe('deleteRule', () => {
    it('should delete rule by ID', async () => {
      const mockRules = [
        { id: '1', name: 'Rule 1' },
        { id: '2', name: 'Rule 2' }
      ]
      
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockRules))
      mockLocalStorage.setItem.mockReturnValue(true)

      const result = await RulesService.deleteRule('1')

      expect(result).toBe(true)
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'fraudDetectionRules',
        JSON.stringify([{ id: '2', name: 'Rule 2' }])
      )
    })
  })
})