import { useState, useMemo } from 'react'
import { applyFilters, createFilterState, updateFilter, setSpecificFilter, clearAllFilters, getActiveFilters } from '../utils/filterUtils'
import { applySorting, calculatePagination } from '../utils/calculations'

export const useDataTable = (data, pageSize = 50) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState({ column: null, direction: 'asc' })
  const [filters, setFilters] = useState(createFilterState())

  const filteredData = useMemo(() => {
    const filtered = applyFilters(data, filters)
    return applySorting(filtered, sortConfig)
  }, [data, filters, sortConfig])

  const paginationData = useMemo(() => {
    return calculatePagination(filteredData, currentPage, pageSize)
  }, [filteredData, currentPage, pageSize])

  const handleSort = (column) => {
    setSortConfig(prev => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
    setCurrentPage(1)
  }

  const handleFilterChange = (type, value) => {
    updateFilter(setFilters, type, value)
    setCurrentPage(1)
  }

  const handleStatCardFilter = (type, value) => {
    setSpecificFilter(setFilters, type, value)
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    clearAllFilters(setFilters)
    setCurrentPage(1)
  }

  const activeFilters = useMemo(() => getActiveFilters(filters), [filters])

  return {
    // Data
    filteredData,
    paginatedData: paginationData.paginatedData,
    
    // Pagination
    currentPage,
    totalPages: paginationData.totalPages,
    totalItems: paginationData.totalItems,
    startIdx: paginationData.startIdx,
    endIdx: paginationData.endIdx,
    setCurrentPage,
    
    // Sorting
    sortConfig,
    handleSort,
    
    // Filtering
    filters,
    activeFilters,
    handleFilterChange,
    handleStatCardFilter,
    handleClearFilters
  }
}