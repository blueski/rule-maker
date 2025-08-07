import React from 'react'
import { Trash2 } from 'lucide-react'

const FilterRow = ({ 
  filter, 
  index, 
  columns, 
  onUpdateFilter, 
  onDeleteFilter, 
  showDelete = true 
}) => {
  const operators = [
    { value: 'equals', label: 'equals', numeric: false, text: true },
    { value: 'not_equals', label: 'does not equal', numeric: false, text: true },
    { value: 'contains', label: 'contains', numeric: false, text: true },
    { value: 'not_contains', label: 'does not contain', numeric: false, text: true },
    { value: 'starts_with', label: 'starts with', numeric: false, text: true },
    { value: 'ends_with', label: 'ends with', numeric: false, text: true },
    { value: 'greater_than', label: 'is greater than', numeric: true, text: false },
    { value: 'less_than', label: 'is less than', numeric: true, text: false },
    { value: 'greater_equal', label: 'is greater than or equal to', numeric: true, text: false },
    { value: 'less_equal', label: 'is less than or equal to', numeric: true, text: false },
    { value: 'is_empty', label: 'is empty', numeric: false, text: true },
    { value: 'is_not_empty', label: 'is not empty', numeric: false, text: true }
  ]

  const numericColumns = [
    'charged_amount', 'user_id', 'transaction_id', 'merchant_id', 'sub_merchant_id', 'mcc'
  ]

  const isNumericColumn = (columnName) => {
    return numericColumns.includes(columnName) || columnName.includes('amount')
  }

  const getAvailableOperators = () => {
    if (!filter.column) return operators
    
    const isNumeric = isNumericColumn(filter.column)
    return operators.filter(op => {
      if (isNumeric) {
        return op.numeric || op.value === 'equals' || op.value === 'not_equals' || 
               op.value === 'is_empty' || op.value === 'is_not_empty'
      } else {
        return op.text
      }
    })
  }

  const needsValue = () => {
    return filter.operator && !['is_empty', 'is_not_empty'].includes(filter.operator)
  }

  const getInputType = () => {
    if (!filter.column) return 'text'
    return isNumericColumn(filter.column) ? 'number' : 'text'
  }

  const getColumnDisplayName = (columnName) => {
    return columnName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

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
    <div className="flex items-center gap-4 p-6 bg-primary-25 border border-primary-100 rounded-lg">
      <div className="flex-1">
        <select
          value={filter.column || ''}
          onChange={(e) => onUpdateFilter(index, { column: e.target.value, operator: '', value: '' })}
          className="form-select"
          style={selectStyle}
        >
          <option value="">Select column...</option>
          {columns.map(col => (
            <option key={col} value={col}>
              {getColumnDisplayName(col)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <select
          value={filter.operator || ''}
          onChange={(e) => onUpdateFilter(index, { ...filter, operator: e.target.value })}
          className="form-select disabled:opacity-50 disabled:cursor-not-allowed"
          style={selectStyle}
          disabled={!filter.column}
        >
          <option value="">Select operator...</option>
          {getAvailableOperators().map(op => (
            <option key={op.value} value={op.value}>
              {op.label}
            </option>
          ))}
        </select>
      </div>

      {needsValue() && (
        <div className="flex-1">
          <input
            type={getInputType()}
            value={filter.value || ''}
            onChange={(e) => onUpdateFilter(index, { ...filter, value: e.target.value })}
            placeholder="Enter value..."
            className="form-input"
          />
        </div>
      )}

      {showDelete && (
        <button
          onClick={() => onDeleteFilter(index)}
          className="p-3 text-primary-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-all duration-200"
          title="Remove filter"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}

export default FilterRow