import React from 'react'
import { CreditCard, AlertTriangle, Ban, Percent } from 'lucide-react'

const StatCard = ({ icon: Icon, title, value, color, onClick, isActive, isClickable = true }) => (
  <div 
    className={`stat-card transition-all duration-200 ${
      isClickable ? 'cursor-pointer hover:shadow-medium' : 'cursor-default'
    } ${
      isActive ? 'ring-2 ring-accent-500 bg-accent-50 border-accent-200' : (isClickable ? 'hover:bg-primary-25 hover:border-primary-200' : '')
    }`}
    onClick={isClickable ? onClick : undefined}
  >
    <div className="flex items-start space-x-6">
      <div className={`stat-icon ${color} flex-shrink-0`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-primary-600 uppercase tracking-wide mb-2">{title}</p>
        <p className="text-3xl font-bold text-primary-900 tracking-tight">{value}</p>
      </div>
    </div>
  </div>
)

const StatsCards = ({ stats, onFilterClick, activeFilters }) => {
  const noFiltersActive = !activeFilters.fraud && !activeFilters.status && !activeFilters.search;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
      <StatCard
        icon={CreditCard}
        title="Total Transactions"
        value={stats.total}
        color="bg-primary-50 text-primary-700 border-primary-200"
        onClick={() => onFilterClick('clear')}
        isActive={noFiltersActive}
      />
      <StatCard
        icon={AlertTriangle}
        title="Fraudulent"
        value={stats.fraudCount}
        color="bg-danger-50 text-danger-700 border-danger-200"
        onClick={() => onFilterClick('fraud', '1')}
        isActive={activeFilters.fraud === '1'}
      />
      <StatCard
        icon={Ban}
        title="Declined"
        value={stats.declinedCount}
        color="bg-warning-50 text-warning-700 border-warning-200"
        onClick={() => onFilterClick('status', 'declined')}
        isActive={activeFilters.status === 'declined'}
      />
      <StatCard
        icon={Percent}
        title="Fraud Rate"
        value={stats.fraudRate}
        color="bg-success-50 text-success-700 border-success-200"
        isClickable={false}
        isActive={false}
      />
    </div>
  )
}

export default StatsCards