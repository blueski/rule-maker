/**
 * Calculates fraud detection statistics from transaction data
 * @param {Array} data - Array of transaction objects
 * @returns {Object} Statistics object with formatted counts and percentages
 */
export const calculateStats = (data) => {
  const total = data.length
  const fraudCount = data.filter(row => row.fraud === '1').length
  const declinedCount = data.filter(row => row.state === 'declined').length
  const fraudRate = total > 0 ? ((fraudCount / total) * 100).toFixed(2) : 0
  
  return {
    total: total.toLocaleString(),
    fraudCount: fraudCount.toLocaleString(),
    declinedCount: declinedCount.toLocaleString(),
    fraudRate: `${fraudRate}%`
  }
}

/**
 * Calculates pagination data for table display
 * @param {Array} filteredData - Filtered data array
 * @param {number} currentPage - Current page number (1-indexed)
 * @param {number} pageSize - Number of items per page
 * @returns {Object} Pagination data including sliced data and indices
 */
export const calculatePagination = (filteredData, currentPage, pageSize) => {
  const totalPages = Math.ceil(filteredData.length / pageSize)
  const startIdx = (currentPage - 1) * pageSize
  const endIdx = Math.min(currentPage * pageSize, filteredData.length)
  const paginatedData = filteredData.slice(startIdx, startIdx + pageSize)
  
  return {
    paginatedData,
    totalPages,
    startIdx: startIdx + 1, // 1-indexed for display
    endIdx,
    totalItems: filteredData.length
  }
}

/**
 * Applies sorting to data array based on configuration
 * @param {Array} data - Data array to sort
 * @param {Object} sortConfig - Sort configuration with column and direction
 * @param {string} sortConfig.column - Column to sort by
 * @param {string} sortConfig.direction - Sort direction ('asc' or 'desc')
 * @returns {Array} Sorted data array
 */
export const applySorting = (data, sortConfig) => {
  if (!sortConfig.column) {
    return data
  }

  return [...data].sort((a, b) => {
    let aVal = a[sortConfig.column]
    let bVal = b[sortConfig.column]
    
    // Handle numeric values
    if (!isNaN(aVal) && !isNaN(bVal)) {
      aVal = parseFloat(aVal)
      bVal = parseFloat(bVal)
    }
    
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })
}