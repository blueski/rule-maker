import React from 'react'

const Header = ({ activeTab, onTabChange }) => {
  return (
    <header className="bg-white shadow-soft border-b border-primary-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <button
                onClick={() => onTabChange('data-explorer')}
                className="text-3xl font-bold text-gradient tracking-tighter hover:opacity-80 transition-opacity duration-200"
              >
                RuleTune
              </button>
            </div>
            <nav className="ml-12 flex items-center space-x-1 h-full">
              <button 
                onClick={() => onTabChange('data-explorer')}
                className={`px-4 py-2 text-sm font-semibold h-full flex items-center border-b-2 transition-all duration-200 ${
                  activeTab === 'data-explorer' 
                    ? 'text-accent-600 border-accent-600 bg-accent-50' 
                    : 'text-primary-600 hover:text-accent-600 hover:bg-primary-50 border-transparent'
                }`}
              >
                Data Explorer
              </button>
              <button 
                onClick={() => onTabChange('rules')}
                className={`px-4 py-2 text-sm font-semibold h-full flex items-center border-b-2 transition-all duration-200 ${
                  activeTab === 'rules' 
                    ? 'text-accent-600 border-accent-600 bg-accent-50' 
                    : 'text-primary-600 hover:text-accent-600 hover:bg-primary-50 border-transparent'
                }`}
              >
                Rules
              </button>
              <button 
                onClick={() => onTabChange('queries')}
                className={`px-4 py-2 text-sm font-semibold h-full flex items-center border-b-2 transition-all duration-200 ${
                  activeTab === 'queries' 
                    ? 'text-accent-600 border-accent-600 bg-accent-50' 
                    : 'text-primary-600 hover:text-accent-600 hover:bg-primary-50 border-transparent'
                }`}
              >
                Queries
              </button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header