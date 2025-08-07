export const applyFilters = (data, filters) => {
  const { searchTerm, statusFilter, fraudFilter } = filters
  
  return data.filter(row => {
    const matchesSearch = !searchTerm || 
      Object.values(row).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    
    const matchesStatus = !statusFilter || row.state === statusFilter
    const matchesFraud = !fraudFilter || row.fraud === fraudFilter
    
    return matchesSearch && matchesStatus && matchesFraud
  })
}

export const createFilterState = () => ({
  searchTerm: '',
  statusFilter: '',
  fraudFilter: ''
})

export const clearAllFilters = (setFilters) => {
  setFilters(createFilterState())
}

export const setSpecificFilter = (setFilters, type, value) => {
  if (type === 'clear') {
    setFilters(createFilterState())
  } else {
    setFilters(_prev => ({
      ...createFilterState(), // Clear all first
      [type === 'status' ? 'statusFilter' : 'fraudFilter']: value
    }))
  }
}

export const updateFilter = (setFilters, type, value) => {
  const fieldMap = {
    'search': 'searchTerm',
    'status': 'statusFilter', 
    'fraud': 'fraudFilter'
  }
  
  const field = fieldMap[type]
  if (field) {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }
}

export const getActiveFilters = (filters) => ({
  search: filters.searchTerm,
  status: filters.statusFilter,
  fraud: filters.fraudFilter
})