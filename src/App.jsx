import { useState, useEffect, useMemo } from 'react'
import Papa from 'papaparse'
import { CreditCard, AlertTriangle, Ban, Percent, RotateCcw } from 'lucide-react'
import Header from './components/Header'
import StatsCards from './components/StatsCards'
import DataTable from './components/DataTable'
import FilterControls from './components/FilterControls'
import RulesList from './components/RulesList'
import RuleEditor from './components/RuleEditor'
import LoginForm from './components/LoginForm'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('data-explorer')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [fraudFilter, setFraudFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState({ column: null, direction: 'asc' })
  
  // Rules state
  const [rules, setRules] = useState([])
  const [showRuleEditor, setShowRuleEditor] = useState(false)
  const [editingRule, setEditingRule] = useState(null)
  
  const pageSize = 50

  const loadData = async () => {
    try {
      setLoading(true)
      const response = await fetch('./data.csv')
      const csvText = await response.text()
      
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setData(results.data)
          setLoading(false)
        },
        error: (error) => {
          console.error('Error parsing CSV:', error)
          setLoading(false)
        }
      })
    } catch (error) {
      console.error('Error loading CSV file:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    // Check if user was previously authenticated
    const authStatus = localStorage.getItem('authStatus')
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadData()
      loadRules()
    }
  }, [isAuthenticated])

  // Rules management functions
  const loadRules = () => {
    try {
      const savedRules = localStorage.getItem('fraudDetectionRules')
      if (savedRules) {
        setRules(JSON.parse(savedRules))
      }
    } catch (error) {
      console.error('Error loading rules:', error)
    }
  }

  const saveRulesToStorage = (updatedRules) => {
    try {
      localStorage.setItem('fraudDetectionRules', JSON.stringify(updatedRules))
      setRules(updatedRules)
    } catch (error) {
      console.error('Error saving rules:', error)
    }
  }

  const handleCreateRule = () => {
    setEditingRule(null)
    setShowRuleEditor(true)
  }

  const handleEditRule = (rule) => {
    setEditingRule(rule)
    setShowRuleEditor(true)
  }

  const handleDeleteRule = (ruleId) => {
    const updatedRules = rules.filter(rule => rule.id !== ruleId)
    saveRulesToStorage(updatedRules)
  }

  const handleDuplicateRule = (rule) => {
    const duplicatedRule = {
      ...rule,
      id: Date.now().toString(),
      name: `${rule.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const updatedRules = [...rules, duplicatedRule]
    saveRulesToStorage(updatedRules)
  }

  const handleSaveRule = (ruleData) => {
    let updatedRules
    if (editingRule) {
      updatedRules = rules.map(rule => 
        rule.id === editingRule.id ? ruleData : rule
      )
    } else {
      updatedRules = [...rules, ruleData]
    }
    saveRulesToStorage(updatedRules)
    setShowRuleEditor(false)
    setEditingRule(null)
  }

  const handleCancelRuleEditor = () => {
    setShowRuleEditor(false)
    setEditingRule(null)
  }

  const filteredData = useMemo(() => {
    let filtered = data.filter(row => {
      const matchesSearch = !searchTerm || 
        Object.values(row).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      
      const matchesStatus = !statusFilter || row.state === statusFilter
      const matchesFraud = !fraudFilter || row.fraud === fraudFilter
      
      return matchesSearch && matchesStatus && matchesFraud
    })

    if (sortConfig.column) {
      filtered.sort((a, b) => {
        let aVal = a[sortConfig.column]
        let bVal = b[sortConfig.column]
        
        if (!isNaN(aVal) && !isNaN(bVal)) {
          aVal = parseFloat(aVal)
          bVal = parseFloat(bVal)
        }
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [data, searchTerm, statusFilter, fraudFilter, sortConfig])

  const paginatedData = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize
    return filteredData.slice(startIdx, startIdx + pageSize)
  }, [filteredData, currentPage, pageSize])

  const stats = useMemo(() => {
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
  }, [data])

  const handleSort = (column) => {
    setSortConfig(prev => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
    setCurrentPage(1)
  }

  const handleFilterChange = (type, value) => {
    if (type === 'search') setSearchTerm(value)
    else if (type === 'status') setStatusFilter(value)
    else if (type === 'fraud') setFraudFilter(value)
    setCurrentPage(1)
  }

  const handleStatCardFilter = (type, value) => {
    if (type === 'clear') {
      setSearchTerm('')
      setStatusFilter('')
      setFraudFilter('')
    } else {
      // Clear all filters first, then set the specific one
      setSearchTerm('')
      setStatusFilter('')
      setFraudFilter('')
      
      if (type === 'status') setStatusFilter(value)
      else if (type === 'fraud') setFraudFilter(value)
    }
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setStatusFilter('')
    setFraudFilter('')
    setCurrentPage(1)
  }

  const handleLogin = (status) => {
    setIsAuthenticated(status)
    if (status) {
      localStorage.setItem('authStatus', 'authenticated')
    } else {
      localStorage.removeItem('authStatus')
    }
  }

  const activeFilters = {
    search: searchTerm,
    status: statusFilter,
    fraud: fraudFilter
  }

  // Get column names from data for the rule editor
  const columnNames = useMemo(() => {
    if (data.length > 0) {
      return Object.keys(data[0])
    }
    return []
  }, [data])

  const totalPages = Math.ceil(filteredData.length / pageSize)

  const renderTabContent = () => {
    switch (activeTab) {
      case 'data-explorer':
        return (
          <>
            <StatsCards 
              stats={stats} 
              onFilterClick={handleStatCardFilter}
              activeFilters={activeFilters}
            />
            
            <FilterControls
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              fraudFilter={fraudFilter}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
            
            <DataTable
              data={paginatedData}
              loading={loading}
              sortConfig={sortConfig}
              onSort={handleSort}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredData.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </>
        )
      case 'rules':
        return (
          <RulesList
            rules={rules}
            onCreateNew={handleCreateRule}
            onEditRule={handleEditRule}
            onDeleteRule={handleDeleteRule}
            onDuplicateRule={handleDuplicateRule}
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
    <div className="min-h-screen bg-primary-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {renderTabContent()}
      </main>

      {/* Rule Editor Modal */}
      {showRuleEditor && (
        <RuleEditor
          rule={editingRule}
          columns={columnNames}
          onSave={handleSaveRule}
          onCancel={handleCancelRuleEditor}
        />
      )}
    </div>
  )
}

export default App