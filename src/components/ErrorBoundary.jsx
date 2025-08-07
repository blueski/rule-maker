import { Component } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

/**
 * React Error Boundary component for graceful error handling and recovery
 * Catches JavaScript errors anywhere in the child component tree and displays a fallback UI
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Error Boundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Report to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: reportError(error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state
      const isDevelopment = process.env.NODE_ENV === 'development'

      return (
        <div className="min-h-screen bg-primary-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full">
            <div className="card-elevated p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-danger-600" />
                </div>
                
                <h1 className="text-2xl font-bold text-primary-900 mb-2">
                  Something went wrong
                </h1>
                
                <p className="text-primary-600 mb-6">
                  We apologize for the inconvenience. The application encountered an unexpected error.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={this.handleRetry}
                    className="btn-primary flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </button>
                  
                  <button
                    onClick={this.handleGoHome}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    Go Home
                  </button>
                </div>

                {isDevelopment && error && (
                  <details className="mt-6 text-left">
                    <summary className="cursor-pointer text-sm font-medium text-primary-700 hover:text-primary-900">
                      Show Error Details (Development)
                    </summary>
                    <div className="mt-3 p-4 bg-danger-50 border border-danger-200 rounded-lg text-sm">
                      <div className="mb-3">
                        <strong className="text-danger-800">Error:</strong>
                        <pre className="mt-1 text-danger-700 whitespace-pre-wrap">
                          {error.toString()}
                        </pre>
                      </div>
                      {errorInfo && (
                        <div>
                          <strong className="text-danger-800">Component Stack:</strong>
                          <pre className="mt-1 text-danger-700 whitespace-pre-wrap text-xs overflow-auto max-h-32">
                            {errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary