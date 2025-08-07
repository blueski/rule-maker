import React from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'

const formatCellValue = (value, key) => {
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

const formatHeaderName = (header) => {
  return header
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}

const getSortIcon = (column, sortConfig) => {
  if (sortConfig.column !== column) {
    return <ChevronsUpDown className="w-4 h-4 text-primary-400" />
  }
  return sortConfig.direction === 'asc' 
    ? <ChevronUp className="w-4 h-4 text-accent-600" />
    : <ChevronDown className="w-4 h-4 text-accent-600" />
}

const DataTable = ({
  data,
  loading,
  sortConfig,
  onSort,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange
}) => {
  if (loading) {
    return (
      <div className="table-container">
        <div className="px-8 py-6 border-b border-primary-100">
          <h3 className="text-xl font-semibold text-primary-900">Transaction Data</h3>
        </div>
        <div className="flex justify-center items-center py-16">
          <div className="w-8 h-8 skeleton rounded-full animate-pulse"></div>
          <span className="ml-3 text-primary-600 font-medium">Loading transaction data...</span>
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="table-container">
        <div className="px-8 py-6 border-b border-primary-100">
          <h3 className="text-xl font-semibold text-primary-900">Transaction Data</h3>
        </div>
        <div className="flex justify-center items-center py-16">
          <span className="text-primary-600 font-medium">No data available</span>
        </div>
      </div>
    )
  }

  const headers = Object.keys(data[0])
  const startIdx = (currentPage - 1) * pageSize + 1
  const endIdx = Math.min(currentPage * pageSize, totalItems)

  return (
    <div className="table-container">
      <div className="px-8 py-6 border-b border-primary-100">
        <h3 className="text-xl font-semibold text-primary-900">Transaction Data</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-primary-50">
            <tr>
              {headers.map(header => (
                <th
                  key={header}
                  className="table-header"
                  onClick={() => onSort(header)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{formatHeaderName(header)}</span>
                    {getSortIcon(header, sortConfig)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.map((row, index) => (
              <tr key={index} className="table-row">
                {headers.map(header => (
                  <td key={header} className="table-cell">
                    {formatCellValue(row[header], header)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="bg-primary-25 px-8 py-4 border-t border-primary-100">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-primary-700">
            Showing {startIdx}-{endIdx} of {totalItems.toLocaleString()} results
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn-secondary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm font-medium text-primary-700 bg-white border border-primary-200 rounded-lg">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn-secondary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataTable