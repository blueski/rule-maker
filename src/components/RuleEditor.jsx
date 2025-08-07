import React, { useState, useEffect } from 'react'
import { X, Plus } from 'lucide-react'
import FilterRow from './FilterRow'

const RuleEditor = ({ rule, onSave, onCancel, columns = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    filters: [{ column: '', operator: '', value: '' }],
    filterConnectors: [],
    threshold: { operator: 'greater_than', value: '' },
    settings: {
      reAlertDays: 7,
      frequency: 'daily',
      action: 'email_notification'
    },
    active: true
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (rule) {
      setFormData(rule)
    }
  }, [rule])

  const categories = [
    'Transaction Amount',
    'Merchant Analysis', 
    'Location Based',
    'User Behavior',
    'Payment Method',
    'Time Based',
    'Custom'
  ]

  const thresholdOperators = [
    { value: 'greater_than', label: 'Greater than' },
    { value: 'less_than', label: 'Less than' },
    { value: 'equals', label: 'Equals' },
    { value: 'greater_equal', label: 'Greater than or equal to' },
    { value: 'less_equal', label: 'Less than or equal to' }
  ]

  const frequencies = [
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' }
  ]

  const actions = [
    { value: 'email_notification', label: 'Send an email notification' }
  ]

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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }))
    }
  }

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleFilterUpdate = (index, filterData) => {
    setFormData(prev => ({
      ...prev,
      filters: prev.filters.map((filter, i) => 
        i === index ? filterData : filter
      )
    }))
  }

  const handleAddFilter = () => {
    setFormData(prev => ({
      ...prev,
      filters: [...prev.filters, { column: '', operator: '', value: '' }],
      filterConnectors: [...prev.filterConnectors, 'AND']
    }))
  }

  const handleDeleteFilter = (index) => {
    if (formData.filters.length > 1) {
      setFormData(prev => ({
        ...prev,
        filters: prev.filters.filter((_, i) => i !== index),
        filterConnectors: prev.filterConnectors.filter((_, i) => i !== index && i !== index - 1)
      }))
    }
  }

  const handleConnectorChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      filterConnectors: prev.filterConnectors.map((connector, i) => 
        i === index ? value : connector
      )
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    // Validate filters
    const invalidFilters = formData.filters.some(filter => 
      !filter.column || !filter.operator || 
      (filter.operator !== 'is_empty' && filter.operator !== 'is_not_empty' && !filter.value)
    )
    
    if (invalidFilters) {
      newErrors.filters = 'All filters must be complete'
    }

    if (!formData.threshold.value) {
      newErrors.threshold = 'Threshold value is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        ...formData,
        id: rule?.id || Date.now().toString(),
        createdAt: rule?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="card-elevated w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-8 py-6 border-b border-primary-100">
          <h2 className="text-2xl font-semibold text-primary-900">
            {rule ? 'Edit Rule' : 'Create New Rule'}
          </h2>
          <button
            onClick={onCancel}
            className="p-3 text-primary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-12">
          {/* Rule Details */}
          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-primary-900">Rule Details</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <label className="form-label">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`form-input ${
                    errors.name ? 'border-danger-300 focus:border-danger-600 focus:ring-danger-100' : ''
                  }`}
                  placeholder="Enter rule name..."
                />
                {errors.name && <p className="form-error">{errors.name}</p>}
              </div>
              
              <div>
                <label className="form-label">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`form-select ${
                    errors.category ? 'border-danger-300 focus:border-danger-600 focus:ring-danger-100' : ''
                  }`}
                  style={selectStyle}
                >
                  <option value="">Select category...</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="form-error">{errors.category}</p>}
              </div>
            </div>

            <div>
              <label className="form-label">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className={`form-textarea ${
                  errors.description ? 'border-danger-300 focus:border-danger-600 focus:ring-danger-100' : ''
                }`}
                placeholder="Describe what this rule detects..."
              />
              {errors.description && <p className="form-error">{errors.description}</p>}
            </div>
          </div>

          {/* 1. Analysis Logic */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-primary-900">1. Analysis Logic</h3>
              <p className="text-sm text-primary-600 mt-2">
                Define the conditions that transactions must meet to trigger this rule.
              </p>
            </div>
            
            <div className="space-y-4">
              {formData.filters.map((filter, index) => (
                <div key={index}>
                  <FilterRow
                    filter={filter}
                    index={index}
                    columns={columns}
                    onUpdateFilter={handleFilterUpdate}
                    onDeleteFilter={handleDeleteFilter}
                    showDelete={formData.filters.length > 1}
                  />
                  
                  {index < formData.filters.length - 1 && (
                    <div className="flex justify-center py-4">
                      <div className="toggle-container">
                        <button
                          type="button"
                          onClick={() => handleConnectorChange(index, 'AND')}
                          className={`toggle-button ${
                            formData.filterConnectors[index] === 'AND'
                              ? 'toggle-active'
                              : 'toggle-inactive'
                          }`}
                        >
                          AND
                        </button>
                        <button
                          type="button"
                          onClick={() => handleConnectorChange(index, 'OR')}
                          className={`toggle-button ${
                            formData.filterConnectors[index] === 'OR'
                              ? 'toggle-active'
                              : 'toggle-inactive'
                          }`}
                        >
                          OR
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <button
              type="button"
              onClick={handleAddFilter}
              className="btn-ghost inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Filter
            </button>
            
            {errors.filters && <p className="form-error">{errors.filters}</p>}
          </div>

          {/* 2. Trigger Threshold */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-primary-900">2. Trigger Threshold</h3>
              <p className="text-sm text-primary-600 mt-2">
                Define the condition on the analysis result that will fire an alert.
              </p>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm font-medium text-primary-700">
                Fire alert when analysis result is:
              </p>
              <div className="flex items-center gap-4 max-w-lg">
                <select
                  value={formData.threshold.operator}
                  onChange={(e) => handleNestedChange('threshold', 'operator', e.target.value)}
                  className="form-select w-48"
                  style={selectStyle}
                >
                  {thresholdOperators.map(op => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={formData.threshold.value}
                  onChange={(e) => handleNestedChange('threshold', 'value', e.target.value)}
                  className={`form-input w-32 ${
                    errors.threshold ? 'border-danger-300 focus:border-danger-600 focus:ring-danger-100' : ''
                  }`}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            {errors.threshold && <p className="form-error">{errors.threshold}</p>}
          </div>

          {/* Settings */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-primary-900">Settings</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div>
                <label className="form-label">
                  Re-alert frequency
                </label>
                <select
                  value={formData.settings.reAlertDays}
                  onChange={(e) => handleNestedChange('settings', 'reAlertDays', parseInt(e.target.value))}
                  className="form-select"
                  style={selectStyle}
                >
                  {Array.from({ length: 30 }, (_, i) => i + 1).map(days => (
                    <option key={days} value={days}>
                      {days} day{days !== 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="form-label">
                  Check frequency
                </label>
                <select
                  value={formData.settings.frequency}
                  onChange={(e) => handleNestedChange('settings', 'frequency', e.target.value)}
                  className="form-select"
                  style={selectStyle}
                >
                  {frequencies.map(freq => (
                    <option key={freq.value} value={freq.value}>{freq.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="form-label">
                  Action
                </label>
                <select
                  value={formData.settings.action}
                  onChange={(e) => handleNestedChange('settings', 'action', e.target.value)}
                  className="form-select"
                  style={selectStyle}
                >
                  {actions.map(action => (
                    <option key={action.value} value={action.value}>{action.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 px-8 py-6 border-t border-primary-100 bg-primary-25">
          <button
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn-primary"
          >
            Save Rule
          </button>
        </div>
      </div>
    </div>
  )
}

export default RuleEditor