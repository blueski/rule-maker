import React from 'react'

const FilterControls = ({
  searchTerm,
  statusFilter,
  fraudFilter,
  onFilterChange,
  onClearFilters
}) => {
  const selectStyle = {
    paddingLeft: '0.75rem',
    paddingRight: '3rem',
    backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
    backgroundPosition: 'right 0.75rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '16px 16px',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    appearance: 'none'
  }

  return (
    <div className="card p-8 mb-10">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div className="flex flex-wrap items-end gap-6 flex-1">
          <div className="min-w-0 flex-1 max-w-sm">
            <label htmlFor="search" className="form-label">
              Search Transactions
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => onFilterChange('search', e.target.value)}
              placeholder="Search by any field..."
              className="form-input"
            />
          </div>
          
          <div className="min-w-32">
            <label htmlFor="filter-status" className="form-label">
              Status
            </label>
            <select
              id="filter-status"
              value={statusFilter}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="form-select"
              style={selectStyle}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="declined">Declined</option>
            </select>
          </div>
          
          <div className="min-w-32">
            <label htmlFor="filter-fraud" className="form-label">
              Fraud
            </label>
            <select
              id="filter-fraud"
              value={fraudFilter}
              onChange={(e) => onFilterChange('fraud', e.target.value)}
              className="form-select"
              style={selectStyle}
            >
              <option value="">All Types</option>
              <option value="1">Fraudulent</option>
              <option value="0">Legitimate</option>
            </select>
          </div>
        </div>
        
        <div className="flex-shrink-0">
          <button
            onClick={onClearFilters}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilterControls