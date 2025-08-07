# RuleTune - Architecture Documentation

## Overview

RuleTune is a fraud detection web application built with React that allows users to explore transaction data and create rules for detecting fraudulent transactions. The application emphasizes modularity, maintainability, and clear separation of concerns.

## Technology Stack

- **Frontend Framework**: React 18 with JSX
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom component classes
- **Data Processing**: Papa Parse for CSV handling
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint with React plugins

## Architecture Overview

```
src/
├── components/           # React UI components
├── contexts/            # React contexts for global state
├── hooks/               # Custom React hooks
├── services/            # Data access and business services
├── utils/               # Pure utility functions
└── test/                # Test setup and utilities
```

## Core Architecture Patterns

### 1. Layered Architecture

The application follows a clean layered architecture:

1. **Presentation Layer** (`components/`) - UI components and user interactions
2. **Application Layer** (`hooks/`, `contexts/`) - Application logic and state management  
3. **Service Layer** (`services/`) - Data access and business operations
4. **Utility Layer** (`utils/`) - Pure functions and helpers

### 2. Service Pattern

Services handle all data operations and external dependencies:

- `DataService` - CSV data loading and processing
- `RulesService` - Rule CRUD operations with localStorage
- `AuthService` - Authentication state management

### 3. Custom Hooks Pattern

Complex state logic is encapsulated in reusable custom hooks:

- `useDataTable` - Table state (filtering, sorting, pagination)
- `useRules` - Rule management operations
- `useStats` - Dashboard statistics calculations

### 4. Context Pattern

Global application state is managed through React contexts:

- `ToastContext` - Application-wide notifications

## Component Architecture

### Component Hierarchy

```
App
├── ErrorBoundary
├── ToastProvider
├── Header
└── Main Content
    ├── Data Explorer Tab
    │   ├── StatsCards
    │   ├── FilterControls
    │   └── DataTable
    ├── Rules Tab
    │   └── RulesList
    └── Modals
        └── RuleEditor
```

### Component Types

1. **Container Components** (`App.jsx`) - Manage state and orchestrate child components
2. **Presentation Components** (`Header`, `StatsCards`, etc.) - Pure UI components
3. **Smart Components** (`DataTable`, `RuleEditor`) - Components with internal logic
4. **Provider Components** (`ErrorBoundary`, `ToastProvider`) - Cross-cutting concerns

## Data Flow

### 1. Data Loading Flow

```
User Action → App.jsx → DataService → CSV Fetch → Papa Parse → State Update → UI Render
```

### 2. Rule Management Flow

```
User Action → useRules Hook → RulesService → localStorage → State Update → Toast → UI Render
```

### 3. Table Operations Flow

```
User Interaction → useDataTable Hook → Utility Functions → State Update → Filtered/Sorted Data → DataTable Render
```

## State Management Strategy

### Local State (useState)
- Component-specific UI state
- Form inputs and local interactions
- Modal visibility and editing state

### Custom Hooks
- Complex, reusable state logic
- Business logic encapsulation
- Cross-component state coordination

### Context
- Global application state
- Cross-cutting concerns (notifications, themes)
- Provider-based dependency injection

### External State (localStorage)
- Persistent data storage
- User preferences and rules
- Authentication state

## Error Handling Strategy

### 1. Error Boundary Pattern
- `ErrorBoundary` component catches all unhandled JavaScript errors
- Provides graceful fallback UI with retry functionality
- Logs errors in development mode

### 2. Service Layer Error Handling
- Custom error classes (`ServiceError`, `NetworkError`, `ParseError`, `StorageError`)
- Standardized error handling with `withErrorHandling` wrapper
- Retry logic with exponential backoff for network operations

### 3. User Feedback
- Toast notifications for all user actions
- Success, error, warning, and info message types
- Auto-dismissing with manual close option

## Performance Considerations

### 1. React Performance
- `useMemo` for expensive calculations (stats, filtering, sorting)
- Component memoization where appropriate
- Efficient re-render patterns

### 2. Data Processing
- Client-side CSV processing with Papa Parse
- Pagination for large datasets (50 items per page)
- Efficient filtering and sorting algorithms

### 3. Bundle Size
- Tree-shaking enabled through ES modules
- Dynamic imports for future code splitting
- Efficient dependency management

## Security Considerations

### 1. Data Security
- No sensitive data stored in localStorage
- Client-side only processing
- No external API dependencies

### 2. Input Validation
- Form validation in rule editor
- CSV parsing error handling
- Safe data transformation utilities

## Testing Strategy

### 1. Unit Testing
- Service layer functions (DataService, RulesService)
- Utility functions (calculations, formatters)
- Custom hooks (with React Testing Library)

### 2. Integration Testing
- Component interaction testing
- Error boundary behavior
- Toast notification flow

### 3. Test Organization
```
src/
├── services/__tests__/
├── utils/__tests__/
└── test/
    └── setup.js
```

## Development Workflow

### 1. Code Quality
- ESLint configuration with React rules
- JSDoc documentation for all public APIs
- Consistent code formatting

### 2. Build Process
- Vite for fast development and building
- Hot module replacement in development
- Production optimization with tree-shaking

### 3. Development Scripts
```bash
npm run dev          # Development server
npm run build        # Production build
npm run test         # Run unit tests
npm run test:watch   # Watch mode testing
npm run lint         # Code linting
npm run lint:fix     # Auto-fix linting issues
```

## File Naming Conventions

- **Components**: PascalCase (e.g., `DataTable.jsx`)
- **Hooks**: camelCase starting with "use" (e.g., `useDataTable.js`)
- **Services**: PascalCase with "Service" suffix (e.g., `DataService.js`)
- **Utils**: camelCase (e.g., `calculations.js`)
- **Tests**: Same as source with `.test.js` suffix

## Future Architecture Considerations

### 1. Scalability
- Component lazy loading for larger applications
- State management library (Redux/Zustand) if complexity grows
- Micro-frontend architecture for team scaling

### 2. Performance
- Virtual scrolling for very large datasets
- Web Workers for heavy CSV processing
- Service Worker for offline functionality

### 3. Features
- Real-time data updates
- Advanced rule engine
- Multi-tenancy support
- API integration layer

## Development Best Practices

1. **Single Responsibility Principle** - Each module has one clear purpose
2. **Dependency Injection** - Services injected through props/context
3. **Error First** - Always handle error cases explicitly
4. **Test-Driven** - Write tests alongside implementation
5. **Documentation** - JSDoc for all public interfaces
6. **Consistent Patterns** - Follow established architectural patterns

This architecture provides a solid foundation for future development while maintaining clean separation of concerns and high code quality.