import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { WalletProvider } from './components/WalletProvider'
import Header from './components/Header'
import EventDiscovery from './components/EventDiscovery'
import EventCreationWizard from './components/EventCreationWizard'
import Dashboard from './components/Dashboard'
import { motion } from 'framer-motion'
import { initializeAnalytics } from './utils/analytics'
import { useEffect } from 'react'

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'discovery' | 'create' | 'dashboard'>('discovery')

  useEffect(() => {
    // Initialize analytics and monitoring
    initializeAnalytics()
  }, [])

  const renderContent = () => {
    switch (currentView) {
      case 'discovery':
        return <EventDiscovery />
      case 'create':
        return <EventCreationWizard />
      case 'dashboard':
        return <Dashboard />
      default:
        return <EventDiscovery />
    }
  }

  return (
    <WalletProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Header />
        
        {/* Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex space-x-8">
            <motion.button
              onClick={() => setCurrentView('discovery')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'discovery'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-700 hover:text-purple-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Discover Events
            </motion.button>
            
            <motion.button
              onClick={() => setCurrentView('create')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'create'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-700 hover:text-purple-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create Event
            </motion.button>
            
            <motion.button
              onClick={() => setCurrentView('dashboard')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'dashboard'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-700 hover:text-purple-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Dashboard
            </motion.button>
          </nav>
        </div>

        {/* Main Content */}
        <main>
          {renderContent()}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <p className="text-gray-600">
                © 2024 Monadic Meetups. Built on Monad blockchain.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </WalletProvider>
  )
}

export default App