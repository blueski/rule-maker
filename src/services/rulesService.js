import { StorageError, withErrorHandling } from '../utils/errorHandling'

/**
 * Service for managing fraud detection rules with localStorage persistence
 */
export class RulesService {
  static STORAGE_KEY = 'fraudDetectionRules'

  /**
   * Loads rules from localStorage
   * @returns {Array} Array of rule objects
   */
  static loadRules() {
    return withErrorHandling(
      () => {
        const savedRules = localStorage.getItem(this.STORAGE_KEY)
        return savedRules ? JSON.parse(savedRules) : []
      },
      'Loading rules',
      (error) => new StorageError('Failed to load rules from storage', error)
    ).catch((error) => {
      console.error('Error loading rules:', error)
      return [] // Return empty array as fallback
    })
  }

  /**
   * Saves rules to localStorage
   * @param {Array} rules - Array of rule objects to save
   * @returns {Promise<boolean>} Success status
   * @throws {StorageError} When saving fails
   */
  static async saveRules(rules) {
    return withErrorHandling(
      () => {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(rules))
        return true
      },
      'Saving rules',
      (error) => new StorageError('Failed to save rules to storage', error)
    )
  }

  /**
   * Creates a new rule with generated ID and timestamps
   * @param {Object} ruleData - Rule data object
   * @returns {Promise<Object>} Created rule with ID and timestamps
   * @throws {StorageError} When rule creation fails
   */
  static async createRule(ruleData) {
    const newRule = {
      ...ruleData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    const existingRules = await this.loadRules()
    const updatedRules = [...existingRules, newRule]
    
    await this.saveRules(updatedRules)
    return newRule
  }

  /**
   * Updates an existing rule
   * @param {string} ruleId - ID of rule to update
   * @param {Object} ruleData - Updated rule data
   * @returns {Promise<Object>} Updated rule object
   * @throws {StorageError} When rule update fails
   */
  static async updateRule(ruleId, ruleData) {
    const existingRules = await this.loadRules()
    const updatedRules = existingRules.map(rule => 
      rule.id === ruleId 
        ? { ...ruleData, id: ruleId, updatedAt: new Date().toISOString() }
        : rule
    )
    
    await this.saveRules(updatedRules)
    return updatedRules.find(rule => rule.id === ruleId)
  }

  /**
   * Deletes a rule by ID
   * @param {string} ruleId - ID of rule to delete
   * @returns {Promise<boolean>} Success status
   * @throws {StorageError} When rule deletion fails
   */
  static async deleteRule(ruleId) {
    const existingRules = await this.loadRules()
    const updatedRules = existingRules.filter(rule => rule.id !== ruleId)
    
    await this.saveRules(updatedRules)
    return true
  }

  /**
   * Creates a duplicate of an existing rule
   * @param {Object} rule - Rule object to duplicate
   * @returns {Promise<Object>} Duplicated rule with new ID and timestamps
   * @throws {StorageError} When rule duplication fails
   */
  static async duplicateRule(rule) {
    const duplicatedRule = {
      ...rule,
      id: Date.now().toString(),
      name: `${rule.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    const existingRules = await this.loadRules()
    const updatedRules = [...existingRules, duplicatedRule]
    
    await this.saveRules(updatedRules)
    return duplicatedRule
  }
}