# RuleTune - Engineer's Introduction Guide

## Overview

RuleTune is a fraud detection web application that allows users to analyze credit card transaction data and create rules for detecting fraudulent transactions. This guide assumes you're familiar with JavaScript but new to React, and will walk you through the codebase structure and key concepts.

## What is React?

React is a JavaScript library for building user interfaces using **components** - reusable pieces of UI that manage their own state and compose together to make complex interfaces. Think of components like functions that return HTML-like syntax called **JSX**.

### Key React Concepts You'll Encounter

```jsx
// A simple React component
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>
}

// Using the component
<Welcome name="Engineer" />
```

- **JSX**: HTML-like syntax in JavaScript
- **Props**: Data passed to components (like function parameters)
- **State**: Data that changes over time within a component
- **Hooks**: Functions that let you "hook into" React features

## Project Structure

```
src/
├── components/          # UI Components (React components)
├── contexts/           # Global state management
├── hooks/              # Custom React hooks (reusable logic)
├── services/           # Data access layer
├── utils/              # Pure utility functions
└── test/               # Test setup
```

## Architecture Patterns Explained

### 1. Component-Based Architecture

Instead of one large JavaScript file, we break the UI into small, reusable components:

```jsx
// components/Header.jsx - Navigation component
function Header({ activeTab, onTabChange }) {
  return (
    <header>
      <button onClick={() => onTabChange('data-explorer')}>
        Data Explorer
      </button>
      {/* More buttons */}
    </header>
  )
}
```

**Why this matters**: Each component handles one responsibility, making code easier to understand, test, and modify.

### 2. Service Layer Pattern

Services handle all data operations, keeping components focused on UI:

```javascript
// services/dataService.js - Handles CSV data loading
export class DataService {
  static async loadCSVData() {
    const response = await fetch('./data.csv')
    const csvText = await response.text()
    // Parse CSV and return data
  }
}
```

**Why this matters**: If you need to change how data is loaded (e.g., from an API instead of CSV), you only modify the service, not every component.

### 3. Custom Hooks Pattern

Hooks let you extract and reuse stateful logic:

```javascript
// hooks/useDataTable.js - Manages table state
export const useDataTable = (data) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState({ column: null, direction: 'asc' })
  
  // Return state and functions to modify it
  return {
    currentPage,
    sortConfig,
    handleSort: (column) => { /* sorting logic */ }
  }
}
```

**Why this matters**: Multiple components can use the same table logic without duplicating code.

## Key Files Walkthrough

### 1. `src/App.jsx` - Main Application Component

This is the heart of the application. It:

```jsx
function App() {
  // Application state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('data-explorer')
  const [data, setData] = useState([])
  
  // Custom hooks for complex logic
  const dataTable = useDataTable(data)
  const rules = useRules()
  const stats = useStats(data)
  
  // Load data when user authenticates
  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated])
  
  // Render different content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'data-explorer':
        return <DataTable data={dataTable.paginatedData} />
      case 'rules':
        return <RulesList rules={rules.rules} />
    }
  }
}
```

**Key concepts**:
- `useState`: Manages changing data (like current tab)
- `useEffect`: Runs code when something changes (like authentication status)
- Custom hooks: `useDataTable`, `useRules` encapsulate complex logic

### 2. `src/components/DataTable.jsx` - Data Display Component

Shows transaction data in a table with sorting and pagination:

```jsx
function DataTable({ data, loading, sortConfig, onSort, currentPage, totalPages }) {
  // Handle loading state
  if (loading) {
    return <div>Loading...</div>
  }
  
  // Render table
  return (
    <table>
      <thead>
        {headers.map(header => (
          <th onClick={() => onSort(header)}>
            {formatHeaderName(header)}
          </th>
        ))}
      </thead>
      <tbody>
        {data.map(row => (
          <tr key={row.id}>
            {/* Render row data */}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

**Key concepts**:
- **Props**: Component receives `data`, `loading`, etc. from parent
- **Conditional rendering**: Show different UI based on loading state
- **Event handlers**: `onSort` function called when user clicks headers

### 3. `src/services/dataService.js` - Data Loading Service

Handles CSV file loading and parsing:

```javascript
export class DataService {
  static async loadCSVData() {
    // Retry logic with exponential backoff
    return retryWithBackoff(
      async () => {
        const response = await fetch('./data.csv')
        if (!response.ok) {
          throw new NetworkError(`HTTP ${response.status}`)
        }
        
        const csvText = await response.text()
        return this.parseCSV(csvText)
      },
      { maxAttempts: 3, shouldRetry: shouldRetryError }
    )
  }
}
```

**Key concepts**:
- **Static methods**: Called on class itself, not instances
- **Async/await**: Handles asynchronous operations (file loading)
- **Error handling**: Custom error types and retry logic

### 4. `src/hooks/useDataTable.js` - Table State Management

Encapsulates all table-related logic:

```javascript
export const useDataTable = (data, pageSize = 50) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState({ column: null, direction: 'asc' })
  const [filters, setFilters] = useState({ searchTerm: '', statusFilter: '' })
  
  // Computed values using useMemo (only recalculate when dependencies change)
  const filteredData = useMemo(() => {
    return applyFilters(data, filters)
  }, [data, filters])
  
  const paginatedData = useMemo(() => {
    return calculatePagination(filteredData, currentPage, pageSize)
  }, [filteredData, currentPage, pageSize])
  
  // Return everything components need
  return {
    filteredData,
    paginatedData,
    currentPage,
    setCurrentPage,
    handleSort,
    handleFilterChange
  }
}
```

**Key concepts**:
- **Custom hook**: Starts with "use", encapsulates stateful logic
- **useMemo**: Optimizes performance by caching expensive calculations
- **Separation of concerns**: All table logic in one place

## Data Flow Architecture

Understanding how data flows through the application:

```
1. User Action (click, type, etc.)
   ↓
2. Event Handler (in component)
   ↓  
3. State Update (useState, custom hook)
   ↓
4. Service Call (if needed - DataService, RulesService)
   ↓
5. State Update with Result
   ↓
6. Component Re-render
   ↓
7. UI Update (user sees result)
```

### Example: Loading Data

```javascript
// 1. User authenticates, triggers useEffect
useEffect(() => {
  if (isAuthenticated) {
    loadData()  // 2. Call loadData function
  }
}, [isAuthenticated])

const loadData = async () => {
  try {
    setLoading(true)  // 3. Update loading state
    const csvData = await DataService.loadCSVData()  // 4. Service call
    setData(csvData)  // 5. Update data state
    toast.success('Data loaded successfully')  // 6. Show success message
  } catch (error) {
    toast.error('Failed to load data')  // 6. Show error message
  } finally {
    setLoading(false)  // 7. Clear loading state
  }
}
```

## State Management Strategy

### Local State (useState)
For component-specific data that doesn't need sharing:

```javascript
const [showModal, setShowModal] = useState(false)
const [inputValue, setInputValue] = useState('')
```

### Custom Hooks
For complex logic that can be reused:

```javascript
const dataTable = useDataTable(data)  // Handles sorting, filtering, pagination
const rules = useRules()              // Handles rule CRUD operations
```

### Context API
For global state that many components need:

```javascript
// contexts/ToastContext.jsx - Global notifications
const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  return context  // { success, error, warning, info }
}
```

## Error Handling Architecture

### 1. Error Boundaries
Catch JavaScript errors in components:

```jsx
// components/ErrorBoundary.jsx
class ErrorBoundary extends Component {
  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error)
    this.setState({ hasError: true })
  }
  
  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. <button>Try Again</button></div>
    }
    return this.props.children
  }
}
```

### 2. Service-Level Error Handling
Custom error types with retry logic:

```javascript
// utils/errorHandling.js
export class NetworkError extends Error {
  constructor(message) {
    super(message)
    this.name = 'NetworkError'
    this.code = 'NETWORK_ERROR'
  }
}

export const retryWithBackoff = async (operation, options) => {
  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await operation()
    } catch (error) {
      if (attempt === options.maxAttempts) throw error
      await delay(calculateBackoff(attempt))
    }
  }
}
```

### 3. User-Facing Error Messages
Toast notifications for user feedback:

```javascript
const toast = useToast()

try {
  await RulesService.createRule(ruleData)
  toast.success('Rule created successfully')
} catch (error) {
  toast.error('Failed to create rule')
}
```

## Testing Strategy

### Unit Tests
Test individual functions and components:

```javascript
// services/__tests__/dataService.test.js
describe('DataService', () => {
  it('should load and parse CSV data', async () => {
    // Mock fetch response
    global.fetch.mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('header1,header2\nvalue1,value2')
    })
    
    const result = await DataService.loadCSVData()
    expect(result).toEqual([{ header1: 'value1', header2: 'value2' }])
  })
})
```

### Component Tests
Test component behavior:

```javascript
import { render, screen, fireEvent } from '@testing-library/react'

test('DataTable shows loading spinner when loading', () => {
  render(<DataTable loading={true} data={[]} />)
  expect(screen.getByText('Loading transaction data...')).toBeInTheDocument()
})
```

## Development Workflow

### 1. Starting Development
```bash
npm install          # Install dependencies
npm run dev         # Start development server
npm run test:watch  # Run tests in watch mode (optional)
```

### 2. Making Changes
1. Identify which layer needs changes:
   - **UI changes**: Modify components
   - **Data changes**: Modify services
   - **Logic changes**: Modify utils or hooks

2. Write/update tests for your changes

3. Test in browser at http://localhost:3000

### 3. Code Quality
```bash
npm run lint        # Check for code issues
npm run lint:fix    # Auto-fix issues
npm run test        # Run all tests
npm run build       # Test production build
```

## Common Patterns & Best Practices

### 1. Component Composition
Break large components into smaller ones:

```jsx
// Instead of one large component
function DataExplorer() {
  return (
    <div>
      {/* 200 lines of JSX */}
    </div>
  )
}

// Break into smaller components
function DataExplorer() {
  return (
    <div>
      <StatsCards stats={stats} />
      <FilterControls filters={filters} />
      <DataTable data={data} />
    </div>
  )
}
```

### 2. Props vs State
- **Props**: Data passed from parent component (read-only)
- **State**: Data that changes within component

```jsx
function UserProfile({ userId }) {  // userId is a prop
  const [user, setUser] = useState(null)  // user is state
  
  useEffect(() => {
    loadUser(userId).then(setUser)  // Load user when userId changes
  }, [userId])
}
```

### 3. Event Handling
Always use arrow functions or bind context:

```jsx
// Good - arrow function
const handleClick = () => {
  setCount(count + 1)
}

// Good - using callback with current state
const handleClick = () => {
  setCount(prevCount => prevCount + 1)
}

// Bad - will lose context
function handleClick() {
  this.setCount(count + 1)  // 'this' is undefined
}
```

### 4. Conditional Rendering
Show different UI based on state:

```jsx
function DataTable({ loading, data, error }) {
  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  if (!data?.length) return <EmptyState />
  
  return <Table data={data} />
}
```

## Key Libraries Used

### 1. Papa Parse
CSV parsing library:
```javascript
Papa.parse(csvText, {
  header: true,        // Use first row as headers
  skipEmptyLines: true,
  complete: (results) => {
    console.log(results.data)  // Array of objects
  }
})
```

### 2. Lucide React
Icon library:
```jsx
import { ChevronUp, Loader2, AlertCircle } from 'lucide-react'

<ChevronUp className="w-4 h-4" />
<Loader2 className="animate-spin" />
```

### 3. Tailwind CSS
Utility-first CSS framework:
```jsx
<div className="bg-white p-4 rounded-lg shadow-md border">
  {/* bg-white = white background */}
  {/* p-4 = padding 1rem */}
  {/* rounded-lg = border radius */}
  {/* shadow-md = medium shadow */}
</div>
```

## Debugging Tips

### 1. React Developer Tools
Install React DevTools browser extension to:
- Inspect component tree
- View props and state
- Track state changes

### 2. Console Debugging
```javascript
// Log component renders
useEffect(() => {
  console.log('Component rendered with data:', data)
})

// Log state changes
useEffect(() => {
  console.log('Current page changed:', currentPage)
}, [currentPage])
```

### 3. Network Issues
Check browser Network tab for:
- Failed CSV loading
- Error responses
- Slow requests

### 4. Common Issues
- **Component not updating**: Check if state is being mutated directly
- **Infinite re-renders**: Check useEffect dependencies
- **Props not passed**: Check parent component is passing props correctly

## Next Steps

Now that you understand the architecture:

1. **Explore the codebase**: Start with `App.jsx` and trace through the data flow
2. **Run the tests**: `npm run test` to see how components are tested
3. **Make a small change**: Try modifying a component and see the results
4. **Read React docs**: https://react.dev/ for deeper understanding

The codebase follows React best practices and modern patterns, making it a good example of production-ready React code. Each component, hook, and service has a clear responsibility, making the code predictable and maintainable.