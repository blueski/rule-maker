import React, { useState } from 'react'
import { Plus, Edit, Trash2, Copy } from 'lucide-react'

const RuleCard = ({ rule, onEdit, onDelete, onDuplicate }) => (
  <div className="card-elevated p-8 hover:shadow-large transition-all duration-200">
    <div className="flex justify-between items-start mb-6">
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-3">
          <h3 className="text-xl font-semibold text-primary-900">{rule.name}</h3>
          <span className={`${
            rule.active ? 'badge-success' : 'badge-neutral'
          }`}>
            {rule.active ? 'Active' : 'Inactive'}
          </span>
        </div>
        <p className="text-sm font-medium text-primary-600 uppercase tracking-wide mb-3">{rule.category}</p>
        <p className="text-sm text-primary-700 leading-relaxed">{rule.description}</p>
      </div>
      <div className="flex gap-2 ml-6">
        <button
          onClick={() => onEdit(rule)}
          className="p-3 text-primary-400 hover:text-accent-600 hover:bg-accent-50 rounded-lg transition-all duration-200"
          title="Edit rule"
        >
          <Edit className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDuplicate(rule)}
          className="p-3 text-primary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
          title="Duplicate rule"
        >
          <Copy className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(rule)}
          className="p-3 text-primary-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-all duration-200"
          title="Delete rule"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
    
    <div className="flex flex-wrap gap-6 text-xs text-primary-600 font-medium uppercase tracking-wide pt-4 border-t border-primary-100">
      <div>
        <span className="text-primary-500">Filters:</span> {rule.filters?.length || 0}
      </div>
      <div>
        <span className="text-primary-500">Threshold:</span> {rule.threshold?.operator} {rule.threshold?.value}
      </div>
      <div>
        <span className="text-primary-500">Frequency:</span> {rule.settings?.frequency}
      </div>
    </div>
  </div>
)

const EmptyState = ({ onCreateNew }) => (
  <div className="text-center py-20">
    <div className="mx-auto w-32 h-32 bg-primary-50 border-2 border-primary-200 rounded-full flex items-center justify-center mb-8">
      <Plus className="w-12 h-12 text-primary-400" />
    </div>
    <h3 className="text-2xl font-semibold text-primary-900 mb-4">No fraud detection rules yet</h3>
    <p className="text-primary-600 mb-8 max-w-lg mx-auto leading-relaxed">
      Create your first rule to start detecting fraudulent transactions automatically. 
      Define filters, thresholds, and alerts to catch suspicious activity.
    </p>
    <button
      onClick={onCreateNew}
      className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-base"
    >
      <Plus className="w-5 h-5" />
      Create New Rule
    </button>
  </div>
)

const RulesList = ({ rules = [], onCreateNew, onEditRule, onDeleteRule, onDuplicateRule }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(null)

  const handleDelete = (rule) => {
    setShowConfirmDelete(rule)
  }

  const confirmDelete = () => {
    onDeleteRule(showConfirmDelete.id)
    setShowConfirmDelete(null)
  }

  if (rules.length === 0) {
    return <EmptyState onCreateNew={onCreateNew} />
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-bold text-primary-900 tracking-tight mb-2">Fraud Detection Rules</h2>
          <p className="text-primary-600 text-lg">Manage your automated fraud detection rules.</p>
        </div>
        <button
          onClick={onCreateNew}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Rule
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
        {rules.map(rule => (
          <RuleCard
            key={rule.id}
            rule={rule}
            onEdit={onEditRule}
            onDelete={handleDelete}
            onDuplicate={onDuplicateRule}
          />
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card-elevated max-w-md w-full p-8">
            <h3 className="text-xl font-semibold text-primary-900 mb-3">Delete Rule</h3>
            <p className="text-primary-600 mb-6 leading-relaxed">
              Are you sure you want to delete "{showConfirmDelete.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmDelete(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RulesList