/**
 * Service for managing user authentication state with localStorage
 */
export class AuthService {
  static STORAGE_KEY = 'authStatus'
  static AUTH_VALUE = 'authenticated'

  /**
   * Checks if user is currently authenticated
   * @returns {boolean} Authentication status
   */
  static isAuthenticated() {
    try {
      return localStorage.getItem(this.STORAGE_KEY) === this.AUTH_VALUE
    } catch (error) {
      console.error('Error checking authentication status:', error)
      return false
    }
  }

  /**
   * Sets user as authenticated in localStorage
   * @returns {boolean} Success status
   */
  static login() {
    try {
      localStorage.setItem(this.STORAGE_KEY, this.AUTH_VALUE)
      return true
    } catch (error) {
      console.error('Error setting authentication status:', error)
      return false
    }
  }

  /**
   * Removes authentication state from localStorage
   * @returns {boolean} Success status
   */
  static logout() {
    try {
      localStorage.removeItem(this.STORAGE_KEY)
      return true
    } catch (error) {
      console.error('Error removing authentication status:', error)
      return false
    }
  }
}