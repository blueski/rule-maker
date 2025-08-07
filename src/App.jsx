import { useState, useEffect, useMemo } from 'react'
import Header from './components/Header'
import StatsCards from './components/StatsCards'
import DataTable from './components/DataTable'
import FilterControls from './components/FilterControls'
import RulesList from './components/RulesList'
import RuleEditor from './components/RuleEditor'
import LoginForm from './components/LoginForm'
import ErrorBoundary from './components/ErrorBoundary'
import { DataService } from './services/dataService'
import { AuthService } from './services/authService'
import { useDataTable } from './hooks/useDataTable'
import { useRules } from './hooks/useRules'
import { useStats } from './hooks/useStats'
import { ToastProvider, useToast } from './contexts/ToastContext'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('data-explorer')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  
  // Custom hooks
  const dataTable = useDataTable(data)
  const rules = useRules()
  const stats = useStats(data)
  
  const pageSize = 50

  const toast = useToast()

  const loadData = async () => {
    try {
      setLoading(true)
      const csvData = await DataService.loadCSVData()
      setData(csvData)
      setLoading(false)
      toast.success('Data loaded successfully')
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load transaction data. Please try again.')
      setLoading(false)
    }
  }

  useEffect(() => {
    // Check if user was previously authenticated
    setIsAuthenticated(AuthService.isAuthenticated())
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated])




  const handleLogin = (status) => {
    setIsAuthenticated(status)
    if (status) {
      AuthService.login()
    } else {
      AuthService.logout()
    }
  }

  // Get column names from data for the rule editor
  const columnNames = useMemo(() => {
    return DataService.getColumnNames(data)
  }, [data])

  const renderTabContent = () => {
    switch (activeTab) {
      case 'data-explorer':
        return (
          <>
            <StatsCards 
              stats={stats} 
              onFilterClick={dataTable.handleStatCardFilter}
              activeFilters={dataTable.activeFilters}
            />
            
            <FilterControls
              searchTerm={dataTable.filters.searchTerm}
              statusFilter={dataTable.filters.statusFilter}
              fraudFilter={dataTable.filters.fraudFilter}
              onFilterChange={dataTable.handleFilterChange}
              onClearFilters={dataTable.handleClearFilters}
            />
            
            <DataTable
              data={dataTable.paginatedData}
              loading={loading}
              sortConfig={dataTable.sortConfig}
              onSort={dataTable.handleSort}
              currentPage={dataTable.currentPage}
              totalPages={dataTable.totalPages}
              totalItems={dataTable.totalItems}
              pageSize={pageSize}
              onPageChange={dataTable.setCurrentPage}
            />
          </>
        )
      case 'rules':
        return (
          <RulesList
            rules={rules.rules}
            onCreateNew={rules.handleCreateRule}
            onEditRule={rules.handleEditRule}
            onDeleteRule={rules.handleDeleteRule}
            onDuplicateRule={rules.handleDuplicateRule}
          />
        )
      case 'queries':
        return <div className="text-center py-12"><h2 className="text-xl text-gray-600">Queries tab coming soon...</h2></div>
      default:
        return null
    }
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-primary-50">
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {renderTabContent()}
        </main>

        {/* Rule Editor Modal */}
        {rules.showRuleEditor && (
          <RuleEditor
            rule={rules.editingRule}
            columns={columnNames}
            onSave={rules.handleSaveRule}
            onCancel={rules.handleCancelRuleEditor}
          />
        )}
      </div>
    </ErrorBoundary>
  )
}

export default App