import { ChevronUp, ChevronDown, ChevronsUpDown, Loader2 } from 'lucide-react'
import { formatCellValue, formatHeaderName } from '../utils/dataFormatters.jsx'


const getSortIcon = (column, sortConfig) => {
  if (sortConfig.column !== column) {
    return <ChevronsUpDown className="w-4 h-4 text-primary-400" />
  }
  return sortConfig.direction === 'asc' 
    ? <ChevronUp className="w-4 h-4 text-accent-600" />
    : <ChevronDown className="w-4 h-4 text-accent-600" />
}

/**
 * DataTable component for displaying paginated, sortable transaction data
 * @param {Object} props
 * @param {Array} props.data - Array of data objects to display
 * @param {boolean} props.loading - Whether data is currently loading
 * @param {Object} props.sortConfig - Current sort configuration
 * @param {Function} props.onSort - Handler for sort changes
 * @param {number} props.currentPage - Current page number
 * @param {number} props.totalPages - Total number of pages
 * @param {number} props.totalItems - Total number of items
 * @param {number} props.pageSize - Number of items per page
 * @param {Function} props.onPageChange - Handler for page changes
 */
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
          <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
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