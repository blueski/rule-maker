
/**
 * Formats cell values for display in data table
 * @param {*} value - Raw cell value
 * @param {string} key - Column key/name
 * @returns {*} Formatted value (string, JSX element, or original value)
 */
export const formatCellValue = (value, key) => {
  if (!value || value === '') return '-'
  
  // Format currency amounts
  if (key.includes('amount') && typeof value === 'string' && value.match(/^\d+\.\d{2}$/)) {
    return '$' + parseFloat(value).toLocaleString()
  }
  
  // Format boolean values for fraud detection
  if (key === 'fraud' || key.startsWith('rule_')) {
    if (value === '1' || value === 'True') {
      return <span className="badge-danger">Yes</span>
    }
    if (value === '0' || value === 'False') {
      return <span className="badge-success">No</span>
    }
  }
  
  // Format status values
  if (key === 'state') {
    if (value === 'declined') {
      return <span className="badge-danger">Declined</span>
    }
    if (value === 'pending') {
      return <span className="badge-warning">Pending</span>
    }
  }
  
  // Truncate long text
  if (typeof value === 'string' && value.length > 50) {
    return (
      <span title={value}>
        {value.substring(0, 50)}...
      </span>
    )
  }
  
  return value
}

/**
 * Formats database column names into human-readable headers
 * @param {string} header - Raw column name (e.g., 'user_name')
 * @returns {string} Formatted header (e.g., 'User Name')
 */
export const formatHeaderName = (header) => {
  return header
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}

/**
 * Formats numbers with locale-specific separators
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
  return num.toLocaleString()
}

/**
 * Formats values as percentage strings
 * @param {string|number} value - Value to format as percentage
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value) => {
  return `${value}%`
}